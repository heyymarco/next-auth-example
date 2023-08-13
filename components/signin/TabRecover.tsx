'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
    InputProps,
    TextInput,
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
export interface TabRecoverProps {
    // components:
    usernameInputComponent         ?: React.ReactComponentElement<any, InputProps<Element>>
    sendRecoverLinkButtonComponent ?: ButtonComponentProps['buttonComponent']
}
export const TabRecover = (props: TabRecoverProps) => {
    // rest props:
    const {
        // components:
        usernameInputComponent         = (<InputWithLabel icon='supervisor_account' inputComponent={<TextInput     />} />                as React.ReactComponentElement<any, InputProps<Element>>),
        sendRecoverLinkButtonComponent = (<ButtonWithBusy busyType='recover'        buttonComponent={<ButtonIcon icon='lock_open' />} /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // states:
    const signInState = useSignInState();
    const {
        // states:
        isRecoverSection,
        
        
        
        // fields & validations:
        formRef,
        
        usernameRef,
        username,
        usernameHandlers,
        usernameValid,
        
        
        
        // actions:
        doRecover,
    } = signInState;
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={isRecoverSection ? formRef : undefined}
            
            
            
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
                    elmRef       : usernameInputComponent.props.elmRef       ?? (isRecoverSection ? usernameRef : undefined),
                    
                    
                    
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
            {/* <SendRecoverLinkButton> */}
            {React.cloneElement<ButtonProps>(sendRecoverLinkButtonComponent,
                // props:
                {
                    // actions:
                    type      : sendRecoverLinkButtonComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : sendRecoverLinkButtonComponent.props.className ?? 'sendRecoverLink',
                    
                    
                    
                    // handlers:
                    onClick   : sendRecoverLinkButtonComponent.props.onClick   ?? doRecover,
                },
                
                
                
                // children:
                sendRecoverLinkButtonComponent.props.children ?? 'Send Reset Password Link',
            )}
        </form>
    );
};
