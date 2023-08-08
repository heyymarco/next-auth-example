'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useRef,
    useState,
}                           from 'react'

// next:
import {
    // navigations:
    useRouter,
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
    // simple-components:
    Icon,
    Label,
    ButtonIcon,
    TextInput,
    PasswordInput,
    
    
    
    // composite-components:
    Group,
}                           from '@reusable-ui/components'

// internal components:
import {
    // dialogs:
    useDialogMessage,
}                           from '@/hooks/dialogMessage'

// internals:
import {
    useSigninContext,
}                           from './signinContext'
import {
    // utilities:
    invalidSelector,
    getAuthErrorDescription,
    
    
    
    // handlers:
    handlePreventSubmit,
}                           from './utilities'



// react components:
export const TabSignIn  = () => {
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
