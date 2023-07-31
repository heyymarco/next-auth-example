import NextAuth, { NextAuthOptions, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { AdapterUser } from "next-auth/adapters"
import { NextApiRequest, NextApiResponse } from "next"
import CredentialsProvider from "next-auth/providers/credentials"
import { randomUUID } from "crypto"
import Cookies from 'cookies'



const prisma = new PrismaClient();



// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const adapter = PrismaAdapter(prisma);
export const authOptions: NextAuthOptions = {
  adapter: adapter as any,
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log('authorizing: ', credentials);
        if (!credentials) return null;
        const user = await adapter.getUserByEmail?.(credentials.username);
        console.log('authorized: ', user);
        return user ?? null;
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET,
    //   version: "2.0",
    // }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!('emailVerified' in user)) {
        const newUser : User = user;
        console.log('SIGN UP', { user, account, profile, email, credentials });
      }
      else {
        const dbUser : AdapterUser = user;
        console.log('SIGN IN', { user, account, profile, email, credentials });
      } // if
      
      
      
      if (email) {
        if (email.verificationRequest) {
          console.log('SIGN UP using email', { user, account, profile, email, credentials });
        }
        else {
          console.log('SIGN IN using email', { user, account, profile, email, credentials });
        } // if
      } // if
      
      
      
      return true;
    },
    async jwt({ token, account, profile, user }) {
      console.log('jwt: ', { token, account, profile });
      if (account) { // if `account` exist, this means that the callback is being invoked for the first time (i.e. the user is being signed in).
        token.userRole = "admin"
      } // if
      return token;
    },
    async session({ session, token, user: dbUser }) {
      // getSession(), useSession(), /api/auth/session
      console.log('session: ', { session, token, dbUser });
      // TODO: inject authorization here
      const sessionUser = session.user;
      if (sessionUser) {
        // sessionUser.roles = dbUser.roles; // the session object will be synced to the client side
      } // if
      return session;
    },
  },
  // pages: {
  //   signIn        : '/auth/signin',
  //   signOut       : '/auth/signout',
  //   error         : '/auth/error',          // Error code passed in query string as ?error=
  //   verifyRequest : '/auth/verify-request', // (used for check email message)
  //   newUser       : '/auth/new-user',       // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'HEAD') return res.status(200);
  
  await NextAuth(req, res, {
    ...authOptions,
    callbacks : {
      ...authOptions.callbacks,
      async signIn(params) {
        const { user, account, profile, email, credentials } = params;
        console.log('CREATE SESSION: ', {
          incCallback: req.query.nextauth?.includes('callback'),
          incCred : req.query.nextauth?.includes('credentials'),
          method: req.method,
          user, account, profile, email, credentials,
        })
        if (credentials) {
          console.log('credentials: ', credentials);
          
          const sessionToken  = randomUUID();
          const sessionExpiry = new Date(Date.now() + (24 * 3600 * 1000));
          await adapter.createSession?.({
            sessionToken : sessionToken,
            userId       : user.id,
            expires      : sessionExpiry,
          });
          
          
          
          const cookies = new Cookies(req,res);
          cookies.set('next-auth.session-token', sessionToken, {
            expires: sessionExpiry
          });
          
          
          
          console.log('created session: ', { sessionToken, sessionExpiry });
          return true;
        } // if
        
        
        
        return await authOptions.callbacks?.signIn?.(params) ?? false;
      },
    },
    jwt : {
      async encode(params) {
        const cookies = new Cookies(req,res);
        const cookie = cookies.get('next-auth.session-token');
        return cookie ?? '';
      },
      async decode(params) {
        return null;
      }
    },
  });
}
// export default NextAuth(authOptions)
