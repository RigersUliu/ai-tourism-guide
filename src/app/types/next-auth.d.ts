import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string; // Add the accessToken property
  }

  interface JWT {
    accessToken?: string; // Add accessToken to the JWT as well
  }
}
