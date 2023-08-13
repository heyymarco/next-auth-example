'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next auth:
import {
    // types:
    type BuiltInProviderType,
}                           from 'next-auth/providers'

// reusable-ui components:
import {
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
    InputProps,
    TextInput,
    PasswordInput,
}                           from '@reusable-ui/components'

// internal components:
import {
    // react components:
    InputWithLabel,
}                           from './InputWithLabel'
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
    // handlers:
    handlePreventSubmit,
}                           from './utilities'



// react components:
export interface TabSignInProps {
    // auths:
    providers                 ?: BuiltInProviderType[]
    
    
    
    // components:
    usernameInputComponent    ?: React.ReactComponentElement<any, InputProps<Element>>
    passwordInputComponent    ?: React.ReactComponentElement<any, InputProps<Element>>
    signInButtonComponent     ?: Required<ButtonComponentProps>['buttonComponent']
    signInWithButtonComponent ?: Required<ButtonComponentProps>['buttonComponent'] | ((oAuthProvider: BuiltInProviderType) => Required<ButtonComponentProps>['buttonComponent'])
}
export const TabSignIn = (props: TabSignInProps) => {
    // rest props:
    const {
        // auths:
        providers = [],
        
        
        
        // components:
        usernameInputComponent    = (<InputWithLabel icon='supervisor_account' inputComponent={<TextInput     />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        passwordInputComponent    = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        signInButtonComponent     = (<ButtonWithBusy busyType='credentials'    buttonComponent={<ButtonIcon icon='login' />} /> as React.ReactComponentElement<any, ButtonProps>),
        signInWithButtonComponent = (((oAuthProvider: BuiltInProviderType) => <ButtonWithBusy busyType={oAuthProvider} buttonComponent={<ButtonIcon icon={oAuthProvider} />} />) as Required<TabSignInProps>['signInWithButtonComponent']),
    } = props;
    
    
    
    // states:
    const signInState = useSignInState();
    const {
        // states:
        isSignInSection,
        
        
        
        // fields & validations:
        formRef,
        
        usernameRef,
        username,
        usernameHandlers,
        usernameValid,
        
        passwordRef,
        password,
        passwordHandlers,
        passwordValid,
        
        
        
        // actions:
        doSignIn,
        doSignInWith,
        
        
        
        // utilities:
        resolveProviderName
    } = signInState;
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={isSignInSection ? formRef : undefined}
            
            
            
            // validations:
            noValidate={true}
            
            
            
            // handlers:
            onSubmit={handlePreventSubmit}
        >
            {/* <UsernameInput> */}
            {React.cloneElement<InputProps<Element>>(usernameInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : usernameInputComponent.props.elmRef       ?? (isSignInSection ? usernameRef : undefined),
                    
                    
                    
                    // classes:
                    className    : usernameInputComponent.props.className    ?? 'username',
                    
                    
                    
                    // accessibilities:
                    placeholder  : usernameInputComponent.props.placeholder  ?? 'Username or Email',
                    autoComplete : usernameInputComponent.props.autoComplete ?? 'username',
                    
                    
                    
                    // values:
                    value        : usernameInputComponent.props.value        ?? username,
                    
                    
                    
                    // validations:
                    isValid      : usernameInputComponent.props.isValid      ?? usernameValid,
                    required     : usernameInputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...usernameHandlers,
                },
            )}
            {/* <PasswordInput> */}
            {React.cloneElement<InputProps<Element>>(passwordInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : passwordInputComponent.props.elmRef       ?? (isSignInSection ? passwordRef : undefined),
                    
                    
                    
                    // classes:
                    className    : passwordInputComponent.props.className    ?? 'password',
                    
                    
                    
                    // accessibilities:
                    placeholder  : passwordInputComponent.props.placeholder  ?? 'Password',
                    autoComplete : passwordInputComponent.props.autoComplete ?? 'current-password',
                    
                    
                    
                    // values:
                    value        : passwordInputComponent.props.value        ?? password,
                    
                    
                    
                    // validations:
                    isValid      : passwordInputComponent.props.isValid      ?? passwordValid,
                    required     : passwordInputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...passwordHandlers,
                },
            )}
            {/* <SignInButton> */}
            {React.cloneElement<ButtonProps>(signInButtonComponent,
                // props:
                {
                    // actions:
                    type      : signInButtonComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : signInButtonComponent.props.className ?? 'signin credentials',
                    
                    
                    
                    // handlers:
                    onClick   : signInButtonComponent.props.onClick   ?? doSignIn,
                },
                
                
                
                // children:
                signInButtonComponent.props.children ?? 'Sign In',
            )}
            <hr className='signinSeparator' />
            {providers.map((providerType) => {
                const signInWithProviderButtonComponent : React.ReactComponentElement<any, ButtonProps> = (
                    (typeof(signInWithButtonComponent) === 'function')
                    ? signInWithButtonComponent(providerType)
                    : signInWithButtonComponent
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
                            /* <SignInWithProviderButton> */
                            React.cloneElement<ButtonProps>(signInWithProviderButtonComponent,
                                // props:
                                {
                                    // identifiers:
                                    key       : providerType,
                                    
                                    
                                    
                                    // actions:
                                    type      : signInWithProviderButtonComponent.props.type      ?? 'submit',
                                    
                                    
                                    
                                    // classes:
                                    className : signInWithProviderButtonComponent.props.className ?? `signin ${providerType}`,
                                },
                                
                                
                                
                                // children:
                                signInWithProviderButtonComponent.props.children ?? <>Sign In with {resolveProviderName(providerType)}</>,
                            )
                        }
                        
                        
                        
                        // handlers:
                        onSignInWith={doSignInWith}
                    />
                );
            })}
        </form>
    );
};
