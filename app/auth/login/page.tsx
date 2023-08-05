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
    usePathname,
    useRouter, useSearchParams,
}                           from 'next/navigation'

// next auth:
import {
    // types:
    type BuiltInProviderType,
}                           from 'next-auth/providers'
import {
    // types:
    type LiteralUnion,
    
    
    
    signIn,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    AccessibilityProvider, EventHandler, ThemeName, ValidationProvider, useEvent, useMountedFlag,
}                           from '@reusable-ui/core'

// reusable-ui components:
import {
    Busy, Button, ButtonIcon, Card, CardBody, CardFooter, CardHeader, CloseButton, Content, EmailInput, Icon, List, ListItem, ModalExpandedChangeEvent, PasswordInput, Tab, TabPanel, TextInput, Tooltip,
}                           from '@reusable-ui/components'

// internal components:
import {
    ModalStatus,
}                           from '@/components/ModalStatus'

// other libs:
import axios                from 'axios'



// types:
interface DialogMessage {
    theme   ?: ThemeName
    title   ?: React.ReactNode
    message  : React.ReactNode
}



// contexts:
interface LoginApi {
    expandedTabIndex        : number
    callbackUrl             : string|null
    resetPasswordToken      : string|null
    
    backLogin               : () => void
    
    showMessage             : (dialogMessage : React.SetStateAction<DialogMessage | false>      ) => Promise<void>
    showMessageError        : (error         : string | React.ReactNode                         ) => Promise<void>
    showMessageFieldError   : (invalidFields : ArrayLike<Element> | undefined                   ) => Promise<void>
    showMessageFetchError   : (error         : any                                              ) => Promise<void>
    showMessageSuccess      : (success       : string | React.ReactNode                         ) => Promise<void>
    showMessageNotification : (notification  : string | React.ReactNode                         ) => Promise<void>
}
const LoginContext = createContext<LoginApi>({
    expandedTabIndex        : 0,
    callbackUrl             : null,
    resetPasswordToken      : null,
    
    backLogin               :       () => {},
    
    showMessage             : async () => {},
    showMessageError        : async () => {},
    showMessageFieldError   : async () => {},
    showMessageFetchError   : async () => {},
    showMessageSuccess      : async () => {},
    showMessageNotification : async () => {},
});
const useLoginContext = () => {
    return useContext(LoginContext);
};



// utils:
const invalidSelector = ':is(.invalidating, .invalidated)';
const getAuthErrorDescription = (errorCode: string): string|React.ReactNode => {
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
            return errorCode;
    } // switch
}



// handlers:
const handlePreventSubmit : React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
};



