'use client'

import { Basic, Busy, Button, ButtonIcon, CardBody, CardHeader, CloseButton, Content, EmailInput, Group, Label, ModalCard, PasswordInput, Tab, TabPanel, TextInput } from '@reusable-ui/components'
import { default as React, useEffect, useRef, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ModalStatus } from '@/components/ModalStatus'
import { AccessibilityProvider, useMountedFlag } from '@reusable-ui/core'
import axios from 'axios'



interface TabLoginProps {
    onError : (error: string) => void
}
function TabLogin(props: TabLoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let   [busy, setBusy] = useState(false);
    
    const searchParams = useSearchParams();
    useEffect(() => {
        const error = searchParams?.get('error');
        if (error) props.onError(error);
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
                            props.onError(result.error);
                        }
                        else {
                            router.replace('/');
                        } // if
                    }
                    catch (error: any) {
                        setBusy(busy = false);
                        props.onError('unknown');
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
    onError : (error: string) => void
    onBackLogin : () => void
}
function TabForget(props: TabForgetProps) {
    const [username, setUsername] = useState('');
    const isMounted = useMountedFlag();
    let   [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<React.ReactNode>(null);
    
    
    
    return (
        <div>
            <AccessibilityProvider enabled={!busy}>
                <TextInput placeholder='Username or Email' value={username} onChange={({target: {value}}) => setUsername(value)} />
                <Button onClick={async () => {
                    setBusy(busy = true);
                    try {
                        const result = await axios.post('/api/auth/reset', {
                            username,
                        });
                        if (!isMounted.current) return;
                        
                        
                        
                        setMessage(
                            <p>
                                {result.data.message ?? 'A password reset link sent to your email. Please check your inbox in a moment.'}
                            </p>
                        );
                    }
                    catch (error: any) {
                        setBusy(busy = false);
                        console.log(error)
                        props.onError(error?.response?.data?.error ?? error);
                    } // try
                }}>
                    Send Reset Password Link
                </Button>
            </AccessibilityProvider>
            <ModalStatus theme='success'>
                {!!message && <>
                    <CardHeader>
                        Notification
                        <CloseButton onClick={() => {
                            setMessage(null);
                            props.onBackLogin();
                        }} />
                    </CardHeader>
                    <CardBody>
                        {message}
                    </CardBody>
                </>}
            </ModalStatus>
        </div>
    );
}

interface TabResetProps {
    onError : (error: string) => void
}
function TabReset(props: TabResetProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    let   [busy, setBusy] = useState(false);
    const tabResetRef = useRef<HTMLDivElement|null>(null);
    return (
        <div ref={tabResetRef}>
            <AccessibilityProvider enabled={!busy}>
                <EmailInput readOnly={true} value={''} />
                <TextInput placeholder='Username' value={username} onChange={({target: {value}}) => setUsername(value)} />
                <PasswordInput placeholder='Password' value={password} onChange={({target: {value}}) => setPassword(value)} />
                <PasswordInput placeholder='Confirm Password' value={password2} onChange={({target: {value}}) => setPassword2(value)} />
                <Button>
                    Reset password
                </Button>
            </AccessibilityProvider>
            <ModalStatus theme='primary' viewport={tabResetRef}>
                {!username && <CardBody>
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
    
    const [tabIndex, setTabIndex] = useState(() => searchParams?.get('resetPasswordToken') ? 2 : 0);
    const router = useRouter();
    const [error, setError] = useState<string|React.ReactNode>('');
    
    
    
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
                    <TabLogin onError={setError} />
                    <ButtonIcon icon='lock_open' buttonStyle='link' onClick={() => setTabIndex(1)}>
                        Forgot password?
                    </ButtonIcon>
                    <ButtonIcon icon='home' buttonStyle='link' onClick={() => router.push('/')}>
                        Back to Home
                    </ButtonIcon>
                </TabPanel>
                <TabPanel label='Recovery'>
                    <TabForget onError={setError} onBackLogin={() => setTabIndex(0)} />
                    <ButtonIcon icon='arrow_back' buttonStyle='link' onClick={() => setTabIndex(0)}>
                        Back to Login Page
                    </ButtonIcon>
                    <ButtonIcon icon='home' buttonStyle='link' onClick={() => router.push('/')}>
                        Back to Home
                    </ButtonIcon>
                </TabPanel>
                <TabPanel label='Reset'>
                    <TabReset onError={setError} />
                    <ButtonIcon icon='arrow_back' buttonStyle='link' onClick={() => setTabIndex(0)}>
                        Back to Login Page
                    </ButtonIcon>
                    <ButtonIcon icon='home' buttonStyle='link' onClick={() => router.push('/')}>
                        Back to Home
                    </ButtonIcon>
                </TabPanel>
            </Tab>
            <ModalStatus theme='danger'>
                {!!error && <>
                    <CardHeader>
                        Login Error
                        <CloseButton onClick={() => setError('')} />
                    </CardHeader>
                    <CardBody>
                        {((): JSX.Element|null => {
                            switch (error) {
                                case 'CredentialsSignin': return <p>
                                    Login error. Please try again.
                                </p>
                                
                                case 'Callback': return <p>
                                    Login error. Please try again.
                                </p>
                                
                                case 'Default': return <p>
                                    An error occured. Please try again.
                                </p>
                                
                                default       : return (typeof(error) !== 'string') ? <>{error}</> : <p>
                                    {error}
                                </p>
                            } // switch
                        })()}
                    </CardBody>
                </>}
            </ModalStatus>
        </Content>
    )
}
