#!/usr/bin/env node

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const mode = process.argv[2] ?? "dev";
const forwardArgs = process.argv.slice(3);

const runner = process.platform === "win32" ? "npx.cmd" : "npx";

const distDir = path.join(projectRoot, ".next");
const cssDir = path.join(distDir, "static", "css");
const targetDir = path.join(cssDir, "app");
const targetPath = path.join(targetDir, "layout.css");
let lastCopiedSignature = null;

async function generateCssFallback() {
  try {
    await fs.mkdir(targetDir, { recursive: true });
    await new Promise((resolve, reject) => {
      const child = spawn(
        runner,
        [
          "tailwindcss",
          "-i",
          path.join(projectRoot, "src", "app", "globals.css"),
          "-o",
          targetPath,
          "--config",
          path.join(projectRoot, "tailwind.config.ts"),
          "--minify",
        ],
        {
          cwd: projectRoot,
          stdio: "inherit",
          shell: process.platform === "win32",
          env: process.env,
        }
      );

      child.on("exit", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`tailwindcss exited with code ${code}`));
        }
      });
    });

    lastCopiedSignature = "fallback";
    console.log(`[36m[css-sync][0m Generated app/layout.css via Tailwind fallback`);
  } catch (error) {
    console.warn(`[33m[css-sync][0m Fallback failed: ${error.message}`);
  }
}

async function pickLatestCssFile() {
  const entries = await fs.readdir(cssDir, { withFileTypes: true });
  const cssFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".css"));
  if (cssFiles.length === 0) return null;

  const stats = await Promise.all(
    cssFiles.map(async (entry) => {
      const fullPath = path.join(cssDir, entry.name);
      const stat = await fs.stat(fullPath);
      return { name: entry.name, mtimeMs: stat.mtimeMs, fullPath };
    })
  );

  stats.sort((a, b) => b.mtimeMs - a.mtimeMs);

  return stats[0];
}

async function copyLatestCssIfNeeded() {
  try {
    const latest = await pickLatestCssFile();
    if (!latest) {
      try {
        await fs.access(targetPath);
        return;
      } catch {
        await generateCssFallback();
        return;
      }
    }
    const signature = `${latest.name}:${latest.mtimeMs}`;
    if (signature === lastCopiedSignature) {
      return;
    }

    await fs.mkdir(targetDir, { recursive: true });
    await fs.copyFile(latest.fullPath, targetPath);
    lastCopiedSignature = signature;
    console.log(`\u001b[36m[css-sync]\u001b[0m Copied ${latest.name} -> app/layout.css`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`\u001b[33m[css-sync]\u001b[0m ${error.message}`);
    }
  }
}

function startCssSync(intervalMs = 2000) {
  const timer = setInterval(copyLatestCssIfNeeded, intervalMs);
  copyLatestCssIfNeeded();

  return () => {
    clearInterval(timer);
  };
}

async function run() {
  let stopCssWatcher = null;

  if (mode === "dev" || mode === "start") {
    stopCssWatcher = startCssSync();
  }

  if (mode === "build") {
    // Run build first, then copy css once.
    const buildCode = await new Promise((resolve) => {
      const child = spawn(runner, ["next", mode, ...forwardArgs], {
        cwd: projectRoot,
        stdio: "inherit",
        shell: process.platform === "win32",
        env: process.env,
      });

      child.on("exit", (code) => resolve(code ?? 0));
    });

    if (buildCode !== 0) {
      process.exit(buildCode);
    }

    await copyLatestCssIfNeeded();
    process.exit(0);
    return;
  }

  const child = spawn(runner, ["next", mode, ...forwardArgs], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

  const cleanup = (code) => {
    if (stopCssWatcher) {
      stopCssWatcher();
    }
    process.exit(code ?? 0);
  };

  process.on("SIGINT", () => {
    child.kill("SIGINT");
  });

  process.on("SIGTERM", () => {
    child.kill("SIGTERM");
  });

  child.on("exit", cleanup);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
