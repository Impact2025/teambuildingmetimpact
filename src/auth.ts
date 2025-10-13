import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Role } from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const authHandler = NextAuth({
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const valid = await verifyPassword(password, user.hashedPassword);

        if (!valid) {
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = (token.id as string) ?? session.user.id;
        session.user.role = (token.role as Role | undefined) ?? session.user.role;
        session.user.name = (token.name as string | undefined) ?? session.user.name;
      }
      return session;
    },
  },
});

export const { auth, signIn, signOut } = authHandler;
export const GET = authHandler.handlers.GET;
export const POST = authHandler.handlers.POST;
