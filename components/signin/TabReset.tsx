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

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
}                           from '@reusable-ui/core'

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
    // dialogs:
    useDialogMessage,
}                           from '@/hooks/dialogMessage'
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

// other libs:
import axios                from 'axios'



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
        
        
        
        // data:
        resetPasswordToken,
        
        
        
        // states:
        section,
        isBusy,
        
        
        
        // fields & validations:
        formRef,
        
        username,
        
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
        
        
        
        // navigations:
        gotoSignIn,
        
        
        
        // actions:
        doReset,
    } = signInState;
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // states:
    const [verified, setVerified] = useState<undefined|{ email: string, username: string|null }|false>(!resetPasswordToken ? false : undefined);
    
    const [passwordFocused , setPasswordFocused ] = useState<boolean>(false);
    const [password2Focused, setPassword2Focused] = useState<boolean>(false);
    
    const isMounted = useMountedFlag();
    
    
    
    // dom effects:
    
    // validate password reset token at startup:
    const hasInitialized = useRef(false); // make sure the validation is never performed twice
    useEffect(() => {
        // conditions:
        if (!resetPasswordToken   ) return; // no token => nothing to reset => ignore
        if (verified !== undefined) return; // already verified with success/failed result => ignore
        if (hasInitialized.current) return; // already performed => ignore
        hasInitialized.current = true;      // mark as performed
        
        
        
        // actions:
        (async () => {
            // attempts validate password reset:
            try {
                const result = await axios.get(`/api/auth/reset?resetPasswordToken=${encodeURIComponent(resetPasswordToken)}`);
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                // success
                
                
                
                // save the success:
                setVerified(result.data);
            }
            catch (error: any) { // error
                // save the failure:
                setVerified(false);
                
                
                
                // report the failure:
                await showMessageFetchError(error);
                if (!isMounted.current) return; // unmounted => abort
                
                
                
                const errorCode     = error?.response?.status;
                const isClientError = (typeof(errorCode) === 'number') && ((errorCode >= 400) && (errorCode <= 499));
                if (isClientError) {
                    // redirect to sign in tab:
                    gotoSignIn();
                } // if
                // nothing to do with unverified token & server_side_error => keeps the UI disabled
                // else {
                //     // focus to password field:
                //     passwordRef.current?.setSelectionRange(0, password.length);
                //     passwordRef.current?.focus();
                // } // if
            } // try
        })();
    }, [resetPasswordToken, verified]);
    
    // focus on password field after successfully verified the password reset token:
    useEffect(() => {
        // conditions:
        if (!verified) return; // NOT verified with success result => ignore
        
        
        
        // actions:
        passwordRef.current?.focus();
    }, [verified]);
    
    
    
    // handlers:
    const doResetEx = useEvent(async (): Promise<void> => {
        setPasswordFocused(false);  // important to hide the <Tooltip>
        setPassword2Focused(false); // important to hide the <Tooltip>
        
        
        
        await doReset();
    });
    
    const handlePasswordFocus   = useEvent((): void => {
        setPasswordFocused(true);
    });
    const handlePasswordBlur    = useEvent((): void => {
        setPasswordFocused(false);
    });
    
    const handlePassword2Focus  = useEvent((): void => {
        setPassword2Focused(true);
    });
    const handlePassword2Blur   = useEvent((): void => {
        setPassword2Focused(false);
    });
    
    
    
    // jsx:
    const isResetSection = (section === 'reset');
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
                    value={(!!verified && verified?.email) || ''}
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
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
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
                    onFocus={handlePassword2Focus}
                    onBlur={handlePassword2Blur}
                />
            </Group>
            <Tooltip
                // variants:
                theme='warning'
                
                
                
                // states:
                expanded={passwordFocused && !isBusy}
                
                
                
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
                expanded={password2Focused && !isBusy}
                
                
                
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
                    onClick   : buttonResetPasswordComponent.props.onClick   ?? doResetEx,
                },
                
                
                
                // children:
                buttonResetPasswordComponent.props.children ?? 'Reset Password',
            )}
            <ModalStatus
                // variants:
                theme='primary'
                
                
                
                // global stackable:
                viewport={formRef}
            >
                {(verified === undefined) && <CardBody>
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
