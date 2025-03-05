import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    //! Add your Google OAuth client ID and secret here
    // GoogleProvider({
    //   clientId: ,
    //   clientSecret: ,
    // }),
    //? Add other providers as needed
  ],
  pages: {
    signIn: "/login", //? Customize the sign-in page URL if needed
  },
  session: {
    strategy: 'jwt' as const, //! Use JWT to manage sessions
  },
};

export default NextAuth(authOptions);
