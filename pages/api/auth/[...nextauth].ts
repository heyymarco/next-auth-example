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
import { customAlphabet } from 'nanoid/async'
import Cookies from 'cookies'
import { encode, decode } from 'next-auth/jwt'
import bcrypt from 'bcrypt'

import { default as nodemailer } from 'nodemailer'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'



const transporter = nodemailer.createTransport({
  host   : process.env.EMAIL_RESET_SERVER_HOST ?? '',
  port   : Number.parseInt(process.env.EMAIL_RESET_SERVER_PORT ?? '465'),
  secure : (process.env.EMAIL_RESET_SERVER_SECURE === 'true'),
  auth   : {
    user: process.env.EMAIL_RESET_SERVER_USER,
    pass: process.env.EMAIL_RESET_SERVER_PASSWORD,
  },
});



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
        username: { label: 'Username or Email', type: 'text'    , placeholder: 'jsmith' },
        password: { label: 'Password'         , type: 'password'                        },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        // const userDetail = await adapter.getUserByEmail?.(credentials.username);
        const userDetail = await prisma.user.findFirst({
          where  :
            credentials.username.includes('@')
            ? {
              email : credentials.username,
            }
            : {
              credentials   : {
                username    : credentials.username,
              },
            },
          select : {
            id            : true,
            
            name          : true,
            email         : true,
            emailVerified : true,
            image         : true,
            
            credentials   : {
              select : {
                password  : true,
              },
            },
          },
        });
        if (!userDetail) return null;
        const { credentials : credentials2, ...userInfo } = userDetail;
        if (!credentials2) return null;
        if (!(await bcrypt.compare(credentials.password, credentials2.password ?? ''))) return null;
        return userInfo;
      },
    }),
    FacebookProvider({
      clientId     : process.env.FACEBOOK_ID,
      clientSecret : process.env.FACEBOOK_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId     : process.env.GITHUB_ID,
      clientSecret : process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // GoogleProvider({
    //   clientId     : process.env.GOOGLE_ID,
    //   clientSecret : process.env.GOOGLE_SECRET,
    // }),
    // TwitterProvider({
    //   clientId     : process.env.TWITTER_ID,
    //   clientSecret : process.env.TWITTER_SECRET,
    //   version      : '2.0',
    // }),
  ],
  callbacks : {
    async signIn({ user, account, profile, email, credentials }) {
      if (!('emailVerified' in user)) {
        const newUser : User = user;
        if (!newUser.name ) return false; // the name  field is required to be stored to model User
        if (!newUser.email) return false; // the email field is required to be stored to model User
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
        token.userRole ='admin'
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
  pages: {
    signIn        : '/auth/login',
  //   signOut       : '/auth/signout',
  //   error         : '/auth/error',          // Error code passed in query string as ?error=
  //   verifyRequest : '/auth/verify-request', // (used for check email message)
  //   newUser       : '/auth/new-user',       // New users will be directed here on first sign in (leave the property out if not of interest)
  },
}

async function handlePasswordReset(path: string, req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  if (req.method !== 'POST') return false;
  if (req.query.nextauth?.[0] !== path) return false;
  
  
  
  const {
    username,
  } = req.body;
  if (!username || (typeof(username) !== 'string')) {
    res.status(400).end();
    return true;
  } // if
  
  
  
  const resetToken  = await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)();
  const resetMaxAge = ((Number.parseFloat(process.env.EMAIL_RESET_MAX_AGE ?? '24') || (1 * 24)) * 60 * 60 /* 1 day */) * 1000; // convert to milliseconds
  const resetExpiry = new Date(Date.now() + resetMaxAge);
  const user = await prisma.$transaction(async (prismaTransaction) => {
    const { id: userId } = await prismaTransaction.user.findFirst({
      where  :
        username.includes('@')
        ? {
          email       : username,
        }
        : {
          credentials : {
            username  : username,
          },
        },
      select : {
        id : true,
      },
    }) ?? {};
    if (userId === undefined) return Error('USER_NOT_FOUND');
    
    
    
    const resetLimitInMinutes = Number.parseFloat(process.env.EMAIL_RESET_LIMITS ?? '5');
    if (resetLimitInMinutes) {
      const {updatedAt} = await prismaTransaction.resetPasswordToken.findUnique({
        where       : {
          userId    : userId,
        },
        select      : {
          updatedAt : true,
        },
      }) ?? {};
      if (!!updatedAt && (updatedAt > new Date(Date.now() - (resetLimitInMinutes * 60 * 1000 /* convert to milliseconds */)))) {
        // the reset request is too frequent => reject:
        return Error('REQUEST_TOO_FREQUENT');
      } // if
    } // if
    
    
    
    const {user} = await prismaTransaction.resetPasswordToken.upsert({
      where       : {
        userId    : userId,
      },
      create      : {
        userId    : userId,
        
        expiresAt : resetExpiry,
        token     : resetToken
      },
      update      : {
        expiresAt : resetExpiry,
        token     : resetToken,
      },
      select      : {
        user      : {
          select  : {
            name  : true,
            email : true,
          },
        },
      },
    });
    return user;
  });
  if (user instanceof Error) {
    console.log(user);
    res.status(400).end();
    return true;
  } // if
  
  
  
  try {
    const resetLinkUrl = `${process.env.WEBSITE_URL}/auth/login?resetPasswordToken=${encodeURIComponent(resetToken)}`
    const sent = await transporter.sendMail({
      from    : process.env.EMAIL_RESET_FROM, // sender address
      to      : user.email, // list of receivers
      subject : process.env.EMAIL_RESET_SUBJECT ?? 'Password Reset Request',
      html    : (
        process.env.EMAIL_RESET_MESSAGE
        ??
`<p>Hi {{user.name}}.</p>
<p><strong>Forgot your password?</strong><br />We received a request to reset the password for your account.</p>
<p>To reset your password, click on the link below:<br />{{ResetLink}}</p>
<p>Or copy and paste the URL into your browser:<br /><u>{{ResetLinkAsText}}</u></p>
<p>If you did not make this request then please ignore this email.</p>
`
      )
      .replace('{{user.name}}'  , user.name)
      .replace('{{ResetLink}}', `<a href="${resetLinkUrl}">Reset Password</a>`)
      .replace('{{ResetLinkAsText}}'  , resetLinkUrl)
    });
    console.log('email sent: ', sent);
  }
  catch (error: any) {
    console.log('email not sent: ', error);
    res.status(500).end();
    return true;
  } // try
  
  
  
  res.json({
    ok: true,
    username,
    user : user.name,
    email: user.email,
    message: 'password reset sent!',
  });
  return true;
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'HEAD') return res.status(200);
  
  if (await handlePasswordReset('reset', req, res)) return;
  
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
