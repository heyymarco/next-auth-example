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
    
    
    
    // composite-components:
    Group,
}                           from '@reusable-ui/components'

// internal components:
import {
    // dialog-components:
    ModalStatus,
}                           from '@/components/ModalStatus'
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
    buttonResetPasswordComponent ?: Required<ButtonComponentProps>['buttonComponent']
}
export const TabReset = (props: TabResetProps) => {
    // rest props:
    const {
        // components:
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
        passwordChange,
        passwordValid,
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        
        password2Ref,
        password2,
        password2Change,
        password2Valid,
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
        
        
        
        // actions:
        doReset,
    } = signInState;
    
    
    
    // states:
    const [passwordFocused , passwordHandlers ] = useFocusState<HTMLSpanElement>();
    const [password2Focused, password2Handlers] = useFocusState<HTMLSpanElement>();
    
    
    
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
                <EmailInput
                    // accessibilities:
                    readOnly={true}
                    
                    
                    
                    // values:
                    value={email ?? ''}
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
                    elmRef={isResetSection ? passwordRef : undefined}
                    
                    
                    
                    // accessibilities:
                    placeholder='New Password'
                    autoComplete='new-password'
                    
                    
                    
                    // values:
                    value={password}
                    onChange={passwordChange}
                    
                    
                    
                    // validations:
                    isValid={passwordValid}
                    required={true}
                    // minLength={passwordMinLength} // validate on JS level
                    // maxLength={passwordMaxLength} // validate on JS level
                    
                    
                    
                    // handlers:
                    {...passwordHandlers}
                />
            </Group>
            <Group className='password2'>
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
                    elmRef={isResetSection ? password2Ref : undefined}
                    
                    
                    
                    // accessibilities:
                    placeholder='Confirm New Password'
                    autoComplete='new-password'
                    
                    
                    
                    // values:
                    value={password2}
                    onChange={password2Change}
                    
                    
                    
                    // validations:
                    isValid={password2Valid}
                    required={true}
                    // minLength={passwordMinLength} // validate on JS level
                    // maxLength={passwordMaxLength} // validate on JS level
                    
                    
                    
                    // handlers:
                    {...password2Handlers}
                />
            </Group>
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
                        <Busy />
                        &nbsp;
                        validating...
                    </p>
                </CardBody>}
            </ModalStatus>
        </form>
    );
};
