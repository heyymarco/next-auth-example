'use client'

import { Basic, Button, ButtonIcon, CardBody, CardHeader, CloseButton, Content, Group, Label, ModalCard, PasswordInput, Tab, TabPanel, TextInput } from '@reusable-ui/components'
import { default as React, useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ModalStatus } from '@/components/ModalStatus'



function TabLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const searchParams = useSearchParams();
    useEffect(() => {
        const error = searchParams?.get('error');
        if (error) setError(error);
    }, []);
    
    const router = useRouter();
    
    return (
        <div>
            <TextInput placeholder='Username or Email' value={username} onChange={({target: {value}}) => setUsername(value)} />
            <PasswordInput placeholder='Password' value={password} onChange={({target: {value}}) => setPassword(value)} />
            <Button onClick={async () => {
                const result = await signIn('credentials', { username, password, callbackUrl: '/', redirect: false });
                if (!result) return;
                if (result.error) {
                    setError(result.error);
                }
                else {
                    router.replace('/');
                }
            }}>
                Login
            </Button>
            <hr />
            <Button onClick={() => signIn('facebook', { callbackUrl: '/' })}>
                Login with Facebook
            </Button>
            <Button onClick={() => signIn('github', { callbackUrl: '/' })}>
                Login with Github
            </Button>
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
                                default: return <p>
                                    Unknown. Please try again.
                                </p>
                            } // switch
                        })()}
                    </CardBody>
                </>}
            </ModalStatus>
        </div>
    );
}
function TabForget() {
    const [username, setUsername] = useState('');
    return (
        <div>
            <TextInput placeholder='Username or Email' value={username} onChange={({target: {value}}) => setUsername(value)} />
            <Button>
                Send Reset Password Link
            </Button>
        </div>
    );
}
export default function Login() {
    const [tabIndex, setTabIndex] = useState(0);
    const router = useRouter();
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
            </Tab>
        </Content>
    )
}
