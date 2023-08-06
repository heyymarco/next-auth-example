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



// contexts:
interface LoginApi {
    // states:
    expandedTabIndex   : number
    callbackUrl        : string|null
    resetPasswordToken : string|null
    
    
    
    // navigations:
    backLogin          : () => void
}
const LoginContext = createContext<LoginApi>({
    // states:
    expandedTabIndex   : 0,
    callbackUrl        : null,
    resetPasswordToken : null,
    
    
    
    // navigations:
    backLogin          : () => {},
});
const useLoginContext = (): LoginApi => {
    return useContext(LoginContext);
};



// utilities:
const invalidSelector = ':is(.invalidating, .invalidated)';
const getAuthErrorDescription = (errorCode: string): React.ReactNode => {
    switch (errorCode) {
        case 'SessionRequired'   : // the content of this page requires you to be signed in at all times
            return <p>You are not logged in. Please <strong>login to continue</strong>.</p>;
        
        case 'CredentialsSignin' : // the authorize callback returned null in the Credentials provider
            return <p>Login failed. Make sure <strong>your username (or email)</strong> and <strong>your password</strong> are correct.</p>;
        
        case 'OAuthSignin'       : // error in constructing an authorization URL
        case 'OAuthCallback'     : // error in handling the response from an OAuth provider
        case 'OAuthCreateAccount': // could not create OAuth provider user in the database
        case 'Callback'          : // error in the OAuth callback handler route
            return <p>Login failed. Make sure you have <strong>granted access</strong> from your 3rd party account.</p>;
        
        case 'Default':
        default:
            return <p>Oops, an <strong>error occured</strong>.</p>;
    } // switch
};



// handlers:
const handlePreventSubmit : React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
};



