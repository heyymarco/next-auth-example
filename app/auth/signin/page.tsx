'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
}                           from 'react'

// next:
import {
    // navigations:
    useRouter,
    usePathname,
    useSearchParams,
}                           from 'next/navigation'

// next auth:
import {
    // types:
    type BuiltInProviderType,
}                           from 'next-auth/providers'
import {
    // types:
    type LiteralUnion,
    
    
    
    // apis:
    signIn,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    Icon,
    Label,
    ButtonIcon,
    TextInput,
    PasswordInput,
    EmailInput,
    
    
    
    // layout-components:
    ListItem,
    List,
    CardBody,
    
    
    
    // status-components:
    Busy,
    
    
    
    // notification-components:
    Tooltip,
    
    
    
    // composite-components:
    Group,
    TabPanel,
    Tab,
}                           from '@reusable-ui/components'

// internal components:
import {
    // dialog-components:
    ModalStatus,
}                           from '@/components/ModalStatus'
import {
    // dialogs:
    useDialogMessage,
}                           from '@/hooks/dialogMessage'

// other libs:
import axios                from 'axios'

// configs:
import {
    default as credentialsConfig,
}                           from '@/credentials.config'



// contexts:
interface SigninApi {
    // states:
    expandedTabIndex   : number
    callbackUrl        : string|null
    resetPasswordToken : string|null
    
    
    
    // navigations:
    backSignIn         : () => void
}
const SigninContext = createContext<SigninApi>({
    // states:
    expandedTabIndex   : 0,
    callbackUrl        : null,
    resetPasswordToken : null,
    
    
    
    // navigations:
    backSignIn         : () => {},
});
const useSigninContext = (): SigninApi => {
    return useContext(SigninContext);
};



// utilities:
const invalidSelector = ':is(.invalidating, .invalidated)';
const getAuthErrorDescription = (errorCode: string): React.ReactNode => {
    switch (errorCode) {
        case 'SessionRequired'   : // the content of this page requires you to be signed in at all times
            return <p>You are not signed in. Please <strong>sign in to continue</strong>.</p>;
        
        case 'CredentialsSignin' : // the authorize callback returned null in the Credentials provider
            return <p>Sign in failed. Make sure <strong>your username (or email)</strong> and <strong>your password</strong> are correct.</p>;
        
        case 'OAuthSignin'       : // error in constructing an authorization URL
        case 'OAuthCallback'     : // error in handling the response from an OAuth provider
        case 'OAuthCreateAccount': // could not create OAuth provider user in the database
        case 'Callback'          : // error in the OAuth callback handler route
            return <p>Sign in failed. Make sure you have <strong>granted access</strong> from your 3rd party account.</p>;
        
        case 'AccessDenied'      :
            return <p>You do <strong>not have permission</strong> to sign in.</p>;
        
        case 'Verification'      :
            return <p>The token has <strong>expired</strong> or has <strong>already been used</strong>.</p>;
        
        case 'Configuration'     :
            return <>
                <p>There is a problem with the <strong>server configuration</strong>.</p>
                <p>Please contact our technical support for assistance.</p>
            </>;
        
        case 'Default'           :
        default                  :
            return <p>Oops, an <strong>error occured</strong>.</p>;
    } // switch
};



// handlers:
const handlePreventSubmit : React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
};



