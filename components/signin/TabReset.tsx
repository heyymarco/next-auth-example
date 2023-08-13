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
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
    InputProps,
    PasswordInput,
    EmailInput,
    
    
    
    // layout-components:
    ListItem,
    List,
    CardBody,
    
    
    
    // status-components:
    Busy,
    
    
    
    // notification-components:
    Tooltip,
}                           from '@reusable-ui/components'

// internal components:
import {
    // dialog-components:
    ModalStatus,
}                           from '@/components/ModalStatus'
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
import {
    // hooks:
    useFocusState,
}                           from './hooks'



// react components:
export interface TabResetProps {
    // components:
    inputEmailComponent          ?: React.ReactComponentElement<any, InputProps<Element>>
    inputPasswordComponent       ?: React.ReactComponentElement<any, InputProps<Element>>
    inputPassword2Component      ?: React.ReactComponentElement<any, InputProps<Element>>
    buttonResetPasswordComponent ?: Required<ButtonComponentProps>['buttonComponent']
}
export const TabReset = (props: TabResetProps) => {
    // rest props:
    const {
        // components:
        inputEmailComponent          = (<InputWithLabel icon='supervisor_account' inputComponent={<EmailInput    />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        inputPasswordComponent       = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        inputPassword2Component      = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        buttonResetPasswordComponent = (<ButtonWithBusy busyType='recover' buttonComponent={<ButtonIcon icon='save' />} /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // states:
    const signInState = useSignInState();
    const {
        // constraints:
        passwordMinLength,
        passwordMaxLength,
        passwordHasUppercase,
        passwordHasLowercase,
        
        
        
        // states:
        isResetSection,
        isResetApplied,
        isBusy,
        
        
        
        // fields & validations:
        formRef,
        
        email,
        
        passwordRef,
        password,
        passwordHandlers,
        passwordValid,
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        
        password2Ref,
        password2,
        password2Handlers,
        password2Valid,
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
        
        
        
        // actions:
        doReset,
    } = signInState;
    
    
    
    // states:
    const [passwordFocused , passwordFocusHandlers ] = useFocusState<HTMLSpanElement>();
    const [password2Focused, password2FocusHandlers] = useFocusState<HTMLSpanElement>();
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={isResetSection ? formRef : undefined}
            
            
            
            // validations:
            noValidate={true}
            
            
            
            // handlers:
            onSubmit={handlePreventSubmit}
        >
            {React.cloneElement<InputProps<Element>>(inputEmailComponent,
                // props:
                {
                    // classes:
                    className    : inputEmailComponent.props.className    ?? 'username',
                    
                    
                    
                    // accessibilities:
                    readOnly     : inputEmailComponent.props.readOnly     ?? true,
                    
                    
                    
                    // values:
                    value        : inputEmailComponent.props.value        ?? (email ?? ''),
                },
            )}
            {React.cloneElement<InputProps<Element>>(inputPasswordComponent,
                // props:
                {
                    // refs:
                    elmRef       : inputPasswordComponent.props.elmRef       ?? (isResetSection ? passwordRef : undefined),
                    
                    
                    
                    // classes:
                    className    : inputPasswordComponent.props.className    ?? 'password',
                    
                    
                    
                    // accessibilities:
                    placeholder  : inputPasswordComponent.props.placeholder  ?? 'New Password',
                    autoComplete : inputPasswordComponent.props.autoComplete ?? 'new-password',
                    
                    
                    
                    // values:
                    value        : inputPasswordComponent.props.value        ?? password,
                    
                    
                    
                    // validations:
                    isValid      : inputPasswordComponent.props.isValid      ?? passwordValid,
                    required     : inputPasswordComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...passwordHandlers,
                    ...passwordFocusHandlers,
                },
            )}
            {React.cloneElement<InputProps<Element>>(inputPassword2Component,
                // props:
                {
                    // refs:
                    elmRef       : inputPassword2Component.props.elmRef       ?? (isResetSection ? password2Ref : undefined),
                    
                    
                    
                    // classes:
                    className    : inputPassword2Component.props.className    ?? 'password2',
                    
                    
                    
                    // accessibilities:
                    placeholder  : inputPassword2Component.props.placeholder  ?? 'Confirm New Password',
                    autoComplete : inputPassword2Component.props.autoComplete ?? 'new-password',
                    
                    
                    
                    // values:
                    value        : inputPassword2Component.props.value        ?? password2,
                    
                    
                    
                    // validations:
                    isValid      : inputPassword2Component.props.isValid      ?? password2Valid,
                    required     : inputPassword2Component.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...password2Handlers,
                    ...password2FocusHandlers,
                },
            )}
            <Tooltip
                // variants:
                theme='warning'
                
                
                
                // states:
                expanded={passwordFocused && !isBusy && isResetSection && !isResetApplied}
                
                
                
                // floatable:
                floatingOn={passwordRef}
                floatingPlacement='top'
            >
                <List
                    // variants:
                    listStyle='flat'
                >
                    <ListItem
                        // variants:
                        size='sm'
                        theme={passwordValidLength ? 'success' : 'danger'}
                        outlined={true}
                    >
                        <Icon
                            // appearances:
                            icon={passwordValidLength ? 'check' : 'error_outline'}
                        />
                        &nbsp;
                        {passwordMinLength}-{passwordMaxLength} characters
                    </ListItem>
                    {passwordHasUppercase && <ListItem
                        // variants:
                        size='sm'
                        theme={passwordValidUppercase ? 'success' : 'danger'}
                        outlined={true}
                    >
                        <Icon
                            // appearances:
                            icon={passwordValidUppercase ? 'check' : 'error_outline'}
                        />
                        &nbsp;
                        At least one capital letter
                    </ListItem>}
                    {passwordHasLowercase && <ListItem
                        // variants:
                        size='sm'
                        theme={passwordValidLowercase ? 'success' : 'danger'}
                        outlined={true}
                    >
                        <Icon
                            // appearances:
                            icon={passwordValidLowercase ? 'check' : 'error_outline'}
                        />
                        &nbsp;
                        At least one non-capital letter
                    </ListItem>}
                </List>
            </Tooltip>
            <Tooltip
                // variants:
                theme='warning'
                
                
                
                // states:
                expanded={password2Focused && !isBusy && isResetSection && !isResetApplied}
                
                
                
                // floatable:
                floatingOn={password2Ref}
                floatingPlacement='top'
            >
                <List
                    // variants:
                    listStyle='flat'
                >
                    <ListItem
                        // variants:
                        size='sm'
                        theme={password2ValidLength ? 'success' : 'danger'}
                        outlined={true}
                    >
                        <Icon
                            // appearances:
                            icon={password2ValidLength ? 'check' : 'error_outline'}
                        />
                        &nbsp;
                        {passwordMinLength}-{passwordMaxLength} characters
                    </ListItem>
                    {passwordHasUppercase && <ListItem
                        // variants:
                        size='sm'
                        theme={password2ValidUppercase ? 'success' : 'danger'}
                        outlined={true}
                    >
                        <Icon
                            // appearances:
                            icon={password2ValidUppercase ? 'check' : 'error_outline'}
                        />
                        &nbsp;
                        At least one capital letter
                    </ListItem>}
                    {passwordHasLowercase && <ListItem
                        // variants:
                        size='sm'
                        theme={password2ValidLowercase ? 'success' : 'danger'}
                        outlined={true}
                    >
                        <Icon
                            // appearances:
                            icon={password2ValidLowercase ? 'check' : 'error_outline'}
                        />
                        &nbsp;
                        At least one non-capital letter
                    </ListItem>}
                    <ListItem
                        // variants:
                        size='sm'
                        theme={password2ValidMatch ? 'success' : 'danger'}
                        outlined={true}
                    >
                        <Icon
                            // appearances:
                            icon={password2ValidMatch ? 'check' : 'error_outline'}
                        />
                        &nbsp;
                        Exact match to previous password
                    </ListItem>
                </List>
            </Tooltip>
            {/* <ButtonResetPassword> */}
            {React.cloneElement<ButtonProps>(buttonResetPasswordComponent,
                // props:
                {
                    // actions:
                    type      : buttonResetPasswordComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : buttonResetPasswordComponent.props.className ?? 'resetPassword',
                    
                    
                    
                    // handlers:
                    onClick   : buttonResetPasswordComponent.props.onClick   ?? doReset,
                },
                
                
                
                // children:
                buttonResetPasswordComponent.props.children ?? 'Reset Password',
            )}
            <ModalStatus
                // variants:
                theme='primary'
                
                
                
                // accessibilities:
                inheritEnabled={false}
                
                
                
                // global stackable:
                viewport={formRef}
            >
                {(email === null) && <CardBody>
                    <p>
                        <Busy />&nbsp;Validating reset password token...
                    </p>
                </CardBody>}
            </ModalStatus>
        </form>
    );
};
