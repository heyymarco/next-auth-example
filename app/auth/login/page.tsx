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
    useRouter, useSearchParams,
}                           from 'next/navigation'

// next auth:
import {
    signIn,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    AccessibilityProvider, ThemeName, ValidationProvider, useEvent, useMountedFlag,
}                           from '@reusable-ui/core'

// reusable-ui components:
import {
    Busy, Button, ButtonIcon, CardBody, CardFooter, CardHeader, CloseButton, Content, EmailInput, Icon, List, ListItem, PasswordInput, Tab, TabPanel, TextInput,
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
    resetPasswordToken    : string|null
    
    backLogin             : () => void
    
    showMessage           : (dialogMessage: React.SetStateAction<DialogMessage | false>) => Promise<void>
    showMessageError      : (error  : string | React.ReactNode                         ) => Promise<void>
    showMessageFieldError : (invalidFields: ArrayLike<Element> | undefined             ) => Promise<void>
    showMessageFetchError : (error  : any                                              ) => Promise<void>
    showMessageSuccess    : (success: string | React.ReactNode                         ) => Promise<void>
}
const LoginContext = createContext<LoginApi>({
    resetPasswordToken    : null,
    
    backLogin             :       () => {},
    
    showMessage           : async () => {},
    showMessageError      : async () => {},
    showMessageFieldError : async () => {},
    showMessageFetchError : async () => {},
    showMessageSuccess    : async () => {},
});
const useLoginContext = () => {
    return useContext(LoginContext);
};



// utils:
const invalidSelector = ':is(.invalidating, .invalidated)';