// react components:
const SignIn     = () => {
    // navigations:
    const router       = useRouter();
    const pathName     = usePathname() ?? '/'
    const searchParams = useSearchParams();
    
    
    
    // states:
    const callbackUrlRef                          = useRef<string|null>(searchParams?.get('callbackUrl'       ) || null);
    const resetPasswordTokenRef                   = useRef<string|null>(searchParams?.get('resetPasswordToken') || null);
    const [expandedTabIndex, setExpandedTabIndex] = useState<number>(!!resetPasswordTokenRef.current ? 2 : 0);
    
    
    
    // dialogs:
    const {
        showMessageError,
    } = useDialogMessage();
    
    
    
    // dom effects:
    
    // displays an error passed by `next-auth`:
    useEffect(() => {
        // conditions:
        const error = searchParams?.get('error');
        if (!error) return; // no error passed => ignore
        
        
        
        // report the failure:
        showMessageError(getAuthErrorDescription(error));
    }, []);
    
    // remove passed queryString(s):
    useEffect(() => {
        // conditions:
        if (
            !searchParams?.get('error')
            &&
            !searchParams?.get('callbackUrl')
            &&
            !searchParams?.get('resetPasswordToken')
        ) return; // no queryString(s) passed => nothing to remove => ignore
        
        
        
        try {
            // get current browser's queryString:
            const newSearchParams = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
            
            // remove `?error=***` on browser's url:
            newSearchParams.delete('error');
            
            // remove `?callbackUrl=***` on browser's url:
            newSearchParams.delete('callbackUrl');
            
            // remove `?resetPasswordToken=***` on browser's url:
            newSearchParams.delete('resetPasswordToken');
            
            // update browser's url:
            router.replace(`${pathName}${!!newSearchParams.size ? `?${newSearchParams}` : ''}`, { scroll: false });
        }
        catch {
            // ignore any error
        } // if
    }, []);
    
    
    
    // stable callbacks:
    const backSignIn = useEvent(() => {
        setExpandedTabIndex(0);
    });
    
    
    
    // handlers:
    const handleBackSignIn = backSignIn;
    const handleGotoReset  = useEvent(() => {
        setExpandedTabIndex(1);
    });
    const handleBackHome   = useEvent(() => {
        router.push('/');
    });
    
    
    
    // jsx:
    const ButtonGotoHome   = () => {
        // jsx:
        return (
            <ButtonIcon
                // appearances:
                icon='home'
                
                
                
                // variants:
                buttonStyle='link'
                
                
                
                // handlers:
                onClick={handleBackHome}
            >
                Back to Home
            </ButtonIcon>
        );
    };
    const ButtonGotoSignIn = () => {
        // jsx:
        return (
            <ButtonIcon
                // appearances:
                icon='arrow_back'
                
                
                
                // variants:
                buttonStyle='link'
                
                
                
                // handlers:
                onClick={handleBackSignIn}
            >
                Back to Sign In Page
            </ButtonIcon>
        );
    };
    const ButtonGotoReset  = () => {
        // jsx:
        return (
            <ButtonIcon
                // appearances:
                icon='help_center'
                
                
                
                // variants:
                buttonStyle='link'
                
                
                
                // handlers:
                onClick={handleGotoReset}
            >
                Forgot Password?
            </ButtonIcon>
        );
    };
    return (
        <Content theme='primary'>
            <SigninContext.Provider value={useMemo(() => ({
                expandedTabIndex   : expandedTabIndex,
                callbackUrl        : callbackUrlRef.current,
                resetPasswordToken : resetPasswordTokenRef.current,
                
                backSignIn         : backSignIn,
            }), [expandedTabIndex])}>
                <Tab
                    // identifiers:
                    id='tabSignIn'
                    
                    
                    
                    // states:
                    expandedTabIndex={expandedTabIndex}
                    
                    
                    
                    // components:
                    bodyComponent={<Content mild={true} />}
                >
                    <TabPanel label='Sign In'>
                        <TabSignIn />
                        <ButtonGotoReset />
                        <ButtonGotoHome />
                    </TabPanel>
                    <TabPanel label='Recovery'>
                        <TabForgot />
                        <ButtonGotoSignIn />
                        <ButtonGotoHome />
                    </TabPanel>
                    <TabPanel label='Reset'>
                        <TabReset />
                        <ButtonGotoSignIn />
                        <ButtonGotoHome />
                    </TabPanel>
                </Tab>
            </SigninContext.Provider>
        </Content>
    )
};
export default SignIn;