// react components:
const Login     = () => {
    // hooks:
    const router       = useRouter();
    const pathName     = usePathname() ?? '/'
    const searchParams = useSearchParams();
    
    
    
    // states:
    const callbackUrlRef                          = useRef<string>(searchParams?.get('callbackUrl') ?? null);
    const resetPasswordTokenRef                   = useRef<string>(searchParams?.get('resetPasswordToken') ?? null);
    const [expandedTabIndex, setExpandedTabIndex] = useState(resetPasswordTokenRef.current ? 2 : 0);
    
    const isMounted = useMountedFlag();
    
    
    
    // refs:
    const modalStatusButtonRef = useRef<HTMLButtonElement|null>(null);
    
    
    
    // dom effects:
    useEffect(() => {
        // displays an error passed by `next-auth`:
        const error = searchParams?.get('error');
        if (error) {
            handleShowMessageError(getAuthErrorDescription(error));
        } // if
    }, []);
    
    useEffect(() => {
        if (!!searchParams?.get('error') || !!searchParams?.get('callbackUrl') || !!searchParams?.get('resetPasswordToken')) {
            try {
                // get current browser's queryString:
                const newSearchParams = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
                
                // remove `?error=***` on browser's url:
                newSearchParams.delete('error');
                
                // remove `?resetPasswordToken=***` on browser's url:
                newSearchParams.delete('callbackUrl');
                
                // remove `?resetPasswordToken=***` on browser's url:
                newSearchParams.delete('resetPasswordToken');
                
                // update browser's url:
                router.replace(`${pathName}${newSearchParams.size ? `?${newSearchParams}` : ''}`, { scroll: false });
            }
            catch {
                // ignore any error
            } // if
        } // if
    }, []);
    
    
    
    // handers:
    const handleBackLogin           = useEvent(() => {
        setExpandedTabIndex(0);
    });
    const handleGotoReset           = useEvent(() => {
        setExpandedTabIndex(1);
    });
    const handleBackHome            = useEvent(() => {
        router.push('/');
    });
    const handleModalExpandedChange = useEvent<EventHandler<ModalExpandedChangeEvent>>(({expanded}) => {
        if (expanded) return;
        handleCloseDialogMessage();
    });
    const handleModalFocus          = useEvent(() => {
        setTimeout(() => {
            modalStatusButtonRef.current?.focus();
        }, 0); // wait to next macroTask, to make sure the keyboard event from <Input> was gone
    });
    
    
    
    // message handlers:
    const [dialogMessage, setDialogMessage] = useState<DialogMessage|false>(false);
    const subscribersDialogMessageClosed = useRef<(() => void)[]>([]);
    const prevDialogMessage = useRef<DialogMessage|undefined>(dialogMessage || undefined);
    if (dialogMessage) prevDialogMessage.current = dialogMessage;
    const handleShowMessage             = useEvent(async (dialogMessage : React.SetStateAction<DialogMessage|false>): Promise<void> => {
        setDialogMessage(dialogMessage);
        return new Promise<void>((resolved) => {
            subscribersDialogMessageClosed.current.push(resolved);
        });
    });
    const handleCloseDialogMessage      = useEvent((): void => {
        setDialogMessage(false);
    });
    const handleClosedDialogMessage     = useEvent((): void => {
        for (const subscriberDialogMessageClosed of subscribersDialogMessageClosed.current) {
            subscriberDialogMessageClosed();
        } // for
        subscribersDialogMessageClosed.current.splice(0); // clear
    });
    
    const handleShowMessageError        = useEvent(async (error         : string|React.ReactNode      ): Promise<void> => {
        await handleShowMessage({
            theme   : 'danger',
            title   : 'Error',
            message : error,
        });
    });
    const handleShowMessageFieldError   = useEvent(async (invalidFields : ArrayLike<Element>|undefined): Promise<void> => {
        // conditions:
        if (!invalidFields?.length) return;
        
        
        
        // show message:
        const isPlural = (invalidFields?.length > 1);
        await handleShowMessageError(<>
            <p>
                There {isPlural ? 'are some' : 'is an'} invalid field{isPlural ? 's' : ''} that {isPlural ? 'need' : 'needs'} to be fixed:
            </p>
            <List listStyle='flat'>
                {Array.from(invalidFields).map((invalidField, index) =>
                    <ListItem key={index}>
                        <>
                            <Icon
                                icon={
                                    ((invalidField.parentElement?.previousElementSibling as HTMLElement)?.children?.[0]?.children?.[0] as HTMLElement)?.style?.getPropertyValue('--icon-image')?.slice(1, -1)
                                    ??
                                    'text_fields'
                                }
                                theme='primary'
                            />
                            &nbsp;
                            {(invalidField as HTMLElement).getAttribute('aria-label') || (invalidField.children[0] as HTMLInputElement).placeholder}
                        </>
                    </ListItem>
                )}
            </List>
        </>);
        if (!isMounted.current) return;
        
        
        
        // focus the first fieldError:
        const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe';
        const firstInvalidField = invalidFields?.[0];
        const firstFocusableElm = (firstInvalidField.matches(focusableSelector) ? firstInvalidField : firstInvalidField?.querySelector(focusableSelector)) as HTMLElement|null;
        firstInvalidField.scrollIntoView({
            block    : 'start',
            behavior : 'smooth',
        });
        firstFocusableElm?.focus?.({ preventScroll: true });
    });
    const handleShowMessageFetchError   = useEvent(async (error         : any                         ): Promise<void> => {
        await handleShowMessageError(
            error?.response?.data?.error
            ??
            ((): string|React.ReactNode|null => {
                const errorCode = error?.response?.status;
                if (typeof(errorCode) !== 'number') return null;
                const isClientError = (errorCode >= 400) && (errorCode <= 499);
                const isServerError = (errorCode >= 500) && (errorCode <= 599);
                if (isClientError || isServerError) return <>
                    <p>
                        Oops, there was an error processing the command.
                    </p>
                    <p>
                        There was a <strong>problem contacting our server</strong>.
                        {isClientError && <>
                            <br />
                            Make sure your internet connection is available.
                        </>}
                    </p>
                    <p>
                        Please try again in a few minutes.<br />
                        If the problem still persists, please contact our technical support.
                    </p>
                </>;
                return null;
            })()
            ??
            error?.response?.data
            ??
            error?.message
            ??
            `${error}`
        );
    });
    const handleShowMessageSuccess      = useEvent(async (success       : string|React.ReactNode      ): Promise<void> => {
        await handleShowMessage({
            theme   : 'success',
            title   : 'Success',
            message : success,
        });
    });
    const handleShowMessageNotification = useEvent(async (notification  : string|React.ReactNode      ): Promise<void> => {
        await handleShowMessage({
            theme   : 'primary',
            title   : 'Notification',
            message : notification,
        });
    });
    
    
    
    // jsx:
    return (
        <Content theme='primary'>
            <LoginContext.Provider value={useMemo(() => ({
                expandedTabIndex        : expandedTabIndex,
                callbackUrl             : callbackUrlRef.current,
                resetPasswordToken      : resetPasswordTokenRef.current,
                
                backLogin               : handleBackLogin,
                
                showMessage             : handleShowMessage,
                showMessageError        : handleShowMessageError,
                showMessageFieldError   : handleShowMessageFieldError,
                showMessageFetchError   : handleShowMessageFetchError,
                showMessageSuccess      : handleShowMessageSuccess,
                showMessageNotification : handleShowMessageNotification,
            }), [expandedTabIndex])}>
                <Tab
                    expandedTabIndex={expandedTabIndex}
                    // listComponent={<></>}
                    // listItemComponent={<></>}
                    bodyComponent={<Content mild={true} />}
                    id='tabbbb'
                >
                    <TabPanel label='Login'>
                        <TabLogin />
                        <ButtonIcon icon='lock_open' buttonStyle='link' onClick={handleGotoReset}>
                            Forgot password?
                        </ButtonIcon>
                        <ButtonIcon icon='home' buttonStyle='link' onClick={handleBackHome}>
                            Back to Home
                        </ButtonIcon>
                    </TabPanel>
                    <TabPanel label='Recovery'>
                        <TabForget />
                        <ButtonIcon icon='arrow_back' buttonStyle='link' onClick={handleBackLogin}>
                            Back to Login Page
                        </ButtonIcon>
                        <ButtonIcon icon='home' buttonStyle='link' onClick={handleBackHome}>
                            Back to Home
                        </ButtonIcon>
                    </TabPanel>
                    <TabPanel label='Reset'>
                        <TabReset />
                        <ButtonIcon icon='arrow_back' buttonStyle='link' onClick={handleBackLogin}>
                            Back to Login Page
                        </ButtonIcon>
                        <ButtonIcon icon='home' buttonStyle='link' onClick={handleBackHome}>
                            Back to Home
                        </ButtonIcon>
                    </TabPanel>
                </Tab>
            </LoginContext.Provider>
            {useMemo(() => {
                // jsx:
                return (
                    <ModalStatus
                        modalCardStyle='scrollable'
                        theme={prevDialogMessage.current?.theme ?? 'primary'}
                        
                        lazy={true}
                        
                        onExpandedChange={handleModalExpandedChange}
                        onExpandStart={handleModalFocus}
                        onCollapseEnd={handleClosedDialogMessage}
                    >
                        {!!dialogMessage && <>
                            <CardHeader>
                                {dialogMessage.title ?? 'Notification'}
                                <CloseButton onClick={handleCloseDialogMessage} />
                            </CardHeader>
                            <CardBody>
                                {dialogMessage.message}
                            </CardBody>
                            <CardFooter>
                                <Button elmRef={modalStatusButtonRef} onClick={handleCloseDialogMessage}>
                                    Okay
                                </Button>
                            </CardFooter>
                        </>}
                    </ModalStatus>
                );
            }, [dialogMessage])}
        </Content>
    )
};
export default Login;