// react components:
const Login     = () => {
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
    const backLogin = useEvent(() => {
        setExpandedTabIndex(0);
    });
    
    
    
    // handlers:
    const handleBackLogin = backLogin;
    const handleGotoReset = useEvent(() => {
        setExpandedTabIndex(1);
    });
    const handleBackHome  = useEvent(() => {
        router.push('/');
    });
    
    
    
    // jsx:
    const ButtonGotoHome  = () => {
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
    const ButtonGotoLogin = () => {
        // jsx:
        return (
            <ButtonIcon
                // appearances:
                icon='arrow_back'
                
                
                
                // variants:
                buttonStyle='link'
                
                
                
                // handlers:
                onClick={handleBackLogin}
            >
                Back to Login Page
            </ButtonIcon>
        );
    };
    const ButtonGotoReset = () => {
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
            <LoginContext.Provider value={useMemo(() => ({
                expandedTabIndex   : expandedTabIndex,
                callbackUrl        : callbackUrlRef.current,
                resetPasswordToken : resetPasswordTokenRef.current,
                
                backLogin          : backLogin,
            }), [expandedTabIndex])}>
                <Tab
                    // identifiers:
                    id='tabLogin'
                    
                    
                    
                    // states:
                    expandedTabIndex={expandedTabIndex}
                    
                    
                    
                    // components:
                    bodyComponent={<Content mild={true} />}
                >
                    <TabPanel label='Login'>
                        <TabLogin />
                        <ButtonGotoReset />
                        <ButtonGotoHome />
                    </TabPanel>
                    <TabPanel label='Recovery'>
                        <TabForgot />
                        <ButtonGotoLogin />
                        <ButtonGotoHome />
                    </TabPanel>
                    <TabPanel label='Reset'>
                        <TabReset />
                        <ButtonGotoLogin />
                        <ButtonGotoHome />
                    </TabPanel>
                </Tab>
            </LoginContext.Provider>
        </Content>
    )
};
export default Login;

const TabLogin  = () => {
    // navigations:
    const router = useRouter();
    
    
    
    // contexts:
    const {
        // states:
        expandedTabIndex,
        callbackUrl,
    } = useLoginContext();
    
    
    
    // redirects:
    const loggedInRedirectPath = callbackUrl || '/'; // redirect to origin page if login is successful
    
    
    
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
    const formLoginRef = useRef<HTMLFormElement|null>(null);
    const usernameRef  = useRef<HTMLInputElement|null>(null);
    
    
    
    // dom effects:
    
    // focus on username field when the <TabLogin> is active:
    useEffect(() => {
        // conditions:
        if (expandedTabIndex !== 0) return; // <TabLogin> is NOT active => ignore
        
        
        
        // actions:
        usernameRef.current?.focus();
    }, [expandedTabIndex]);
    
    // resets input states when the <TabLogin> is NOT active:
    useEffect(() => {
        // conditions:
        if (expandedTabIndex === 0) return; // <TabLogin> is active => ignore
        
        
        
        // resets:
        setEnableValidation(false);
        setUsername('');
        setPassword('');
    }, [expandedTabIndex]);
    
    
    
    // handlers:
    const handleLoginUsingCredentials = useEvent(async (): Promise<void> => {
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
        const invalidFields = formLoginRef?.current?.querySelectorAll?.(invalidSelector);
        if (invalidFields?.length) { // there is an/some invalid field
            showMessageFieldError(invalidFields);
            return;
        } // if
        
        
        
        // attempts login with credentials:
        setBusy(busy = 'credentials'); // mark as busy
        const result = await signIn('credentials', { username, password, redirect: false });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // verify the login status:
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
    const handleLoginUsingOAuth       = useEvent(async (providerType: LiteralUnion<BuiltInProviderType>): Promise<void> => {
        // conditions:
        if (busy) return; // ignore when busy
        
        
        
        // attempts login with OAuth:
        setBusy(busy = providerType); // mark as busy
        const result = await signIn(providerType, { callbackUrl: loggedInRedirectPath });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // verify the login status:
        if ((result !== undefined) && !result?.ok) { // error
            setBusy(busy = ''); // unmark as busy
            
            
            
            // report the failure:
            showMessageError(getAuthErrorDescription(result?.error ?? 'OAuthSignin'));
        }
        else { // success
            // report the success:
            showMessageNotification(
                <p>You are being redirected to <strong>{providerType} login page</strong>. Please wait...</p>
            );
        } // if
    });
    const handleLoginUsingFacebook    = useEvent(async (): Promise<void> => {
        await handleLoginUsingOAuth('facebook');
    });
    const handleLoginUsingGithub      = useEvent(async (): Promise<void> => {
        await handleLoginUsingOAuth('github');
    });
    
    const handleUsernameChange        = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {value}}) => {
        setUsername(value);
    });
    const handlePasswordChange        = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {value}}) => {
        setPassword(value);
    });
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={formLoginRef}
            
            
            
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
                        onClick={handleLoginUsingCredentials}
                    >
                        Login
                    </ButtonIcon>
                    <hr />
                    <ButtonIcon
                        // appearances:
                        icon={(busy === 'facebook') ? 'busy' : 'facebook'}
                        
                        
                        
                        // handlers:
                        onClick={handleLoginUsingFacebook}
                    >
                        Login with Facebook
                    </ButtonIcon>
                    <ButtonIcon
                        // appearances:
                        icon={(busy === 'login') ? 'busy' : 'login'}
                        
                        
                        
                        // handlers:
                        onClick={handleLoginUsingGithub}
                    >
                        Login with Github
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
        backLogin,
    } = useLoginContext();
    
    
    
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
            
            
            
            // redirect to login tab:
            backLogin();
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
        backLogin,
    } = useLoginContext();
    
    
    
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
                    // redirect to login tab:
                    backLogin();
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
                    {result.data.message ?? 'The password has been successfully changed. Now you can login with the new password.'}
                </p>
            );
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // redirect to login tab:
            backLogin();
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
                // redirect to login tab:
                backLogin();
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
    const passwordValidationLength   = (password.length >= 5) && (password.length <= 20);   // 5-20 characters
    const passwordValidationCapital  = !!password.match(/[A-Z]/);                           // At least one capital letter
    
    const password2ValidationLength  = (password2.length >= 5) && (password2.length <= 20); // 5-20 characters
    const password2ValidationCapital = !!password2.match(/[A-Z]/);                          // At least one capital letter
    const password2ValidationMatch   = !!password && (password2 === password);              // Exact match to previous password
    
    
    
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
                                passwordValidationCapital
                            }
                            required={true}
                            
                            
                            
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
                                password2ValidationCapital
                                &&
                                password2ValidationMatch
                            }
                            required={true}
                            
                            
                            
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
                                5-20 characters
                            </ListItem>
                            <ListItem
                                // variants:
                                size='sm'
                                theme={passwordValidationCapital ? 'success' : 'danger'}
                                outlined={true}
                            >
                                <Icon
                                    // appearances:
                                    icon={passwordValidationCapital ? 'check' : 'error_outline'}
                                />
                                &nbsp;
                                At least one capital letter
                            </ListItem>
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
                                5-20 characters
                            </ListItem>
                            <ListItem
                                // variants:
                                size='sm'
                                theme={password2ValidationCapital ? 'success' : 'danger'}
                                outlined={true}
                            >
                                <Icon
                                    // appearances:
                                    icon={password2ValidationCapital ? 'check' : 'error_outline'}
                                />
                                &nbsp;
                                At least one capital letter
                            </ListItem>
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
