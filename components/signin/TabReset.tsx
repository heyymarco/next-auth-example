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
    TooltipProps,
    Tooltip,
}                           from '@reusable-ui/components'

// internal components:
import {
    // dialog-components:
    ModalStatusProps,
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
    emailInputComponent            ?: React.ReactComponentElement<any, InputProps<Element>>
    passwordInputComponent         ?: React.ReactComponentElement<any, InputProps<Element>>
    password2InputComponent        ?: React.ReactComponentElement<any, InputProps<Element>>
    resetPasswordButtonComponent   ?: ButtonComponentProps['buttonComponent']
    tooltipComponent               ?: React.ReactComponentElement<any, TooltipProps<Element>>
    tooltipComponent2              ?: React.ReactComponentElement<any, TooltipProps<Element>>
    validatingModalStatusComponent ?: React.ReactComponentElement<any, ModalStatusProps<Element>>
}
export const TabReset = (props: TabResetProps) => {
    // rest props:
    const {
        // components:
        emailInputComponent            = (<InputWithLabel icon='supervisor_account' inputComponent={<EmailInput    />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        passwordInputComponent         = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        password2InputComponent        = (<InputWithLabel icon='lock'               inputComponent={<PasswordInput />} />            as React.ReactComponentElement<any, InputProps<Element>>),
        resetPasswordButtonComponent   = (<ButtonWithBusy busyType='recover'        buttonComponent={<ButtonIcon icon='save' />} />  as React.ReactComponentElement<any, ButtonProps>),
        tooltipComponent               = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                               as React.ReactComponentElement<any, TooltipProps<Element>>),
        tooltipComponent2              = (<Tooltip<Element> theme='warning' floatingPlacement='top' />                               as React.ReactComponentElement<any, TooltipProps<Element>>),
        validatingModalStatusComponent = (<ModalStatus<Element> theme='primary' />                                                   as React.ReactComponentElement<any, ModalStatusProps<Element>>),
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
            {/* <EmailInput> */}
            {React.cloneElement<InputProps<Element>>(emailInputComponent,
                // props:
                {
                    // classes:
                    className    : emailInputComponent.props.className    ?? 'username',
                    
                    
                    
                    // accessibilities:
                    readOnly     : emailInputComponent.props.readOnly     ?? true,
                    
                    
                    
                    // values:
                    value        : emailInputComponent.props.value        ?? (email ?? ''),
                },
            )}
            {/* <PasswordInput> */}
            {React.cloneElement<InputProps<Element>>(passwordInputComponent,
                // props:
                {
                    // refs:
                    elmRef       : passwordInputComponent.props.elmRef       ?? (isResetSection ? passwordRef : undefined),
                    
                    
                    
                    // classes:
                    className    : passwordInputComponent.props.className    ?? 'password',
                    
                    
                    
                    // accessibilities:
                    placeholder  : passwordInputComponent.props.placeholder  ?? 'New Password',
                    autoComplete : passwordInputComponent.props.autoComplete ?? 'new-password',
                    
                    
                    
                    // values:
                    value        : passwordInputComponent.props.value        ?? password,
                    
                    
                    
                    // validations:
                    isValid      : passwordInputComponent.props.isValid      ?? passwordValid,
                    required     : passwordInputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...passwordHandlers,
                    ...passwordFocusHandlers,
                },
            )}
            {/* <PasswordInput> */}
            {React.cloneElement<InputProps<Element>>(password2InputComponent,
                // props:
                {
                    // refs:
                    elmRef       : password2InputComponent.props.elmRef       ?? (isResetSection ? password2Ref : undefined),
                    
                    
                    
                    // classes:
                    className    : password2InputComponent.props.className    ?? 'password2',
                    
                    
                    
                    // accessibilities:
                    placeholder  : password2InputComponent.props.placeholder  ?? 'Confirm New Password',
                    autoComplete : password2InputComponent.props.autoComplete ?? 'new-password',
                    
                    
                    
                    // values:
                    value        : password2InputComponent.props.value        ?? password2,
                    
                    
                    
                    // validations:
                    isValid      : password2InputComponent.props.isValid      ?? password2Valid,
                    required     : password2InputComponent.props.required     ?? true,
                    
                    
                    
                    // handlers:
                    ...password2Handlers,
                    ...password2FocusHandlers,
                },
            )}
            {/* <Tooltip> */}
            {React.cloneElement<TooltipProps<Element>>(tooltipComponent,
                // props:
                {
                    // states:
                    expanded   : tooltipComponent.props.expanded   ?? (passwordFocused && !isBusy && isResetSection && !isResetApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : tooltipComponent.props.floatingOn ?? passwordRef,
                },
                
                
                
                // children:
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
                </List>,
            )}
            {/* <Tooltip> */}
            {React.cloneElement<TooltipProps<Element>>(tooltipComponent2,
                // props:
                {
                    // states:
                    expanded   : tooltipComponent2.props.expanded   ?? (password2Focused && !isBusy && isResetSection && !isResetApplied),
                    
                    
                    
                    // floatable:
                    floatingOn : tooltipComponent2.props.floatingOn ?? password2Ref,
                },
                
                
                
                // children:
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
                </List>,
            )}
            {/* <ResetPasswordButton> */}
            {React.cloneElement<ButtonProps>(resetPasswordButtonComponent,
                // props:
                {
                    // actions:
                    type      : resetPasswordButtonComponent.props.type      ?? 'submit',
                    
                    
                    
                    // classes:
                    className : resetPasswordButtonComponent.props.className ?? 'resetPassword',
                    
                    
                    
                    // handlers:
                    onClick   : resetPasswordButtonComponent.props.onClick   ?? doReset,
                },
                
                
                
                // children:
                resetPasswordButtonComponent.props.children ?? 'Reset Password',
            )}
            {/* <ModalStatus> */}
            {React.cloneElement<ModalStatusProps<Element>>(validatingModalStatusComponent,
                // props:
                {
                    // accessibilities:
                    inheritEnabled : validatingModalStatusComponent.props.inheritEnabled ?? false,
                    
                    
                    
                    // global stackable:
                    viewport       : validatingModalStatusComponent.props.viewport       ?? formRef,
                },
                
                
                
                // children:
                ((email === null) && <CardBody>
                    <p>
                        <Busy />&nbsp;Validating reset password token...
                    </p>
                </CardBody>),
            )}
        </form>
    );
};
