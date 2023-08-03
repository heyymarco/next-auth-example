'use client'

import { Basic, Busy, Button, ButtonIcon, CardBody, CardFooter, CardHeader, CloseButton, Content, EmailInput, Group, Icon, Label, List, ListItem, ModalCard, PasswordInput, Tab, TabPanel, TextInput } from '@reusable-ui/components'
import { default as React, useEffect, useMemo, useRef, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ModalStatus } from '@/components/ModalStatus'
import { AccessibilityProvider, ThemeName, ValidationProvider, useEvent, useMountedFlag } from '@reusable-ui/core'
import axios from 'axios'



const invalidSelector = ':is(.invalidating, .invalidated)';



interface DialogMessage {
    theme   ?: ThemeName
    title   ?: React.ReactNode
    message  : React.ReactNode
}



interface TabLoginProps {
    onMessageError   : (error        : string|React.ReactNode)       => Promise<void>
    onFetchError     : (error        : any                   )       => Promise<void>
}
function TabLogin(props: TabLoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let   [busy, setBusy] = useState(false);
    
    const searchParams = useSearchParams();
    useEffect(() => {
        const error = searchParams?.get('error');
        if (error) props.onMessageError(error);
    }, []);
    
    const router = useRouter();
    const isMounted = useMountedFlag();
    
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
                            props.onMessageError(result.error);
                        }
                        else {
                            router.replace('/');
                        } // if
                    }
                    catch (error: any) {
                        setBusy(busy = false);
                        props.onFetchError(error);
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
}

interface TabForgetProps {
    onMessageError   : (error        : string|React.ReactNode)       => Promise<void>
    onFetchError     : (error        : any                   )       => Promise<void>
    onMessageSuccess : (success      : string|React.ReactNode)       => Promise<void>
    onBackLogin      : () => void
}
function TabForget(props: TabForgetProps) {
    const [username, setUsername] = useState('');
    const isMounted = useMountedFlag();
    let   [busy, setBusy] = useState(false);
    
    
    
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
                        
                        
                        
                        await props.onMessageSuccess(
                            <p>
                                {result.data.message ?? 'A password reset link sent to your email. Please check your inbox in a moment.'}
                            </p>
                        );
                        props.onBackLogin();
                    }
                    catch (error: any) {
                        setBusy(busy = false);
                        props.onFetchError(error);
                    } // try
                }}>
                    Send Reset Password Link
                </Button>
            </AccessibilityProvider>
        </div>
    );
}

interface TabResetProps {
    resetPasswordToken : string|null
    onMessageError   : (error        : string|React.ReactNode)       => Promise<void>
    onFieldError     : (invalidFields: ArrayLike<Element>|undefined) => Promise<void>
    onFetchError     : (error        : any                   )       => Promise<void>
    onMessageSuccess : (success      : string|React.ReactNode)       => Promise<void>
    onBackLogin      : () => void
}
function TabReset(props: TabResetProps) {
    const passwordRef = useRef<HTMLInputElement|null>(null);
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const tabResetRef = useRef<HTMLDivElement|null>(null);
    const isMounted = useMountedFlag();
    const resetPasswordToken = props.resetPasswordToken;
    const [enableValidation, setEnableValidation] = useState(false);
    
    const [verified, setVerified] = useState<null|{email: string, username: string|null}|false>(null);
    let   [busy, setBusy] = useState(false);
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
        const invalidFields = tabResetRef?.current?.querySelectorAll?.(invalidSelector);
        if (invalidFields?.length) { // there is an/some invalid field
            props.onFieldError(invalidFields);
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
            
            
            
            await props.onMessageSuccess(
                <p>
                    {result.data.message ?? 'The password has been successfully changed. Now you can login with the new password.'}
                </p>
            );
            props.onBackLogin();
        }
        catch (error: any) {
            setBusy(busy = false);
            props.onFetchError(error);
        } // try
    });
    
    
    
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
                await props.onFetchError(error);
                if (!isMounted.current) return;
                props.onBackLogin();
            } // try
        })();
    }, [resetPasswordToken]);
    useEffect(() => {
        if (!verified) return;
        passwordRef.current?.focus();
    }, [verified]);
    
    
    
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
}

