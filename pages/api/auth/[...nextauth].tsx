// react:
import {
    // utilities:
    renderToStaticMarkup,
}                           from 'react-dom/server'

// nextJS:
import {
    // types:
    type NextApiRequest,
    type NextApiResponse,
}                           from 'next'

// next auth:
import {
    // types:
    type NextAuthOptions,
    type SessionOptions,
    
    
    
    // routers:
    default as NextAuth,
    
    
    
    // models:
    type User,
}                           from 'next-auth'
import {
    // cryptos:
    encode,
    decode,
}                           from 'next-auth/jwt'
import {
    // databases:
    PrismaAdapter,
}                           from '@auth/prisma-adapter'
import {
    // models:
    type AdapterUser,
}                           from 'next-auth/adapters'

// credentials providers:
import CredentialsProvider  from 'next-auth/providers/credentials'

// OAuth providers:
import GoogleProvider       from 'next-auth/providers/google'
import FacebookProvider     from 'next-auth/providers/facebook'
import InstagramProvider    from 'next-auth/providers/instagram'
import TwitterProvider      from 'next-auth/providers/twitter'
import GithubProvider       from 'next-auth/providers/github'

// webs:
import {
    default as Cookies,
}                           from 'cookies'
import {
    default as nodemailer,
}                           from 'nodemailer'

// cryptos:
import {
    randomUUID,
}                           from 'crypto'
import {
    customAlphabet,
}                           from 'nanoid/async'
import {
    default as bcrypt,
}                           from 'bcrypt'

// formats:
import {
    default as moment,
}                           from 'moment'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// templates:
import {
    // react components:
    UserContextProvider,
}                           from '@/templates/UserContextProvider'
import {
    // react components:
    ResetPasswordContextProvider,
}                           from '@/templates/ResetPasswordContextProvider'
import {
    // react components:
    User as TemplateUser,
}                           from '@/templates/User'
import {
    // react components:
    ResetPassword,
}                           from '@/templates/ResetPassword'

// configs:
import {
    default as authConfig,
}                           from '@/auth.config'
import {
    default as credentialsConfig,
}                           from '@/credentials.config'



const transporter = nodemailer.createTransport({
    host     :  process.env.EMAIL_RESET_SERVER_HOST ?? '',
    port     : Number.parseInt(process.env.EMAIL_RESET_SERVER_PORT ?? '465'),
    secure   : (process.env.EMAIL_RESET_SERVER_SECURE === 'true'),
    auth     : {
        user :  process.env.EMAIL_RESET_SERVER_USERNAME,
        pass :  process.env.EMAIL_RESET_SERVER_PASSWORD,
    },
});



