'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    Icon,
    Label,
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
    TextInput,
    
    
    
    // composite-components:
    Group,
}                           from '@reusable-ui/components'

// internal components:
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
    buttonSendRecoverLinkComponent ?: Required<ButtonComponentProps>['buttonComponent']
}
export const TabRecover = (props: TabRecoverProps) => {
    // rest props:
    const {
        // components:
        buttonSendRecoverLinkComponent = (<ButtonWithBusy busyType='recover' buttonComponent={<ButtonIcon icon='lock_open' />} /> as React.ReactComponentElement<any, ButtonProps>),
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
        usernameChange,
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
                    elmRef={isRecoverSection ? usernameRef : undefined}
                    
                    
                    
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