const TabLogin  = () => {
    // hooks:
    const router = useRouter();
    
    
    
    // contexts:
    const {
        expandedTabIndex,
        callbackUrl,
        
        showMessageError,
        showMessageFieldError,
        showMessageNotification,
    } = useLoginContext();
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState(false);
    const [username        , setUsername        ] = useState('');
    const [password        , setPassword        ] = useState('');
    
    const isMounted       = useMountedFlag();
    let   [busy, setBusy] = useState(false);
    
    
    
    // refs:
    const tabLoginRef = useRef<HTMLFormElement|null>(null);
    const usernameRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // dom effects:
    useEffect(() => {
        // resets:
        setEnableValidation(false);
        setUsername('');
        setPassword('');
    }, [expandedTabIndex]); // resets input states when expandedTabIndex changed
    
    
    
    // redirects:
    const loggedInRedirectPath = callbackUrl || '/'; // redirect to home page if login is successful
    
    
    
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
        if (!isMounted.current) return;
        const invalidFields = tabLoginRef?.current?.querySelectorAll?.(invalidSelector);
        if (invalidFields?.length) { // there is an/some invalid field
            showMessageFieldError(invalidFields);
            return;
        } // if
        
        
        
        // attempts login with credentials:
        setBusy(busy = true); // mark as busy
        const result = await signIn('credentials', { username, password, redirect: false });
        if (!isMounted.current) return;
        
        
        
        // verify the login status:
        if (!result?.ok) {
            setBusy(busy = false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPassword('');
            
            
            
            // report the failure:
            await showMessageError(getAuthErrorDescription(result?.error ?? 'CredentialsSignin'));
            
            
            
            // focus to username field:
            usernameRef.current?.setSelectionRange(0, username.length);
            usernameRef.current?.focus();
        }
        else {
            // resets:
            setUsername('');
            setPassword('');
            
            
            
            // redirect to home page:
            router.replace(loggedInRedirectPath);
        } // if
    });
    const handleLoginUsingOAuth       = useEvent(async (providerType: LiteralUnion<BuiltInProviderType>): Promise<void> => {
        // conditions:
        if (busy) return; // ignore when busy
        
        
        
        // attempts login with OAuth:
        setBusy(busy = true); // mark as busy
        const result = await signIn(providerType, { callbackUrl: loggedInRedirectPath });
        if (!isMounted.current) return;
        
        
        
        // verify the login status:
        if ((result !== undefined) && !result?.ok) {
            setBusy(busy = false); // unmark as busy
            
            
            
            // report the failure:
            showMessageError(getAuthErrorDescription(result?.error ?? 'OAuthSignin'));
        }
        else {
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
        <form ref={tabLoginRef} noValidate={true} onSubmit={handlePreventSubmit}>
            <AccessibilityProvider enabled={!busy}>
                <ValidationProvider enableValidation={enableValidation}>
                    <TextInput elmRef={usernameRef} placeholder='Username or Email' autoComplete='username'         required={true} isValid={username.length >= 1} value={username} onChange={handleUsernameChange} />
                    <PasswordInput                  placeholder='Password'          autoComplete='current-password' required={true} isValid={password.length >= 1} value={password} onChange={handlePasswordChange} />
                    <ButtonIcon type='submit' icon={busy ? 'busy' : 'login'} onClick={handleLoginUsingCredentials}>
                        Login
                    </ButtonIcon>
                    <hr />
                    <ButtonIcon icon='facebook' onClick={handleLoginUsingFacebook}>
                        Login with Facebook
                    </ButtonIcon>
                    <ButtonIcon icon='login'    onClick={handleLoginUsingGithub}>
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
        
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
    } = useLoginContext();
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState(false);
    const [username        , setUsername        ] = useState('');
    
    const isMounted       = useMountedFlag();
    let   [busy, setBusy] = useState(false);
    
    
    
    // refs:
    const tabForgetRef = useRef<HTMLDivElement|null>(null);
    const usernameRef  = useRef<HTMLInputElement|null>(null);
    
    
    
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
        const invalidFields = tabForgetRef?.current?.querySelectorAll?.(invalidSelector);
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
        <div ref={tabForgetRef}>
            <AccessibilityProvider enabled={!busy}>
                <ValidationProvider enableValidation={enableValidation}>
                    <TextInput elmRef={usernameRef} placeholder='Username or Email' autoComplete='username'         required={true} isValid={username.length >= 1} value={username} onChange={handleUsernameChange} />
                    <ButtonIcon icon={busy ? 'busy' : 'lock_open'} onClick={handleRequestPasswordReset}>
                        Send Reset Password Link
                    </ButtonIcon>
                </ValidationProvider>
            </AccessibilityProvider>
        </div>
    );
};
const TabReset  = () => {
    // contexts:
    const {
        resetPasswordToken,
        
        backLogin,
        
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
    } = useLoginContext();
    
    
    
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
    const tabResetRef  = useRef<HTMLDivElement|null>(null);
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
        const invalidFields = tabResetRef?.current?.querySelectorAll?.(invalidSelector);
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
        <div ref={tabResetRef}>
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
                        
                        expanded={passwordFocused}
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
                        
                        expanded={password2Focused}
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
                    <ButtonIcon icon={busy ? 'busy' : 'save'} enabled={!busy} onClick={handleDoPasswordReset}>
                        Reset password
                    </ButtonIcon>
                </ValidationProvider>
            </AccessibilityProvider>
            <ModalStatus theme='primary' viewport={tabResetRef}>
                {(verified === null) && <CardBody>
                    <p>
                        <Busy /> validating...
                    </p>
                </CardBody>}
            </ModalStatus>
        </div>
    );
};