const TabSignIn  = () => {
    // navigations:
    const router = useRouter();
    
    
    
    // contexts:
    const {
        // states:
        expandedTabIndex,
        callbackUrl,
    } = useSigninContext();
    
    
    
    // redirects:
    const loggedInRedirectPath = callbackUrl || '/'; // redirect to origin page if sign in is successful
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFieldError,
        showMessageNotification,
    } = useDialogMessage();
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [username        , setUsername        ] = useState<string>('');
    const [password        , setPassword        ] = useState<string>('');
    
    const isMounted       = useMountedFlag();
    let   [busy, setBusy] = useState<string>('');
    
    
    
    // refs:
    const formSignInRef = useRef<HTMLFormElement|null>(null);
    const usernameRef   = useRef<HTMLInputElement|null>(null);
    
    
    
    // dom effects:
    
    // focus on username field when the <TabSignIn> is active:
    useEffect(() => {
        // conditions:
        if (expandedTabIndex !== 0) return; // <TabSignIn> is NOT active => ignore
        
        
        
        // actions:
        usernameRef.current?.focus();
    }, [expandedTabIndex]);
    
    // resets input states when the <TabSignIn> is NOT active:
    useEffect(() => {
        // conditions:
        if (expandedTabIndex === 0) return; // <TabSignIn> is active => ignore
        
        
        
        // resets:
        setEnableValidation(false);
        setUsername('');
        setPassword('');
    }, [expandedTabIndex]);
    
    
    
    // handlers:
    const handleSignInUsingCredentials = useEvent(async (): Promise<void> => {
        // conditions:
        if (busy) return; // ignore when busy
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (!isMounted.current) return; // unmounted => abort
        const invalidFields = formSignInRef?.current?.querySelectorAll?.(invalidSelector);
        if (invalidFields?.length) { // there is an/some invalid field
            showMessageFieldError(invalidFields);
            return;
        } // if
        
        
        
        // attempts sign in using credentials:
        setBusy(busy = 'credentials'); // mark as busy
        const result = await signIn('credentials', { username, password, redirect: false });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // verify the sign in status:
        if (!result?.ok) { // error
            setBusy(busy = ''); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPassword('');
            
            
            
            // report the failure:
            await showMessageError(getAuthErrorDescription(result?.error ?? 'CredentialsSignin'));
            
            
            
            // focus to username field:
            usernameRef.current?.setSelectionRange(0, username.length);
            usernameRef.current?.focus();
        }
        else { // success
            // resets:
            setUsername('');
            setPassword('');
            
            
            
            // redirect to origin page:
            router.replace(loggedInRedirectPath);
        } // if
    });
    const handleSignInUsingOAuth       = useEvent(async (providerType: LiteralUnion<BuiltInProviderType>): Promise<void> => {
        // conditions:
        if (busy) return; // ignore when busy
        
        
        
        // attempts sign in using OAuth:
        setBusy(busy = providerType); // mark as busy
        const result = await signIn(providerType, { callbackUrl: loggedInRedirectPath });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // verify the sign in status:
        if ((result !== undefined) && !result?.ok) { // error
            setBusy(busy = ''); // unmark as busy
            
            
            
            // report the failure:
            showMessageError(getAuthErrorDescription(result?.error ?? 'OAuthSignin'));
        }
        else { // success
            // report the success:
            showMessageNotification(
                <p>You are being redirected to <strong>{providerType} sign in page</strong>. Please wait...</p>
            );
        } // if
    });
    const handleSignInUsingGoogle      = useEvent(async (): Promise<void> => {
        await handleSignInUsingOAuth('google');
    });
    const handleSignInUsingFacebook    = useEvent(async (): Promise<void> => {
        await handleSignInUsingOAuth('facebook');
    });
    const handleSignInUsingInstagram   = useEvent(async (): Promise<void> => {
        await handleSignInUsingOAuth('instagram');
    });
    const handleSignInUsingTwitter     = useEvent(async (): Promise<void> => {
        await handleSignInUsingOAuth('twitter');
    });
    const handleSignInUsingGithub      = useEvent(async (): Promise<void> => {
        await handleSignInUsingOAuth('github');
    });
    
    const handleUsernameChange         = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {value}}) => {
        setUsername(value);
    });
    const handlePasswordChange         = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {value}}) => {
        setPassword(value);
    });
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={formSignInRef}
            
            
            
            // validations:
            noValidate={true}
            
            
            
            // handlers:
            onSubmit={handlePreventSubmit}
        >
            <AccessibilityProvider
                // accessibilities:
                enabled={!busy} // disabled if busy
            >
                <ValidationProvider
                    // validations:
                    enableValidation={enableValidation}
                >
                    <Group>
                        <Label
                            // classes:
                            className='solid'
                        >
                            <Icon
                                // appearances:
                                icon='supervisor_account'
                            />
                        </Label>
                        <TextInput
                            // refs:
                            elmRef={usernameRef}
                            
                            
                            
                            // accessibilities:
                            placeholder='Username or Email'
                            autoComplete='username'
                            
                            
                            
                            // values:
                            value={username}
                            onChange={handleUsernameChange}
                            
                            
                            
                            // validations:
                            isValid={username.length >= 1}
                            required={true}
                        />
                    </Group>
                    <Group>
                        <Label
                            // classes:
                            className='solid'
                        >
                            <Icon
                                // appearances:
                                icon='lock'
                            />
                        </Label>
                        <PasswordInput
                            // accessibilities:
                            placeholder='Password'
                            autoComplete='current-password'
                            
                            
                            
                            // values:
                            value={password}
                            onChange={handlePasswordChange}
                            
                            
                            
                            // validations:
                            isValid={password.length >= 1}
                            required={true}
                        />
                    </Group>
                    <ButtonIcon
                        // actions:
                        type='submit'
                        
                        
                        
                        // appearances:
                        icon={(busy === 'credentials') ? 'busy' : 'login'}
                        
                        
                        
                        // handlers:
                        onClick={handleSignInUsingCredentials}
                    >
                        Sign In
                    </ButtonIcon>
                    <hr />
                    <ButtonIcon
                        // appearances:
                        icon={(busy === 'google') ? 'busy' : 'login'}
                        
                        
                        
                        // handlers:
                        onClick={handleSignInUsingGoogle}
                    >
                        Sign In using Google
                    </ButtonIcon>
                    <ButtonIcon
                        // appearances:
                        icon={(busy === 'facebook') ? 'busy' : 'facebook'}
                        
                        
                        
                        // handlers:
                        onClick={handleSignInUsingFacebook}
                    >
                        Sign In using Facebook
                    </ButtonIcon>
                    <ButtonIcon
                        // appearances:
                        icon={(busy === 'instagram') ? 'busy' : 'instagram'}
                        
                        
                        
                        // handlers:
                        onClick={handleSignInUsingInstagram}
                    >
                        Sign In using Instagram
                    </ButtonIcon>
                    <ButtonIcon
                        // appearances:
                        icon={(busy === 'twitter') ? 'busy' : 'login'}
                        
                        
                        
                        // handlers:
                        onClick={handleSignInUsingTwitter}
                    >
                        Sign In using Twitter
                    </ButtonIcon>
                    <ButtonIcon
                        // appearances:
                        icon={(busy === 'github') ? 'busy' : 'login'}
                        
                        
                        
                        // handlers:
                        onClick={handleSignInUsingGithub}
                    >
                        Sign In using Github
                    </ButtonIcon>
                </ValidationProvider>
            </AccessibilityProvider>
        </form>
    );
};
const TabForgot = () => {
    // contexts:
    const {
        // states:
        expandedTabIndex,
        
        
        
        // navigations:
        backSignIn,
    } = useSigninContext();
    
    
    
    // dialogs:
    const {
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
    } = useDialogMessage();
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [username        , setUsername        ] = useState<string>('');
    
    const isMounted       = useMountedFlag();
    let   [busy, setBusy] = useState<boolean>(false);
    
    
    
    // refs:
    const formForgotRef = useRef<HTMLFormElement|null>(null);
    const usernameRef   = useRef<HTMLInputElement|null>(null);
    
    
    
    // dom effects:
    
    // focus on username field when the <TabForgot> is active:
    useEffect(() => {
        // conditions:
        if (expandedTabIndex !== 1) return; // <TabForgot> is NOT active => ignore
        
        
        
        // actions:
        usernameRef.current?.focus();
    }, [expandedTabIndex]);
    
    // resets input states when the <TabForgot> is NOT active:
    useEffect(() => {
        // conditions:
        if (expandedTabIndex === 1) return; // <TabForgot> is active => ignore
        
        
        
        // resets:
        setEnableValidation(false);
        setUsername('');
    }, [expandedTabIndex]);
    
    
    
    // handlers:
    const handleRequestPasswordReset = useEvent(async (): Promise<void> => {
        // conditions:
        if (busy) return; // ignore when busy
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (!isMounted.current) return; // unmounted => abort
        const invalidFields = formForgotRef?.current?.querySelectorAll?.(invalidSelector);
        if (invalidFields?.length) { // there is an/some invalid field
            showMessageFieldError(invalidFields);
            return;
        } // if
        
        
        
        // attempts request password reset:
        setBusy(busy = true); // mark as busy
        try {
            const result = await axios.post('/api/auth/reset', { username });
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // success
            
            
            
            setBusy(busy = false); // unmark as busy
            
            
            
            // report the success:
            await showMessageSuccess(
                <p>
                    {result.data.message ?? 'A password reset link sent to your email. Please check your inbox in a moment.'}
                </p>
            );
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // redirect to sign in tab:
            backSignIn();
        }
        catch (error: any) { // error
            setBusy(busy = false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            
            
            
            // report the failure:
            await showMessageFetchError(error);
            
            
            
            // focus to username field:
            usernameRef.current?.setSelectionRange(0, username.length);
            usernameRef.current?.focus();
        } // try
    });
    
    const handleUsernameChange       = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {value}}) => {
        setUsername(value);
    });
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={formForgotRef}
            
            
            
            // validations:
            noValidate={true}
            
            
            
            // handlers:
            onSubmit={handlePreventSubmit}
        >
            <AccessibilityProvider
                // accessibilities:
                enabled={!busy} // disabled if busy
            >
                <ValidationProvider
                    // validations:
                    enableValidation={enableValidation}
                >
                    <Group>
                        <Label
                            // classes:
                            className='solid'
                        >
                            <Icon
                                // appearances:
                                icon='supervisor_account'
                            />
                        </Label>
                        <TextInput
                            // refs:
                            elmRef={usernameRef}
                            
                            
                            
                            // accessibilities:
                            placeholder='Username or Email'
                            autoComplete='username'
                            
                            
                            
                            // values:
                            value={username}
                            onChange={handleUsernameChange}
                            
                            
                            
                            // validations:
                            isValid={username.length >= 1}
                            required={true}
                        />
                    </Group>
                    <ButtonIcon
                        // actions:
                        type='submit'
                        
                        
                        
                        // appearances:
                        icon={busy ? 'busy' : 'lock_open'}
                        
                        
                        
                        // handlers:
                        onClick={handleRequestPasswordReset}
                    >
                        Send Reset Password Link
                    </ButtonIcon>
                </ValidationProvider>
            </AccessibilityProvider>
        </form>
    );
};
const TabReset  = () => {
    // contexts:
    const {
        // states:
        resetPasswordToken,
        
        
        
        // navigations:
        backSignIn,
    } = useSigninContext();
    
    
    
    // dialogs:
    const {
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
    } = useDialogMessage();
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [password        , setPassword        ] = useState<string>('');
    const [password2       , setPassword2       ] = useState<string>('');
    
    const [verified, setVerified] = useState<undefined|{ email: string, username: string|null }|false>(!resetPasswordToken ? false : undefined);
    
    const [passwordFocused , setPasswordFocused ] = useState<boolean>(false);
    const [password2Focused, setPassword2Focused] = useState<boolean>(false);
    
    const isMounted       = useMountedFlag();
    let   [busy, setBusy] = useState<boolean>(false);
    
    
    
    // refs:
    const formResetRef = useRef<HTMLFormElement|null>(null);
    const passwordRef  = useRef<HTMLInputElement|null>(null);
    const password2Ref = useRef<HTMLInputElement|null>(null);
    
    
    
    // dom effects:
    
    // validate password reset token at startup:
    const hasInitialized = useRef(false); // make sure the validation is never performed twice
    useEffect(() => {
        // conditions:
        if (!resetPasswordToken   ) return; // no token => nothing to reset => ignore
        if (verified !== undefined) return; // already verified with success/failed result => ignore
        if (hasInitialized.current) return; // already performed => ignore
        hasInitialized.current = true;      // mark as performed
        
        
        
        // actions:
        (async () => {
            // attempts validate password reset:
            try {
                const result = await axios.get(`/api/auth/reset?resetPasswordToken=${encodeURIComponent(resetPasswordToken)}`);
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                // success
                
                
                
                // save the success:
                setVerified(result.data);
            }
            catch (error: any) { // error
                // save the failure:
                setVerified(false);
                
                
                
                // report the failure:
                await showMessageFetchError(error);
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                const errorCode     = error?.response?.status;
                const isClientError = (typeof(errorCode) === 'number') && ((errorCode >= 400) && (errorCode <= 499));
                if (isClientError) {
                    // redirect to sign in tab:
                    backSignIn();
                } // if
                // nothing to do with unverified token & server_side_error => keeps the UI disabled
                // else {
                //     // focus to password field:
                //     passwordRef.current?.setSelectionRange(0, password.length);
                //     passwordRef.current?.focus();
                // } // if
            } // try
        })();
    }, [resetPasswordToken, verified]);
    
    // focus on password field after successfully verified the password reset token:
    useEffect(() => {
        // conditions:
        if (!verified) return; // NOT verified with success result => ignore
        
        
        
        // actions:
        passwordRef.current?.focus();
    }, [verified]);
    
    
    
    // handlers:
    const handleDoPasswordReset = useEvent(async (): Promise<void> => {
        // conditions:
        if (busy) return; // ignore when busy
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (!isMounted.current) return; // unmounted => abort
        const invalidFields = formResetRef?.current?.querySelectorAll?.(invalidSelector);
        if (invalidFields?.length) { // there is an/some invalid field
            showMessageFieldError(invalidFields);
            return;
        } // if
        
        
        
        // attempts apply password reset:
        setBusy(busy = true); // mark as busy
        try {
            const result = await axios.patch('/api/auth/reset', { resetPasswordToken, password });
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // success
            
            
            
            setBusy(busy = false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPassword('');
            setPassword2('');
            setPasswordFocused(false);  // important to hide the <Tooltip>
            setPassword2Focused(false); // important to hide the <Tooltip>
            
            
            
            // report the success:
            await showMessageSuccess(
                <p>
                    {result.data.message ?? 'The password has been successfully changed. Now you can sign in with the new password.'}
                </p>
            );
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // redirect to sign in tab:
            backSignIn();
        }
        catch (error: any) { // error
            setBusy(busy = false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPasswordFocused(false);  // important to hide the <Tooltip>
            setPassword2Focused(false); // important to hide the <Tooltip>
            
            
            
            // report the failure:
            await showMessageFetchError(error);
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            const errorCode     = error?.response?.status;
            const isClientError = (typeof(errorCode) === 'number') && ((errorCode >= 400) && (errorCode <= 499));
            if (isClientError) {
                // redirect to sign in tab:
                backSignIn();
            }
            else {
                // focus to password field:
                passwordRef.current?.setSelectionRange(0, password.length);
                passwordRef.current?.focus();
            } // if
        } // try
    });
    
    const handlePasswordChange  = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {value}}) => {
        setPassword(value);
    });
    const handlePasswordFocus   = useEvent((): void => {
        setPasswordFocused(true);
    });
    const handlePasswordBlur    = useEvent((): void => {
        setPasswordFocused(false);
    });
    
    const handlePassword2Change = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {value}}) => {
        setPassword2(value);
    });
    const handlePassword2Focus  = useEvent((): void => {
        setPassword2Focused(true);
    });
    const handlePassword2Blur   = useEvent((): void => {
        setPassword2Focused(false);
    });
    
    
    
    // fn props:
    const passwordMinLength            = credentialsConfig.PASSWORD_MIN_LENGTH;
    const passwordMaxLength            = credentialsConfig.PASSWORD_MAX_LENGTH;
    const passwordHasUppercase         = credentialsConfig.PASSWORD_HAS_UPPERCASE;
    const passwordHasLowercase         = credentialsConfig.PASSWORD_HAS_LOWERCASE;
    
    const passwordValidationLength     = (
        (password.length >= passwordMinLength)
        &&
        (password.length <= passwordMaxLength)
    );                                         // min-max characters
    const passwordValidationUppercase  = (
        !passwordHasUppercase
        ||
        !!password.match(/[A-Z]/)
    );                                         // At least one capital letter
    const passwordValidationLowercase  = (
        !passwordHasLowercase
        ||
        !!password.match(/[a-z]/)
    );                                         // At least one non-capital letter
    
    const password2ValidationLength    = (
        (password2.length >= passwordMinLength)
        &&
        (password2.length <= passwordMaxLength)
    );                                         // min-max characters
    const password2ValidationUppercase = (
        !passwordHasUppercase
        ||
        !!password2.match(/[A-Z]/)
    );                                         // At least one capital letter
    const password2ValidationLowercase = (
        !passwordHasLowercase
        ||
        !!password2.match(/[a-z]/)
    );                                         // At least one non-capital letter
    const password2ValidationMatch     = (
        !!password
        &&
        (password2 === password)
    );                                         // Exact match to previous password
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={formResetRef}
            
            
            
            // validations:
            noValidate={true}
            
            
            
            // handlers:
            onSubmit={handlePreventSubmit}
        >
            <AccessibilityProvider
                // accessibilities:
                enabled={!busy && !!verified} // disabled if busy or not_verified
            >
                <ValidationProvider
                    // validations:
                    enableValidation={enableValidation}
                >
                    <Group>
                        <Label
                            // classes:
                            className='solid'
                        >
                            <Icon
                                // appearances:
                                icon='supervisor_account'
                            />
                        </Label>
                        <EmailInput
                            // accessibilities:
                            readOnly={true}
                            
                            
                            
                            // values:
                            value={(!!verified && verified?.email) || ''}
                        />
                    </Group>
                    <Group>
                        <Label
                            // classes:
                            className='solid'
                        >
                            <Icon
                                // appearances:
                                icon='lock'
                            />
                        </Label>
                        <PasswordInput
                            // refs:
                            elmRef={passwordRef}
                            
                            
                            
                            // accessibilities:
                            placeholder='New Password'
                            autoComplete='new-password'
                            
                            
                            
                            // values:
                            value={password}
                            onChange={handlePasswordChange}
                            
                            
                            
                            // validations:
                            isValid={
                                passwordValidationLength
                                &&
                                passwordValidationUppercase
                                &&
                                passwordValidationLowercase
                            }
                            required={true}
                            // minLength={passwordMinLength} // validate on JS level
                            // maxLength={passwordMaxLength} // validate on JS level
                            
                            
                            
                            // handlers:
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                        />
                    </Group>
                    <Group>
                        <Label
                            // classes:
                            className='solid'
                        >
                            <Icon
                                // appearances:
                                icon='lock'
                            />
                        </Label>
                        <PasswordInput
                            // refs:
                            elmRef={password2Ref}
                            
                            
                            
                            // accessibilities:
                            placeholder='Confirm New Password'
                            autoComplete='new-password'
                            
                            
                            
                            // values:
                            value={password2}
                            onChange={handlePassword2Change}
                            
                            
                            
                            // validations:
                            isValid={
                                password2ValidationLength
                                &&
                                password2ValidationUppercase
                                &&
                                password2ValidationLowercase
                                &&
                                password2ValidationMatch
                            }
                            required={true}
                            // minLength={passwordMinLength} // validate on JS level
                            // maxLength={passwordMaxLength} // validate on JS level
                            
                            
                            
                            // handlers:
                            onFocus={handlePassword2Focus}
                            onBlur={handlePassword2Blur}
                        />
                    </Group>
                    <Tooltip
                        // variants:
                        theme='warning'
                        
                        
                        
                        // states:
                        expanded={passwordFocused && !busy}
                        
                        
                        
                        // floatable:
                        floatingOn={passwordRef}
                        floatingPlacement='bottom'
                    >
                        <List
                            // variants:
                            listStyle='flat'
                        >
                            <ListItem
                                // variants:
                                size='sm'
                                theme={passwordValidationLength ? 'success' : 'danger'}
                                outlined={true}
                            >
                                <Icon
                                    // appearances:
                                    icon={passwordValidationLength ? 'check' : 'error_outline'}
                                />
                                &nbsp;
                                {passwordMinLength}-{passwordMaxLength} characters
                            </ListItem>
                            {!!passwordHasUppercase && <ListItem
                                // variants:
                                size='sm'
                                theme={passwordValidationUppercase ? 'success' : 'danger'}
                                outlined={true}
                            >
                                <Icon
                                    // appearances:
                                    icon={passwordValidationUppercase ? 'check' : 'error_outline'}
                                />
                                &nbsp;
                                At least one capital letter
                            </ListItem>}
                            {!!passwordHasLowercase && <ListItem
                                // variants:
                                size='sm'
                                theme={passwordValidationLowercase ? 'success' : 'danger'}
                                outlined={true}
                            >
                                <Icon
                                    // appearances:
                                    icon={passwordValidationLowercase ? 'check' : 'error_outline'}
                                />
                                &nbsp;
                                At least one non-capital letter
                            </ListItem>}
                        </List>
                    </Tooltip>
                    <Tooltip
                        // variants:
                        theme='warning'
                        
                        
                        
                        // states:
                        expanded={password2Focused && !busy}
                        
                        
                        
                        // floatable:
                        floatingOn={password2Ref}
                        floatingPlacement='bottom'
                    >
                        <List
                            // variants:
                            listStyle='flat'
                        >
                            <ListItem
                                // variants:
                                size='sm'
                                theme={password2ValidationLength ? 'success' : 'danger'}
                                outlined={true}
                            >
                                <Icon
                                    // appearances:
                                    icon={password2ValidationLength ? 'check' : 'error_outline'}
                                />
                                &nbsp;
                                {passwordMinLength}-{passwordMaxLength} characters
                            </ListItem>
                            {!!passwordHasUppercase && <ListItem
                                // variants:
                                size='sm'
                                theme={password2ValidationUppercase ? 'success' : 'danger'}
                                outlined={true}
                            >
                                <Icon
                                    // appearances:
                                    icon={password2ValidationUppercase ? 'check' : 'error_outline'}
                                />
                                &nbsp;
                                At least one capital letter
                            </ListItem>}
                            {!!passwordHasLowercase && <ListItem
                                // variants:
                                size='sm'
                                theme={password2ValidationLowercase ? 'success' : 'danger'}
                                outlined={true}
                            >
                                <Icon
                                    // appearances:
                                    icon={password2ValidationLowercase ? 'check' : 'error_outline'}
                                />
                                &nbsp;
                                At least one non-capital letter
                            </ListItem>}
                            <ListItem
                                // variants:
                                size='sm'
                                theme={password2ValidationMatch ? 'success' : 'danger'}
                                outlined={true}
                            >
                                <Icon
                                    // appearances:
                                    icon={password2ValidationMatch ? 'check' : 'error_outline'}
                                />
                                &nbsp;
                                Exact match to previous password
                            </ListItem>
                        </List>
                    </Tooltip>
                    <ButtonIcon
                        // actions:
                        type='submit'
                        
                        
                        
                        // appearances:
                        icon={busy ? 'busy' : 'save'}
                        
                        
                        
                        // handlers:
                        onClick={handleDoPasswordReset}
                    >
                        Reset password
                    </ButtonIcon>
                </ValidationProvider>
            </AccessibilityProvider>
            <ModalStatus
                // variants:
                theme='primary'
                
                
                
                // global stackable:
                viewport={formResetRef}
            >
                {(verified === undefined) && <CardBody>
                    <p>
                        <Busy />
                        &nbsp;
                        validating...
                    </p>
                </CardBody>}
            </ModalStatus>
        </form>
    );
};
