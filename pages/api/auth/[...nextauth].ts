import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../libs/models/user";
import AuthService from "../../../libs/services/auth-service";

const authService = new AuthService();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials, _req) {
        return await authService.login({
          username: credentials?.username ?? "",
          password: credentials?.password ?? "",
        });
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ session, token }) {
      // @ts-ignore https://github.com/nextauthjs/next-auth/discussions/2762#discussioncomment-1332952
      session.user = token.user;

      await validateAccessToken(token.user);

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        await validateAccessToken(token.user);
      }

      return token;
    },
  },
};

async function validateAccessToken(user: User) {
  const accessToken = user?.access_token;
  return await authService.me(accessToken);
}

export default NextAuth(authOptions);
