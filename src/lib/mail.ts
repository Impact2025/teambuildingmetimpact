import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    console.warn("[mail] SMTP configuratie ontbreekt; e-mails worden gelogd in plaats van verzonden.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendMail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  bcc?: string | string[];
}) {
  if (!transporter) {
    transporter = createTransporter();
  }

  if (!transporter) {
    console.log("[mail] ->", options);
    return;
  }

  const from = process.env.MAIL_FROM ?? "no-reply@teambuildingmetimpact.nl";

  await transporter.sendMail({
    from,
    ...options,
  });
}
