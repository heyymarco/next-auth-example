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
    // apis:
    signIn,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'

// reusable-ui components:
import {
    // simple-components:
    Icon,
    Label,
    ButtonProps,
    ButtonComponentProps,
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
import {
    // react components:
    ButtonWithBusy,
}                           from './ButtonWithBusy'
import {
    // react components:
    ButtonWithSignIn,
}                           from './ButtonWithSignIn'

// internals:
import {
    // states:
    useSignInState,
}                           from './states/signInState'
import {
    // utilities:
    invalidSelector,
    getAuthErrorDescription,
    resolveProviderName as defaultResolveProviderName,
    
    
    
    // handlers:
    handlePreventSubmit,
}                           from './utilities'



// react components:
export interface TabSignInProps {
    // auths:
    providers                 ?: BuiltInProviderType[]
    resolveProviderName       ?: (oAuthProvider: BuiltInProviderType) => string
    
    
    
    // components:
    buttonSignInComponent     ?: Required<ButtonComponentProps>['buttonComponent']
    buttonSignInWithComponent ?: Required<ButtonComponentProps>['buttonComponent'] | ((oAuthProvider: BuiltInProviderType) => Required<ButtonComponentProps>['buttonComponent'])
}
export const TabSignIn = (props: TabSignInProps) => {
    // rest props:
    const {
        // auths:
        providers = [],
        resolveProviderName = defaultResolveProviderName,
        
        
        
        // components:
        buttonSignInComponent     = (<ButtonWithBusy busyType='credentials' buttonComponent={<ButtonIcon icon='login' />} /> as React.ReactComponentElement<any, ButtonProps>),
        buttonSignInWithComponent = (((oAuthProvider: BuiltInProviderType) => <ButtonWithBusy busyType={oAuthProvider} buttonComponent={<ButtonIcon icon={oAuthProvider} />} />) as Required<TabSignInProps>['buttonSignInWithComponent']),
    } = props;
    
    
    
    // navigations:
    const router = useRouter();
    
    
    
    // states:
    const signInState = useSignInState();
    const {
        // states:
        section,
        setIsBusy,
        
        
        
        // data:
        callbackUrl,
    } = signInState;
    
    
    
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
    
    const isMounted = useMountedFlag();
    
    
    
    // refs:
    const formSignInRef = useRef<HTMLFormElement|null>(null);
    const usernameRef   = useRef<HTMLInputElement|null>(null);
    
    
    
    // dom effects:
    
    // focus on username field when the <TabSignIn> is active:
    useEffect(() => {
        // conditions:
        if (section !== 'signIn') return; // <TabSignIn> is NOT active => ignore
        
        
        
        // actions:
        usernameRef.current?.focus();
    }, [section]);
    
    // resets input states when the <TabSignIn> is NOT active:
    useEffect(() => {
        // conditions:
        if (section === 'signIn') return; // <TabSignIn> is active => ignore
        
        
        
        // resets:
        setEnableValidation(false);
        setUsername('');
        setPassword('');
    }, [section]);
    
    
    
    // handlers:
    const handleSignInUsingCredentials = useEvent(async (): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
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
        setIsBusy('credentials'); // mark as busy
        const result = await signIn('credentials', { username, password, redirect: false });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // verify the sign in status:
        if (!result?.ok) { // error
            setIsBusy(false); // unmark as busy
            
            
            
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
    const handleSignInUsingOAuth       = useEvent(async (providerType: BuiltInProviderType): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        // attempts sign in using OAuth:
        setIsBusy(providerType); // mark as busy
        const result = await signIn(providerType, { callbackUrl: loggedInRedirectPath });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // verify the sign in status:
        if ((result !== undefined) && !result?.ok) { // error
            setIsBusy(false); // unmark as busy
            
            
            
            // report the failure:
            showMessageError(getAuthErrorDescription(result?.error ?? 'OAuthSignin'));
        }
        else { // success
            // report the success:
            showMessageNotification(
                <p>You are being redirected to <strong>{resolveProviderName(providerType)} sign in page</strong>. Please wait...</p>
            );
        } // if
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
            <ValidationProvider
                // validations:
                enableValidation={enableValidation}
            >
                <Group className='username'>
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
                <Group className='password'>
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
                {/* <ButtonSignIn> */}
                {React.cloneElement<ButtonProps>(buttonSignInComponent,
                    // props:
                    {
                        // actions:
                        type      : buttonSignInComponent.props.type      ?? 'submit',
                        
                        
                        
                        // classes:
                        className : buttonSignInComponent.props.className ?? 'signin credentials',
                        
                        
                        
                        // handlers:
                        onClick   : buttonSignInComponent.props.onClick   ?? handleSignInUsingCredentials,
                    },
                    
                    
                    
                    // children:
                    buttonSignInComponent.props.children ?? 'Sign In',
                )}
                <hr className='signinSeparator' />
                {providers.map((providerType) => {
                    const buttonSignInWithProviderComponent : React.ReactComponentElement<any, ButtonProps> = (
                        (typeof(buttonSignInWithComponent) === 'function')
                        ? buttonSignInWithComponent(providerType)
                        : buttonSignInWithComponent
                    );
                    
                    
                    
                    // jsx:
                    return (
                        <ButtonWithSignIn
                            // identifiers:
                            key={providerType}
                            
                            
                            
                            // auths:
                            providerType={providerType}
                            
                            
                            
                            // components:
                            buttonComponent={
                                React.cloneElement<ButtonProps>(buttonSignInWithProviderComponent,
                                    // props:
                                    {
                                        // identifiers:
                                        key       : providerType,
                                        
                                        
                                        
                                        // actions:
                                        type      : buttonSignInWithProviderComponent.props.type      ?? 'submit',
                                        
                                        
                                        
                                        // classes:
                                        className : buttonSignInWithProviderComponent.props.className ?? `signin ${providerType}`,
                                    },
                                    
                                    
                                    
                                    // children:
                                    buttonSignInWithProviderComponent.props.children ?? <>Sign In with {resolveProviderName(providerType)}</>,
                                )
                            }
                            
                            
                            
                            // handlers:
                            onSignInUsingOAuth={handleSignInUsingOAuth}
                        />
                    );
                })}
            </ValidationProvider>
        </form>
    );
};