const adapter = PrismaAdapter(prisma);
const session : SessionOptions = {
    strategy  : 'database',
    
    maxAge    : (authConfig.SESSION_MAX_AGE    ?? 24) * 60 * 60, // hours
    updateAge : (authConfig.SESSION_UPDATE_AGE ??  6) * 60 * 60, // hours
    
    generateSessionToken() {
        return randomUUID();
    },
};
export const authOptions: NextAuthOptions = {
    adapter   : adapter as any,
    session   : session,
    providers : [
        // credentials providers:
        CredentialsProvider({
            name         : 'Credentials',
            credentials  : {
                username : { label: 'Username or Email', type: 'text'    , placeholder: 'jsmith' },
                password : { label: 'Password'         , type: 'password'                        },
            },
            async authorize(credentials, req): Promise<AdapterUser|null> {
                // conditions:
                if (!credentials) return null; // a credentials must be provided to be verified
                
                
                
                // get user data by given username (or email):
                const userDetail = await prisma.user.findFirst({
                    where  :
                        credentials.username.includes('@') // if username contains '@' => treat as email, otherwise regular username
                        ? {
                            email        : credentials.username,
                        }
                        : {
                            credentials  : {
                                username : credentials.username,
                            },
                        },
                    select : {
                        id               : true, // required: for id key
                        
                        name             : true, // optional: for profile name
                        email            : true, // required: for email account linking
                        emailVerified    : true, // required: for distinguish between `AdapterUser` vs `User`
                        image            : true, // optional: for profile image
                        
                        credentials      : {
                            select       : {
                                password : true, // required: for password hash comparison
                            },
                        },
                    },
                });
                if (!userDetail) return null; // no user found with given username (or email) => return null (not found)
                
                
                
                // remove credentials property to increase security strength:
                const {
                    credentials : expectedCredentials,
                    ...restAdapterUser
                } = userDetail;
                
                
                
                // perform password hash comparison:
                if (!expectedCredentials) return null; // no credential was configured on the user's account => unable to compare => return null (assumes as password do not match)
                if (!(await bcrypt.compare(credentials.password, expectedCredentials.password ?? ''))) return null; // password hash comparison do not match => return null (password do not match)
                
                
                
                // the verification passed => authorized => return An `AdapterUser` object:
                return restAdapterUser;
            },
        }),
        
        // OAuth providers:
        GoogleProvider({
            clientId     : process.env.GOOGLE_ID,
            clientSecret : process.env.GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        FacebookProvider({
            clientId     : process.env.FACEBOOK_ID,
            clientSecret : process.env.FACEBOOK_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        InstagramProvider({
            clientId     : process.env.INSTAGRAM_ID,
            clientSecret : process.env.INSTAGRAM_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        TwitterProvider({
            clientId     : process.env.TWITTER_ID,
            clientSecret : process.env.TWITTER_SECRET,
            version      : '2.0',
            allowDangerousEmailAccountLinking: true,
        }),
        GithubProvider({
            clientId     : process.env.GITHUB_ID,
            clientSecret : process.env.GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks : {
        async signIn({ user, account, credentials, profile: oAuthProfile }) {
            if (!('emailVerified' in user)) {
                // sign up (register a new user)
                
                
                
                // if sign up is disabled => refuse any registration:
                const envUserSignupEnable = process.env.USER_SIGNUP_ENABLE ?? '';
                const    userSignupEnable = (
                    !!envUserSignupEnable
                    ? (envUserSignupEnable === 'true')
                    : authConfig.USER_SIGNUP_ENABLE
                );
                if (!userSignupEnable) return false;
                
                
                
                const newUser : User = user;
                if (!newUser.name ) return false; // the name  field is required to be stored to model User => sign up failed
                if (!newUser.email) return false; // the email field is required to be stored to model User => sign up failed
            }
            else {
                // sign in (existing user)
                
                
                
                // const dbUser : AdapterUser = user;
            } // if
            
            
            
            // all verification passed => logged in
            return true;
        },
        async jwt({ token, user, account, profile: oAuthProfile }) {
            // assigning userRole(s):
            if (account) { // if `account` exist, this means that the callback is being invoked for the first time (i.e. the user is being signed in).
                token.userRole ='admin';
            } // if
            
            
            
            // the token object will be attached to the client side cookie:
            return token;
        },
        async session({ session, user: dbUser, token }) {
            // assigning userRole(s):
            const sessionUser = session.user;
            if (sessionUser) {
                // sessionUser.userRole ='admin';
            } // if
            
            
            
            // the session object will be synced to the client side:
            return session;
        },
    },
    pages     : {
        signIn        : '/auth/login',
     // signOut       : '/auth/signout',
     // error         : '/auth/error',          // Error code passed in query string as ?error=
     // verifyRequest : '/auth/verify-request', // (used for check email message)
     // newUser       : '/auth/new-user',       // New users will be directed here on first sign in (leave the property out if not of interest)
    },
};

async function handlePasswordReset(path: string, req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  return (
    await handleRequestPasswordReset(path, req, res)
    ||
    await handleValidatePasswordReset(path, req, res)
    ||
    await handleApplyPasswordReset(path, req, res)
  );
}
async function handleRequestPasswordReset(path: string, req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  if (req.method !== 'POST')            return false; // ignore
  if (req.query.nextauth?.[0] !== path) return false; // ignore
  
  
  
  const {
    username,
  } = req.body;
  if (!username || (typeof(username) !== 'string')) {
    res.status(400).json({
      error: 'The required username or email is not provided.',
    });
    return true; // handled with error
  } // if
  
  
  
  const resetToken  = await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)();
  const resetMaxAge = (((authConfig.EMAIL_RESET_MAX_AGE ?? 24) || (1 * 24)) * 60 * 60 /* 1 day */) * 1000; // convert to milliseconds
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
    if (userId === undefined) return Error('There is no user with the specified username or email.', { cause: 404 });
    
    
    
    const resetLimitInHours = (authConfig.EMAIL_RESET_LIMITS ?? 0.25);
    if (resetLimitInHours) {
      // const now = new Date(Date.now() - (resetLimitInHours * 60 * 60 * 1000 /* convert to milliseconds */));
      const {updatedAt} = await prismaTransaction.resetPasswordToken.findUnique({
        where       : {
          userId    : userId,
        },
        select      : {
          updatedAt : true,
        },
      }) ?? {};
      const now         = Date.now();
      const minInterval = (resetLimitInHours * 60 * 60 * 1000 /* convert to milliseconds */);
      if (!!updatedAt && ((now - updatedAt.valueOf()) <= minInterval)) {
        // the reset request is too frequent => reject:
        return Error(`The password reset request is too often. Please try again ${moment(now).to(updatedAt.valueOf() + minInterval)}.`, { cause: 400 });
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
    res.status(Number.parseInt(user.cause as any) || 400).json({
      error: user.message,
    });
    return true; // handled with error
  } // if
  
  
  
  try {
    const resetLinkUrl = `${process.env.WEBSITE_URL}/auth/login?resetPasswordToken=${encodeURIComponent(resetToken)}`
    await transporter.sendMail({
      from    : process.env.EMAIL_RESET_FROM, // sender address
      to      : user.email, // list of receivers
      subject : (authConfig.EMAIL_RESET_SUBJECT ?? 'Password Reset Request'),
      html    : renderToStaticMarkup(
        <ResetPasswordContextProvider url={resetLinkUrl}>
          <UserContextProvider model={user}>
            {
              authConfig.EMAIL_RESET_MESSAGE
              ??
              <>
                  <p>Hi <TemplateUser.Name />.</p>
                  <p><strong>Forgot your password?</strong><br />We received a request to reset the password for your account.</p>
                  <p>To reset your password, click on the link below:<br /><ResetPassword.Link>Reset Password</ResetPassword.Link></p>
                  <p>Or copy and paste the URL into your browser:<br /><u><ResetPassword.Url /></u></p>
                  <p>If you did not make this request then please ignore this email.</p>
              </>
            }
          </UserContextProvider>
        </ResetPasswordContextProvider>
      )
    });
    
    
    
    res.json({
      ok      : true,
      message : 'A password reset link sent to your email. Please check your inbox in a moment.',
    });
    return true; // handled with success
  }
  catch (error: any) {
    res.status(500).json({
      error: 'An error occured.',
    });
    return true; // handled with error
  } // try
}
async function handleValidatePasswordReset(path: string, req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  if (req.method !== 'GET')             return false; // ignore
  if (req.query.nextauth?.[0] !== path) return false; // ignore
  
  
  
  await new Promise((resolved) => {
    setTimeout(resolved, 2000);
  });
  
  
  
  const {
    resetPasswordToken,
  } = req.query;
  if ((typeof(resetPasswordToken) !== 'string') || !resetPasswordToken) {
    res.status(400).json({
      error: 'The required reset password token is not provided.',
    });
    return true; // handled with error
  } // if
  
  
  
  try {
    const user = await prisma.user.findFirst({
      where                : {
        resetPasswordToken : {
          token            : resetPasswordToken,
          expiresAt        : {
            gt             : new Date(Date.now()),
          },
        },
      },
      select               : {
        email              : true,
        credentials        : {
          select           : {
            username       : true,
          },
        },
      },
    });
    if (!user) {
      res.status(404).json({
        error: 'The reset password token is invalid or expired.',
      });
      return true; // handled with error
    } // if
    
    
    
    res.json({
      ok       : true,
      email    : user.email,
      username : user.credentials?.username ?? null,
    });
    return true; // handled with success
  }
  catch (error: any) {
    res.status(500).json({
      error: 'An error occured.',
    });
    return true; // handled with error
  } // try
}
async function handleApplyPasswordReset(path: string, req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  if (req.method !== 'PATCH')           return false; // ignore
  if (req.query.nextauth?.[0] !== path) return false; // ignore
  
  
  
  await new Promise((resolved) => {
    setTimeout(resolved, 2000);
  });
  
  
  
  const {
    resetPasswordToken,
    password,
  } = req.body;
  if (!resetPasswordToken || (typeof(resetPasswordToken) !== 'string')) {
    res.status(400).json({
      error: 'The required resetPasswordToken is not provided.',
    });
    return true; // handled with error
  } // if
  if (!password || (typeof(password) !== 'string')) {
    res.status(400).json({
      error: 'The required password is not provided.',
    });
    return true; // handled with error
  } // if
  const passwordMinLength = credentialsConfig.PASSWORD_MIN_LENGTH;
  if ((typeof(passwordMinLength) === 'number') && Number.isFinite(passwordMinLength) && (password.length < passwordMinLength)) {
    res.status(400).json({
      error: `The password is too short. Minimum is ${passwordMinLength} characters.`,
    });
    return true; // handled with error
  } // if
  const passwordMaxLength = credentialsConfig.PASSWORD_MAX_LENGTH;
  if ((typeof(passwordMaxLength) === 'number') && Number.isFinite(passwordMaxLength) && (password.length > passwordMaxLength)) {
    res.status(400).json({
      error: `The password is too long. Maximum is ${passwordMaxLength} characters.`,
    });
    return true; // handled with error
  } // if
  const passwordHasUppercase = credentialsConfig.PASSWORD_HAS_UPPERCASE;
  if (passwordHasUppercase && !password.match(/[A-Z]/)) {
    res.status(400).json({
      error: `The password must have at least one capital letter.`,
    });
    return true; // handled with error
  } // if
  const passwordHasLowercase = credentialsConfig.PASSWORD_HAS_LOWERCASE;
  if (passwordHasLowercase && !password.match(/[a-z]/)) {
    res.status(400).json({
      error: `The password must have at least one non-capital letter.`,
    });
    return true; // handled with error
  } // if
  const hashedPassword = await bcrypt.hash(password, 10);
  
  
  
  try {
    return await prisma.$transaction(async (prismaTransaction): Promise<boolean> => {
      const { id: userId } = await prismaTransaction.user.findFirst({
        where                : {
          resetPasswordToken : {
            token            : resetPasswordToken,
            expiresAt        : {
              gt             : new Date(Date.now()),
            },
          },
        },
        select               : {
          id                 : true,
        },
      }) ?? {};
      if (!userId) {
        res.status(404).json({
          error: 'The reset password token is invalid or expired.',
        });
        return true; // handled with error
      } // if
      
      
      
      await prismaTransaction.resetPasswordToken.delete({
        where    : {
          userId : userId,
        },
        select   : {
          id     : true,
        },
      });
      
      
      
      await prismaTransaction.credentials.upsert({
        where      : {
          userId   : userId,
        },
        create     : {
          userId   : userId,
          password : hashedPassword,
        },
        update     : {
          password : hashedPassword,
        },
        select     : {
          id       : true,
        },
      });
      
      
      
      res.json({
        ok       : true,
        message  : 'The password has been successfully changed. Now you can login with the new password.',
      });
      return true; // handled with success
    });
  }
  catch (error: any) {
    res.status(500).json({
      error: 'An error occured.',
    });
    return true; // handled with error
  } // try
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
