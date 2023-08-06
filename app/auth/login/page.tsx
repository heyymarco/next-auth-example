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
    EventHandler,
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
    
    
    
    // color options of UI:
    ThemeName,
}                           from '@reusable-ui/core'

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    Icon,
    Button,
    ButtonIcon,
    CloseButton,
    TextInput,
    PasswordInput,
    EmailInput,
    
    
    
    // layout-components:
    ListItem,
    List,
    CardHeader,
    CardFooter,
    CardBody,
    
    
    
    // status-components:
    Busy,
    
    
    
    // notification-components:
    Tooltip,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    
    
    
    // composite-components:
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
                        <TabForget />
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
    useEffect(() => {
        // resets:
        setEnableValidation(false);
        setUsername('');
        setPassword('');
        setBusy(busy = '');
    }, [expandedTabIndex]); // resets input states when expandedTabIndex changed
    
    
    
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
        if (!busy)              return; // reseted   => abort
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
        if (!busy)              return; // reseted   => abort
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
                enabled={!busy}
            >
                <ValidationProvider
                    // validations:
                    enableValidation={enableValidation}
                >
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
const TabForget = () => {
    // contexts:
    const {
        expandedTabIndex,
        
        backLogin,
    } = useLoginContext();
    
    
    
    // dialogs:
    const {
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
    } = useDialogMessage();
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState(false);
    const [username        , setUsername        ] = useState('');
    
    const isMounted       = useMountedFlag();
    let   [busy, setBusy] = useState(false);
    
    
    
    // refs:
    const formForgetRef = useRef<HTMLFormElement|null>(null);
    const usernameRef   = useRef<HTMLInputElement|null>(null);
    
    
    
    // dom effects:
    useEffect(() => {
        // resets:
        setEnableValidation(false);
        setUsername('');
    }, [expandedTabIndex]); // resets input states when expandedTabIndex changed
    
    
    
    // handlers:
    const handleRequestPasswordReset = useEvent(async () => {
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
        if (!isMounted.current) return;
        const invalidFields = formForgetRef?.current?.querySelectorAll?.(invalidSelector);
        if (invalidFields?.length) { // there is an/some invalid field
            showMessageFieldError(invalidFields);
            return;
        } // if
        
        
        
        // attempts request password reset:
        setBusy(busy = true); // mark as busy
        try {
            const result = await axios.post('/api/auth/reset', {
                username,
            });
            if (!isMounted.current) return;
            
            
            
            setBusy(busy = false); // unmark as busy
            
            
            
            // report the success:
            await showMessageSuccess(
                <p>
                    {result.data.message ?? 'A password reset link sent to your email. Please check your inbox in a moment.'}
                </p>
            );
            if (!isMounted.current) return;
            
            
            
            // redirect to login tab:
            backLogin();
        }
        catch (error: any) {
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
        <form ref={formForgetRef} noValidate={true} onSubmit={handlePreventSubmit}>
            <AccessibilityProvider enabled={!busy}>
                <ValidationProvider enableValidation={enableValidation}>
                    <TextInput elmRef={usernameRef} placeholder='Username or Email' autoComplete='username'         required={true} isValid={username.length >= 1} value={username} onChange={handleUsernameChange} />
                    <ButtonIcon type='submit' icon={busy ? 'busy' : 'lock_open'} onClick={handleRequestPasswordReset}>
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
        resetPasswordToken,
        
        backLogin,
    } = useLoginContext();
    
    
    
    // dialogs:
    const {
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
    } = useDialogMessage();
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState(false);
    const [password        , setPassword        ] = useState('');
    const [password2       , setPassword2       ] = useState('');
    
    const [verified, setVerified] = useState<null|{email: string, username: string|null}|false>(!resetPasswordToken ? false : null);
    
    const [passwordFocused , setPasswordFocused ] = useState(false);
    const [password2Focused, setPassword2Focused] = useState(false);
    
    const isMounted       = useMountedFlag();
    let   [busy, setBusy] = useState(false);
    
    
    
    // refs:
    const formResetRef = useRef<HTMLFormElement|null>(null);
    const passwordRef  = useRef<HTMLInputElement|null>(null);
    const password2Ref = useRef<HTMLInputElement|null>(null);
    
    
    
    // dom effects:
    const hasInitialized = useRef(false); // make sure the validation is never performed twice
    useEffect(() => {
        // conditions:
        if (!resetPasswordToken   ) return;
        if (verified !== null     ) return;
        if (hasInitialized.current) return;
        hasInitialized.current = true; // mark as initialized
        
        
        
        // actions:
        (async () => {
            // attempts validate password reset:
            try {
                const result = await axios.get(`/api/auth/reset?resetPasswordToken=${encodeURIComponent(resetPasswordToken)}`);
                if (!isMounted.current) return;
                
                
                
                // save the success:
                setVerified(result.data);
            }
            catch (error: any) {
                // save the failure:
                setVerified(false);
                
                
                
                // report the failure:
                await showMessageFetchError(error);
                if (!isMounted.current) return;
                
                
                
                const errorCode     = error?.response?.status;
                const isClientError = (errorCode >= 400) && (errorCode <= 499);
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
        })();
    }, [resetPasswordToken, verified]);
    
    useEffect(() => {
        if (!verified) return;
        passwordRef.current?.focus();
    }, [verified]);
    
    
    
    // handlers:
    const handleDoPasswordReset = useEvent(async () => {
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
        if (!isMounted.current) return;
        const invalidFields = formResetRef?.current?.querySelectorAll?.(invalidSelector);
        if (invalidFields?.length) { // there is an/some invalid field
            showMessageFieldError(invalidFields);
            return;
        } // if
        
        
        
        // attempts apply password reset:
        setBusy(busy = true); // mark as busy
        try {
            const result = await axios.patch('/api/auth/reset', {
                resetPasswordToken,
                password,
            });
            if (!isMounted.current) return;
            
            
            
            setBusy(busy = false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPassword('');
            setPassword2('');
            setPasswordFocused(false);
            setPassword2Focused(false);
            
            
            
            // report the success:
            await showMessageSuccess(
                <p>
                    {result.data.message ?? 'The password has been successfully changed. Now you can login with the new password.'}
                </p>
            );
            if (!isMounted.current) return;
            
            
            
            // redirect to login tab:
            backLogin();
        }
        catch (error: any) {
            setBusy(busy = false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPasswordFocused(false);
            setPassword2Focused(false);
            
            
            
            // report the failure:
            await showMessageFetchError(error);
            if (!isMounted.current) return;
            
            
            
            const errorCode     = error?.response?.status;
            const isClientError = (errorCode >= 400) && (errorCode <= 499);
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
    const handlePasswordFocus   = useEvent(() => {
        setPasswordFocused(true);
    });
    const handlePasswordBlur    = useEvent(() => {
        setPasswordFocused(false);
    });
    
    const handlePassword2Change = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {value}}) => {
        setPassword2(value);
    });
    const handlePassword2Focus  = useEvent(() => {
        setPassword2Focused(true);
    });
    const handlePassword2Blur   = useEvent(() => {
        setPassword2Focused(false);
    });
    
    
    
    // fn props:
    const passwordValidationLength   = (password.length >= 5) && (password.length <= 20);
    const passwordValidationCapital  = !!password.match(/[A-Z]/);
    
    const password2ValidationLength  = (password2.length >= 5) && (password2.length <= 20);
    const password2ValidationCapital = !!password2.match(/[A-Z]/);
    const password2ValidationMatch   = !!password && (password2 === password);
    
    
    
    // jsx:
    return (
        <form ref={formResetRef} noValidate={true} onSubmit={handlePreventSubmit}>
            <AccessibilityProvider enabled={!busy && !!verified}>
                <ValidationProvider enableValidation={enableValidation}>
                    <EmailInput readOnly={true} value={(!!verified && verified?.email) || ''} />
                    <PasswordInput
                        elmRef={passwordRef}
                        
                        isValid={
                            passwordValidationLength
                            &&
                            passwordValidationCapital
                        }
                        
                        placeholder='New Password'
                        
                        value={password}
                        
                        onChange={handlePasswordChange}
                        
                        onFocus={handlePasswordFocus}
                        onBlur={handlePasswordBlur}
                    />
                    <Tooltip
                        theme='warning'
                        
                        floatingOn={passwordRef}
                        floatingPlacement='bottom'
                        
                        expanded={passwordFocused && !busy}
                    >
                        <List listStyle='flat'>
                            <ListItem outlined={true} size='sm' theme={passwordValidationLength ? 'success' : 'danger'}>
                                <Icon icon={passwordValidationLength ? 'check' : 'error_outline'} />
                                &nbsp;
                                5-20 characters
                            </ListItem>
                            <ListItem outlined={true} size='sm' theme={passwordValidationCapital ? 'success' : 'danger'}>
                                <Icon icon={passwordValidationCapital ? 'check' : 'error_outline'} />
                                &nbsp;
                                At least one capital letter
                            </ListItem>
                        </List>
                    </Tooltip>
                    <PasswordInput
                        elmRef={password2Ref}
                        
                        isValid={
                            password2ValidationLength
                            &&
                            password2ValidationCapital
                            &&
                            password2ValidationMatch
                        }
                        
                        placeholder='Confirm New Password'
                        
                        value={password2}
                        onChange={handlePassword2Change}
                        
                        onFocus={handlePassword2Focus}
                        onBlur={handlePassword2Blur}
                    />
                    <Tooltip
                        theme='warning'
                        
                        floatingOn={password2Ref}
                        floatingPlacement='bottom'
                        
                        expanded={password2Focused && !busy}
                    >
                        <List listStyle='flat'>
                            <ListItem outlined={true} size='sm' theme={password2ValidationLength ? 'success' : 'danger'}>
                                <Icon icon={password2ValidationLength ? 'check' : 'error_outline'} />
                                &nbsp;
                                5-20 characters
                            </ListItem>
                            <ListItem outlined={true} size='sm' theme={password2ValidationCapital ? 'success' : 'danger'}>
                                <Icon icon={password2ValidationCapital ? 'check' : 'error_outline'} />
                                &nbsp;
                                At least one capital letter
                            </ListItem>
                            <ListItem outlined={true} size='sm' theme={password2ValidationMatch ? 'success' : 'danger'}>
                                <Icon icon={password2ValidationMatch ? 'check' : 'error_outline'} />
                                &nbsp;
                                Exact match to previous password
                            </ListItem>
                        </List>
                    </Tooltip>
                    <ButtonIcon type='submit' icon={busy ? 'busy' : 'save'} enabled={!busy} onClick={handleDoPasswordReset}>
                        Reset password
                    </ButtonIcon>
                </ValidationProvider>
            </AccessibilityProvider>
            <ModalStatus theme='primary' viewport={formResetRef}>
                {(verified === null) && <CardBody>
                    <p>
                        <Busy /> validating...
                    </p>
                </CardBody>}
            </ModalStatus>
        </form>
    );
};
