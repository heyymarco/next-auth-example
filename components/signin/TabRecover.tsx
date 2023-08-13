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
    inputUsernameComponent    ?: React.ReactComponentElement<any, InputProps<Element>>
    buttonSendRecoverLinkComponent ?: Required<ButtonComponentProps>['buttonComponent']
}
export const TabRecover = (props: TabRecoverProps) => {
    // rest props:
    const {
        // components:
        inputUsernameComponent         = (<InputWithLabel icon='supervisor_account' inputComponent={<TextInput     />} />                as React.ReactComponentElement<any, InputProps<Element>>),
        buttonSendRecoverLinkComponent = (<ButtonWithBusy busyType='recover'        buttonComponent={<ButtonIcon icon='lock_open' />} /> as React.ReactComponentElement<any, ButtonProps>),
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
            {React.cloneElement<InputProps<Element>>(inputUsernameComponent,
                // props:
                {
                    // refs:
                    elmRef       : inputUsernameComponent.props.elmRef       ?? (isRecoverSection ? usernameRef : undefined),
                    
                    
                    
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
            {/* <ButtonSendRecoverLink> */}
            {React.cloneElement<ButtonProps>(buttonSendRecoverLinkComponent,
                // props:
                {
                    // actions:
                    type      : buttonSendRecoverLinkComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : buttonSendRecoverLinkComponent.props.className ?? 'sendRecoverLink',
                    
                    
                    
                    // handlers:
                    onClick   : buttonSendRecoverLinkComponent.props.onClick   ?? doRecover,
                },
                
                
                
                // children:
                buttonSendRecoverLinkComponent.props.children ?? 'Send Reset Password Link',
            )}
        </form>
    );
};
