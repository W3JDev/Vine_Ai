import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUserByEmail } from "@/lib/db-utils"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await getUserByEmail(credentials.email)

        if (!user) {
          return null
        }

        // In a real application, you would retrieve the hashed password from the database
        // For this example, we'll use a dummy password check
        const isValidPassword = credentials.password === "password123"

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || "",
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
}
