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
    inputUsernameComponent    ?: React.ReactComponentElement<any, InputProps<Element>>
    inputPasswordComponent    ?: React.ReactComponentElement<any, InputProps<Element>>
    buttonSignInComponent     ?: Required<ButtonComponentProps>['buttonComponent']
    buttonSignInWithComponent ?: Required<ButtonComponentProps>['buttonComponent'] | ((oAuthProvider: BuiltInProviderType) => Required<ButtonComponentProps>['buttonComponent'])
}
export const TabSignIn = (props: TabSignInProps) => {
    // rest props:
    const {
        // auths:
        providers = [],
        
        
        
        // components:
        inputUsernameComponent    = (<InputWithLabel icon='supervisor_account' inputComponent={<TextInput     />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        inputPasswordComponent    = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        buttonSignInComponent     = (<ButtonWithBusy busyType='credentials'    buttonComponent={<ButtonIcon icon='login' />} /> as React.ReactComponentElement<any, ButtonProps>),
        buttonSignInWithComponent = (((oAuthProvider: BuiltInProviderType) => <ButtonWithBusy busyType={oAuthProvider} buttonComponent={<ButtonIcon icon={oAuthProvider} />} />) as Required<TabSignInProps>['buttonSignInWithComponent']),
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
            {React.cloneElement<InputProps<Element>>(inputUsernameComponent,
                // props:
                {
                    // refs:
                    elmRef       : inputUsernameComponent.props.elmRef       ?? (isSignInSection ? usernameRef : undefined),
                    
                    
                    
                    // classes:
                    className    : inputUsernameComponent.props.className    ?? 'username',
                    
                    
                    
                    // accessibilities:
                    placeholder  : inputUsernameComponent.props.placeholder  ?? 'Username or Email',
                    autoComplete : inputUsernameComponent.props.autoComplete ?? 'username',
                    
                    
                    
                    // values:
                    value        : inputUsernameComponent.props.value        ?? username,
                    
                    
                    
                    // validations:
                    isValid      : inputUsernameComponent.props.isValid      ?? usernameValid,
                    required     : inputUsernameComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...usernameHandlers,
                },
            )}
            {React.cloneElement<InputProps<Element>>(inputPasswordComponent,
                // props:
                {
                    // refs:
                    elmRef       : inputPasswordComponent.props.elmRef       ?? (isSignInSection ? passwordRef : undefined),
                    
                    
                    
                    // classes:
                    className    : inputPasswordComponent.props.className    ?? 'password',
                    
                    
                    
                    // accessibilities:
                    placeholder  : inputPasswordComponent.props.placeholder  ?? 'Password',
                    autoComplete : inputPasswordComponent.props.autoComplete ?? 'current-password',
                    
                    
                    
                    // values:
                    value        : inputPasswordComponent.props.value        ?? password,
                    
                    
                    
                    // validations:
                    isValid      : inputPasswordComponent.props.isValid      ?? passwordValid,
                    required     : inputPasswordComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...passwordHandlers,
                },
            )}
            {/* <ButtonSignIn> */}
            {React.cloneElement<ButtonProps>(buttonSignInComponent,
                // props:
                {
                    // actions:
                    type      : buttonSignInComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : buttonSignInComponent.props.className ?? 'signin credentials',
                    
                    
                    
                    // handlers:
                    onClick   : buttonSignInComponent.props.onClick   ?? doSignIn,
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
                        onSignInWith={doSignInWith}
                    />
                );
            })}
        </form>
    );
};
