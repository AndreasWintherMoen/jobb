import NextAuth, { NextAuthOptions } from 'next-auth';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [],
};

export default NextAuth(authOptions);