export default function Login() {
    const searchParams = useSearchParams();
    
    const resetPasswordToken = searchParams?.get('resetPasswordToken') ?? null;
    const [tabIndex, setTabIndex] = useState(resetPasswordToken ? 2 : 0);
    const router = useRouter();
    
    
    
    // message handlers:
    const [dialogMessage, setDialogMessage] = useState<DialogMessage|false>(false);
    const subscribersDialogMessageClosed = useRef<(() => void)[]>([]);
    const prevDialogMessage = useRef<DialogMessage|undefined>(dialogMessage || undefined);
    if (dialogMessage) prevDialogMessage.current = dialogMessage;
    const showDialogMessage = useEvent(async (dialogMessage: React.SetStateAction<DialogMessage|false>): Promise<void> => {
        setDialogMessage(dialogMessage);
        return new Promise<void>((resolved) => {
            subscribersDialogMessageClosed.current.push(resolved);
        });
    });
    const handleCloseDialogMessage = useEvent((): void => {
        setDialogMessage(false);
    });
    const handleClosedDialogMessage = useEvent((): void => {
        for (const subscriberDialogMessageClosed of subscribersDialogMessageClosed.current) {
            subscriberDialogMessageClosed();
        } // for
        subscribersDialogMessageClosed.current.splice(0); // clear
    });
    
    
    
    const handleMessageError   = useEvent(async (error: string|React.ReactNode): Promise<void> => {
        await showDialogMessage({
            theme   : 'danger',
            title   : 'Error',
            message : error,
        });
    });
    const handleFieldError     = useEvent(async (invalidFields: ArrayLike<Element>|undefined): Promise<void> => {
        // conditions:
        if (!invalidFields?.length) return;
        
        
        
        // handlers:
        const handleClose = (): void => {
            // focus the first fieldError:
            const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe';
            const firstInvalidField = invalidFields?.[0];
            const firstFocusableElm = (firstInvalidField.matches(focusableSelector) ? firstInvalidField : firstInvalidField?.querySelector(focusableSelector)) as HTMLElement|null;
            firstInvalidField.scrollIntoView({
                block    : 'start',
                behavior : 'smooth',
            });
            firstFocusableElm?.focus?.({ preventScroll: true });
        };
        
        
        
        // show message:
        const isPlural = (invalidFields?.length > 1);
        await handleMessageError(<>
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
        handleClose();
    });
    const handleFetchError     = useEvent(async (error: any): Promise<void> => {
        handleMessageError(
            error?.response?.data?.error
            ??
            error?.response?.data
            ??
            error?.message
            ??
            `${error}`
        );
    });
    const handleMessageSuccess = useEvent(async (success: string|React.ReactNode): Promise<void> => {
        await showDialogMessage({
            theme   : 'success',
            title   : 'Success',
            message : success,
        });
    });
    
    
    
    return (
        <Content theme='primary'>
            <Tab
                expandedTabIndex={tabIndex}
                // listComponent={<></>}
                // listItemComponent={<></>}
                bodyComponent={<Content mild={true} />}
                id='tabbbb'
            >
                <TabPanel label='Login'>
                    <TabLogin onMessageError={handleMessageError} onFetchError={handleFetchError} />
                    <ButtonIcon icon='lock_open' buttonStyle='link' onClick={() => setTabIndex(1)}>
                        Forgot password?
                    </ButtonIcon>
                    <ButtonIcon icon='home' buttonStyle='link' onClick={() => router.push('/')}>
                        Back to Home
                    </ButtonIcon>
                </TabPanel>
                <TabPanel label='Recovery'>
                    <TabForget onMessageError={handleMessageError} onFetchError={handleFetchError} onMessageSuccess={handleMessageSuccess} onBackLogin={() => setTabIndex(0)} />
                    <ButtonIcon icon='arrow_back' buttonStyle='link' onClick={() => setTabIndex(0)}>
                        Back to Login Page
                    </ButtonIcon>
                    <ButtonIcon icon='home' buttonStyle='link' onClick={() => router.push('/')}>
                        Back to Home
                    </ButtonIcon>
                </TabPanel>
                <TabPanel label='Reset'>
                    <TabReset resetPasswordToken={resetPasswordToken} onMessageError={handleMessageError} onFetchError={handleFetchError} onFieldError={handleFieldError} onMessageSuccess={handleMessageSuccess} onBackLogin={() => setTabIndex(0)} />
                    <ButtonIcon icon='arrow_back' buttonStyle='link' onClick={() => setTabIndex(0)}>
                        Back to Login Page
                    </ButtonIcon>
                    <ButtonIcon icon='home' buttonStyle='link' onClick={() => router.push('/')}>
                        Back to Home
                    </ButtonIcon>
                </TabPanel>
            </Tab>
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
}
