import NextAuth, { NextAuthOptions, SessionOptions, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import GithubProvider from 'next-auth/providers/github'
import TwitterProvider from 'next-auth/providers/twitter'
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { AdapterUser } from 'next-auth/adapters'
import { NextApiRequest, NextApiResponse } from 'next'
import CredentialsProvider from 'next-auth/providers/credentials'

import { randomUUID } from 'crypto'
import Cookies from 'cookies'
import { encode, decode } from 'next-auth/jwt'
import bcrypt from 'bcrypt'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const adapter = PrismaAdapter(prisma);
const session : SessionOptions = {
  strategy  : 'database',
  
  maxAge    : 1 * 24 * 60 * 60, // 1 day
  updateAge :      6 * 60 * 60, // 6 hours
  
  generateSessionToken() {
    return randomUUID();
  },
};
export const authOptions: NextAuthOptions = {
  adapter   : adapter as any,
  session   : session,
  providers : [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        // const userDetail = await adapter.getUserByEmail?.(credentials.username);
        const userDetail = await prisma.user.findUnique({
          where  : {
            [credentials.username.includes('@') ? 'email' : 'username'] : credentials.username,
          } as any,
          select : {
            id            : true,
            
            name          : true,
            email         : true,
            emailVerified : true,
            image         : true,
            
            username      : true,
            password      : true,
          },
        });
        if (!userDetail) return null;
        const {password, ...userInfo} = userDetail;
        if (!(await bcrypt.compare(credentials.password, password ?? ''))) return null;
        return userInfo;
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
  callbacks : {
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
  
  const isCredentialsCallback = () => (
    (req.method === 'POST')
    &&
    req.query.nextauth
    &&
    req.query.nextauth.includes('callback')
    &&
    req.query.nextauth.includes('credentials')
  );
  
  await NextAuth(req, res, {
    ...authOptions,
    callbacks : {
      ...authOptions.callbacks,
      async signIn(params) {
        if ((session.strategy === 'database') && isCredentialsCallback()) {
          const { user } = params;
          
          const sessionToken  = await session.generateSessionToken();
          const sessionMaxAge = session.maxAge * 1000; // convert to milliseconds
          const sessionExpiry = new Date(Date.now() + sessionMaxAge);
          
          await adapter.createSession?.({
            sessionToken : sessionToken,
            expires      : sessionExpiry,
            
            userId       : user.id,
          });
          
          const cookies = new Cookies(req, res);
          cookies.set('next-auth.session-token', sessionToken, {
            expires      : sessionExpiry
          });
        } // if
        
        
        
        return await authOptions.callbacks?.signIn?.(params) ?? true;
      },
    },
    jwt : {
      async encode(params) {
        if ((session.strategy === 'database') && isCredentialsCallback()) return ''; // force not to use jwt token => fallback to database token
        
        
        
        return encode(params);
      },
      async decode(params) {
        if ((session.strategy === 'database') && isCredentialsCallback()) return null; // force not to use jwt token => fallback to database token
        
        
        
        return decode(params);
      }
    },
  });
}
