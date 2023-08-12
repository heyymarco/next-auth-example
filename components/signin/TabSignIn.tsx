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
    buttonSignInComponent     ?: Required<ButtonComponentProps>['buttonComponent']
    buttonSignInWithComponent ?: Required<ButtonComponentProps>['buttonComponent'] | ((oAuthProvider: BuiltInProviderType) => Required<ButtonComponentProps>['buttonComponent'])
}
export const TabSignIn = (props: TabSignInProps) => {
    // rest props:
    const {
        // auths:
        providers = [],
        
        
        
        // components:
        buttonSignInComponent     = (<ButtonWithBusy busyType='credentials' buttonComponent={<ButtonIcon icon='login' />} /> as React.ReactComponentElement<any, ButtonProps>),
        buttonSignInWithComponent = (((oAuthProvider: BuiltInProviderType) => <ButtonWithBusy busyType={oAuthProvider} buttonComponent={<ButtonIcon icon={oAuthProvider} />} />) as Required<TabSignInProps>['buttonSignInWithComponent']),
    } = props;
    
    
    
    // states:
    const signInState = useSignInState();
    const {
        // states:
        section,
        
        
        
        // fields & validations:
        formRef,
        
        usernameRef,
        username,
        usernameChange,
        usernameValid,
        
        passwordRef,
        password,
        passwordChange,
        passwordValid,
        
        
        
        // actions:
        doSignIn,
        doSignInWith,
        
        
        
        // utilities:
        resolveProviderName
    } = signInState;
    
    
    
    // jsx:
    const isSignInSection = (section === 'signIn');
    return (
        <form
            // refs:
            ref={isSignInSection ? formRef : undefined}
            
            
            
            // validations:
            noValidate={true}
            
            
            
            // handlers:
            onSubmit={handlePreventSubmit}
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
                    elmRef={isSignInSection ? usernameRef : undefined}
                    
                    
                    
                    // accessibilities:
                    placeholder='Username or Email'
                    autoComplete='username'
                    
                    
                    
                    // values:
                    value={username}
                    onChange={usernameChange}
                    
                    
                    
                    // validations:
                    isValid={usernameValid}
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
                    // refs:
                    elmRef={isSignInSection ? passwordRef : undefined}
                    
                    
                    
                    // accessibilities:
                    placeholder='Password'
                    autoComplete='current-password'
                    
                    
                    
                    // values:
                    value={password}
                    onChange={passwordChange}
                    
                    
                    
                    // validations:
                    isValid={passwordValid}
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
