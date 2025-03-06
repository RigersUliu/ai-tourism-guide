import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string; // Add the accessToken property
  }

  interface JWT {
    accessToken?: string; // Add accessToken to the JWT as well
  }
}