// react components:
const Login     = () => {
    const router       = useRouter();
    const searchParams = useSearchParams();
    
    
    
    // states:
    const resetPasswordToken = searchParams?.get('resetPasswordToken') ?? null;
    const [tabIndex, setTabIndex] = useState(resetPasswordToken ? 2 : 0);
    
    const isMounted = useMountedFlag();
    
    
    
    // handers:
    const handleBackLogin = useEvent(() => {
        setTabIndex(0);
    });
    
    
    
    // message handlers:
    const [dialogMessage, setDialogMessage] = useState<DialogMessage|false>(false);
    const subscribersDialogMessageClosed = useRef<(() => void)[]>([]);
    const prevDialogMessage = useRef<DialogMessage|undefined>(dialogMessage || undefined);
    if (dialogMessage) prevDialogMessage.current = dialogMessage;
    const handleShowMessage           = useEvent(async (dialogMessage: React.SetStateAction<DialogMessage|false>): Promise<void> => {
        setDialogMessage(dialogMessage);
        return new Promise<void>((resolved) => {
            subscribersDialogMessageClosed.current.push(resolved);
        });
    });
    const handleCloseDialogMessage    = useEvent((): void => {
        setDialogMessage(false);
    });
    const handleClosedDialogMessage   = useEvent((): void => {
        for (const subscriberDialogMessageClosed of subscribersDialogMessageClosed.current) {
            subscriberDialogMessageClosed();
        } // for
        subscribersDialogMessageClosed.current.splice(0); // clear
    });
    
    const handleShowMessageError      = useEvent(async (error: string|React.ReactNode): Promise<void> => {
        await handleShowMessage({
            theme   : 'danger',
            title   : 'Error',
            message : error,
        });
    });
    const handleShowMessageFieldError = useEvent(async (invalidFields: ArrayLike<Element>|undefined): Promise<void> => {
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
    const handleShowMessageFetchError = useEvent(async (error: any): Promise<void> => {
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
    const handleShowMessageSuccess    = useEvent(async (success: string|React.ReactNode): Promise<void> => {
        await handleShowMessage({
            theme   : 'success',
            title   : 'Success',
            message : success,
        });
    });
    
    
    
    return (
        <Content theme='primary'>
            <LoginContext.Provider value={useMemo(() => ({
                resetPasswordToken    : resetPasswordToken,
                
                backLogin             : handleBackLogin,
                
                showMessage           : handleShowMessage,
                showMessageError      : handleShowMessageError,
                showMessageFieldError : handleShowMessageFieldError,
                showMessageFetchError : handleShowMessageFetchError,
                showMessageSuccess    : handleShowMessageSuccess,
            }), [resetPasswordToken])}>
                <Tab
                    expandedTabIndex={tabIndex}
                    // listComponent={<></>}
                    // listItemComponent={<></>}
                    bodyComponent={<Content mild={true} />}
                    id='tabbbb'
                >
                    <TabPanel label='Login'>
                        <TabLogin />
                        <ButtonIcon icon='lock_open' buttonStyle='link' onClick={() => setTabIndex(1)}>
                            Forgot password?
                        </ButtonIcon>
                        <ButtonIcon icon='home' buttonStyle='link' onClick={() => router.push('/')}>
                            Back to Home
                        </ButtonIcon>
                    </TabPanel>
                    <TabPanel label='Recovery'>
                        <TabForget />
                        <ButtonIcon icon='arrow_back' buttonStyle='link' onClick={() => setTabIndex(0)}>
                            Back to Login Page
                        </ButtonIcon>
                        <ButtonIcon icon='home' buttonStyle='link' onClick={() => router.push('/')}>
                            Back to Home
                        </ButtonIcon>
                    </TabPanel>
                    <TabPanel label='Reset'>
                        <TabReset />
                        <ButtonIcon icon='arrow_back' buttonStyle='link' onClick={() => setTabIndex(0)}>
                            Back to Login Page
                        </ButtonIcon>
                        <ButtonIcon icon='home' buttonStyle='link' onClick={() => router.push('/')}>
                            Back to Home
                        </ButtonIcon>
                    </TabPanel>
                </Tab>
            </LoginContext.Provider>
            {useMemo(() => {
                // jsx:
                return (
                    <ModalStatus
                        key='aafff'
                        modalCardStyle='scrollable'
                        theme={prevDialogMessage.current?.theme ?? 'primary'}
                        
                        lazy={true}
                        
                        onExpandedChange={({expanded}) => !expanded && handleCloseDialogMessage()}
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
                                <Button onClick={handleCloseDialogMessage}>
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
    const searchParams = useSearchParams();
    const router       = useRouter();
    
    
    
    // contexts:
    const {
        showMessageError,
        showMessageFetchError,
    } = useLoginContext();
    
    
    
    // states:
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const isMounted       = useMountedFlag();
    let   [busy, setBusy] = useState(false);
    
    
    
    // dom effects:
    useEffect(() => {
        const error = searchParams?.get('error');
        if (error) showMessageError(error);
    }, []);
    
    
    
    // jsx:
    return (
        <div>
            <AccessibilityProvider enabled={!busy}>
                <TextInput placeholder='Username or Email' value={username} onChange={({target: {value}}) => setUsername(value)} />
                <PasswordInput placeholder='Password' value={password} onChange={({target: {value}}) => setPassword(value)} />
                <ButtonIcon icon={busy ? 'busy' : 'login'} onClick={async () => {
                    setBusy(busy = true);
                    try {
                        const result = await signIn('credentials', { username, password, callbackUrl: '/', redirect: false });
                        if (!isMounted.current) return;
                        
                        
                        
                        if (!result || result.error) setBusy(busy = false);
                        if (!result) return;
                        if (result.error) {
                            showMessageError(result.error);
                        }
                        else {
                            router.replace('/');
                        } // if
                    }
                    catch (error: any) {
                        setBusy(busy = false);
                        showMessageFetchError(error);
                    } // try
                }}>
                    Login
                </ButtonIcon>
                <hr />
                <ButtonIcon icon='facebook' onClick={() => signIn('facebook', { callbackUrl: '/' })}>
                    Login with Facebook
                </ButtonIcon>
                <ButtonIcon icon='login' onClick={() => signIn('github', { callbackUrl: '/' })}>
                    Login with Github
                </ButtonIcon>
            </AccessibilityProvider>
        </div>
    );
};
const TabForget = () => {
    // contexts:
    const {
        backLogin,
        
        showMessageFetchError,
        showMessageSuccess,
    } = useLoginContext();
    
    
    
    // states:
    const [username, setUsername] = useState('');
    
    const isMounted       = useMountedFlag();
    let   [busy, setBusy] = useState(false);
    
    
    
    // jsx:
    return (
        <div>
            <AccessibilityProvider enabled={!busy}>
                <TextInput placeholder='Username or Email' value={username} onChange={({target: {value}}) => setUsername(value)} />
                <Button enabled={!busy} onClick={async () => {
                    setBusy(busy = true);
                    try {
                        const result = await axios.post('/api/auth/reset', {
                            username,
                        });
                        if (!isMounted.current) return;
                        
                        
                        
                        await showMessageSuccess(
                            <p>
                                {result.data.message ?? 'A password reset link sent to your email. Please check your inbox in a moment.'}
                            </p>
                        );
                        if (!isMounted.current) return;
                        backLogin();
                    }
                    catch (error: any) {
                        setBusy(busy = false);
                        showMessageFetchError(error);
                    } // try
                }}>
                    Send Reset Password Link
                </Button>
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
    const [password , setPassword ] = useState('');
    const [password2, setPassword2] = useState('');
    
    const [verified, setVerified] = useState<null|{email: string, username: string|null}|false>(null);
    
    const isMounted       = useMountedFlag();
    let   [busy, setBusy] = useState(false);
    
    
    
    // dom effects:
    const tabResetRef    = useRef<HTMLDivElement|null>(null);
    const passwordRef    = useRef<HTMLInputElement|null>(null);
    const hasInitialized = useRef(false); // workaround for <React.StrictMode>
    useEffect(() => {
        // conditions:
        if (!resetPasswordToken) return;
        if (hasInitialized.current) return;
        hasInitialized.current = true; // mark as initialized
        
        
        
        // actions:
        (async () => {
            try {
                const result = await axios.get(`/api/auth/reset?resetPasswordToken=${encodeURIComponent(resetPasswordToken)}`);
                if (!isMounted.current) return;
                
                
                
                setVerified(result.data);
            }
            catch (error: any) {
                setVerified(false);
                await showMessageFetchError(error);
                if (!isMounted.current) return;
                backLogin();
            } // try
        })();
    }, [resetPasswordToken]);
    useEffect(() => {
        if (!verified) return;
        passwordRef.current?.focus();
    }, [verified]);
    
    
    
    // handlers:
    const handleDoPasswordReset = useEvent(async () => {
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
        
        
        
        // do password reset:
        setBusy(busy = true);
        try {
            const result = await axios.patch('/api/auth/reset', {
                resetPasswordToken,
                password,
            });
            if (!isMounted.current) return;
            
            
            
            await showMessageSuccess(
                <p>
                    {result.data.message ?? 'The password has been successfully changed. Now you can login with the new password.'}
                </p>
            );
            if (!isMounted.current) return;
            backLogin();
        }
        catch (error: any) {
            setBusy(busy = false);
            showMessageFetchError(error);
        } // try
    });
    
    
    
    // jsx:
    return (
        <div ref={tabResetRef}>
            <AccessibilityProvider enabled={!busy && !!verified}>
                <ValidationProvider enableValidation={enableValidation}>
                    <EmailInput readOnly={true} value={(!!verified && verified?.email) || ''} />
                    {/* <TextInput readOnly={true} value={verified?.username ?? ''} placeholder={!verified?.username ? 'username was not configured' : ''} /> */}
                    <PasswordInput isValid={(password.length >= 1)} elmRef={passwordRef} placeholder='New Password' value={password} onChange={({target: {value}}) => setPassword(value)} />
                    <PasswordInput isValid={(password.length >= 1) && (password === password2)} placeholder='Confirm New Password' value={password2} onChange={({target: {value}}) => setPassword2(value)} />
                    <Button enabled={!busy} onClick={handleDoPasswordReset}>
                        Reset password
                    </Button>
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
