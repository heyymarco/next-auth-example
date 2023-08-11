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
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a validation management system:
    ValidationProvider,
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
    // utilities:
    invalidSelector,
    
    
    
    // handlers:
    handlePreventSubmit,
}                           from './utilities'

// other libs:
import axios                from 'axios'

// configs:
import {
    default as credentialsConfig,
}                           from '@/credentials.config'



// react components:
export interface TabResetProps {
    // components:
    buttonResetPasswordComponent ?: Required<ButtonComponentProps>['buttonComponent']
}
export const TabReset = (props: TabResetProps) => {
    // rest props:
    const {
        // components:
        buttonResetPasswordComponent = (<ButtonWithBusy busyType='sendResetLink' buttonComponent={<ButtonIcon icon='save' />} /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // states:
    const {
        // data:
        resetPasswordToken,
        
        
        
        // navigations:
        gotoSignIn,
    } = useSignInState();
    
    
    
    // dialogs:
    const {
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
    } = useDialogMessage();
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [password        , setPassword        ] = useState<string>('');
    const [password2       , setPassword2       ] = useState<string>('');
    
    const [verified, setVerified] = useState<undefined|{ email: string, username: string|null }|false>(!resetPasswordToken ? false : undefined);
    
    const [passwordFocused , setPasswordFocused ] = useState<boolean>(false);
    const [password2Focused, setPassword2Focused] = useState<boolean>(false);
    
    const isMounted       = useMountedFlag();
    let   [busy, setBusy] = useState<boolean>(false);
    
    
    
    // refs:
    const formResetRef = useRef<HTMLFormElement|null>(null);
    const passwordRef  = useRef<HTMLInputElement|null>(null);
    const password2Ref = useRef<HTMLInputElement|null>(null);
    
    
    
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
    const handleDoPasswordReset = useEvent(async (): Promise<void> => {
        // conditions:
        if (busy) return; // ignore when busy
        
        
        
        // validate:
        // enable validation and *wait* until the next re-render of validation_enabled before we're going to `querySelectorAll()`:
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (!isMounted.current) return; // unmounted => abort
        const invalidFields = formResetRef?.current?.querySelectorAll?.(invalidSelector);
        if (invalidFields?.length) { // there is an/some invalid field
            showMessageFieldError(invalidFields);
            return;
        } // if
        
        
        
        // attempts apply password reset:
        setBusy(busy = true); // mark as busy
        try {
            const result = await axios.patch('/api/auth/reset', { resetPasswordToken, password });
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // success
            
            
            
            setBusy(busy = false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPassword('');
            setPassword2('');
            setPasswordFocused(false);  // important to hide the <Tooltip>
            setPassword2Focused(false); // important to hide the <Tooltip>
            
            
            
            // report the success:
            await showMessageSuccess(
                <p>
                    {result.data.message ?? 'The password has been successfully changed. Now you can sign in with the new password.'}
                </p>
            );
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // redirect to sign in tab:
            gotoSignIn();
        }
        catch (error: any) { // error
            setBusy(busy = false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPasswordFocused(false);  // important to hide the <Tooltip>
            setPassword2Focused(false); // important to hide the <Tooltip>
            
            
            
            // report the failure:
            await showMessageFetchError(error);
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            const errorCode     = error?.response?.status;
            const isClientError = (typeof(errorCode) === 'number') && ((errorCode >= 400) && (errorCode <= 499));
            if (isClientError) {
                // redirect to sign in tab:
                gotoSignIn();
            }
            else {
                // focus to password field:
                passwordRef.current?.setSelectionRange(0, password.length);
                passwordRef.current?.focus();
            } // if
        } // try
    });
    
    const handlePasswordChange  = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {value}}) => {
        setPassword(value);
    });
    const handlePasswordFocus   = useEvent((): void => {
        setPasswordFocused(true);
    });
    const handlePasswordBlur    = useEvent((): void => {
        setPasswordFocused(false);
    });
    
    const handlePassword2Change = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {value}}) => {
        setPassword2(value);
    });
    const handlePassword2Focus  = useEvent((): void => {
        setPassword2Focused(true);
    });
    const handlePassword2Blur   = useEvent((): void => {
        setPassword2Focused(false);
    });
    
    
    
    // fn props:
    const passwordMinLength            = credentialsConfig.PASSWORD_MIN_LENGTH;
    const passwordMaxLength            = credentialsConfig.PASSWORD_MAX_LENGTH;
    const passwordHasUppercase         = credentialsConfig.PASSWORD_HAS_UPPERCASE;
    const passwordHasLowercase         = credentialsConfig.PASSWORD_HAS_LOWERCASE;
    
    const passwordValidationLength     = (
        (password.length >= passwordMinLength)
        &&
        (password.length <= passwordMaxLength)
    );                                         // min-max characters
    const passwordValidationUppercase  = (
        !passwordHasUppercase
        ||
        !!password.match(/[A-Z]/)
    );                                         // At least one capital letter
    const passwordValidationLowercase  = (
        !passwordHasLowercase
        ||
        !!password.match(/[a-z]/)
    );                                         // At least one non-capital letter
    
    const password2ValidationLength    = (
        (password2.length >= passwordMinLength)
        &&
        (password2.length <= passwordMaxLength)
    );                                         // min-max characters
    const password2ValidationUppercase = (
        !passwordHasUppercase
        ||
        !!password2.match(/[A-Z]/)
    );                                         // At least one capital letter
    const password2ValidationLowercase = (
        !passwordHasLowercase
        ||
        !!password2.match(/[a-z]/)
    );                                         // At least one non-capital letter
    const password2ValidationMatch     = (
        !!password
        &&
        (password2 === password)
    );                                         // Exact match to previous password
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={formResetRef}
            
            
            
            // validations:
            noValidate={true}
            
            
            
            // handlers:
            onSubmit={handlePreventSubmit}
        >
            <ValidationProvider
                // validations:
                enableValidation={enableValidation}
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
                        elmRef={passwordRef}
                        
                        
                        
                        // accessibilities:
                        placeholder='New Password'
                        autoComplete='new-password'
                        
                        
                        
                        // values:
                        value={password}
                        onChange={handlePasswordChange}
                        
                        
                        
                        // validations:
                        isValid={
                            passwordValidationLength
                            &&
                            passwordValidationUppercase
                            &&
                            passwordValidationLowercase
                        }
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
                        elmRef={password2Ref}
                        
                        
                        
                        // accessibilities:
                        placeholder='Confirm New Password'
                        autoComplete='new-password'
                        
                        
                        
                        // values:
                        value={password2}
                        onChange={handlePassword2Change}
                        
                        
                        
                        // validations:
                        isValid={
                            password2ValidationLength
                            &&
                            password2ValidationUppercase
                            &&
                            password2ValidationLowercase
                            &&
                            password2ValidationMatch
                        }
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
                    expanded={passwordFocused && !busy}
                    
                    
                    
                    // floatable:
                    floatingOn={passwordRef}
                    floatingPlacement='bottom'
                >
                    <List
                        // variants:
                        listStyle='flat'
                    >
                        <ListItem
                            // variants:
                            size='sm'
                            theme={passwordValidationLength ? 'success' : 'danger'}
                            outlined={true}
                        >
                            <Icon
                                // appearances:
                                icon={passwordValidationLength ? 'check' : 'error_outline'}
                            />
                            &nbsp;
                            {passwordMinLength}-{passwordMaxLength} characters
                        </ListItem>
                        {!!passwordHasUppercase && <ListItem
                            // variants:
                            size='sm'
                            theme={passwordValidationUppercase ? 'success' : 'danger'}
                            outlined={true}
                        >
                            <Icon
                                // appearances:
                                icon={passwordValidationUppercase ? 'check' : 'error_outline'}
                            />
                            &nbsp;
                            At least one capital letter
                        </ListItem>}
                        {!!passwordHasLowercase && <ListItem
                            // variants:
                            size='sm'
                            theme={passwordValidationLowercase ? 'success' : 'danger'}
                            outlined={true}
                        >
                            <Icon
                                // appearances:
                                icon={passwordValidationLowercase ? 'check' : 'error_outline'}
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
                    expanded={password2Focused && !busy}
                    
                    
                    
                    // floatable:
                    floatingOn={password2Ref}
                    floatingPlacement='bottom'
                >
                    <List
                        // variants:
                        listStyle='flat'
                    >
                        <ListItem
                            // variants:
                            size='sm'
                            theme={password2ValidationLength ? 'success' : 'danger'}
                            outlined={true}
                        >
                            <Icon
                                // appearances:
                                icon={password2ValidationLength ? 'check' : 'error_outline'}
                            />
                            &nbsp;
                            {passwordMinLength}-{passwordMaxLength} characters
                        </ListItem>
                        {!!passwordHasUppercase && <ListItem
                            // variants:
                            size='sm'
                            theme={password2ValidationUppercase ? 'success' : 'danger'}
                            outlined={true}
                        >
                            <Icon
                                // appearances:
                                icon={password2ValidationUppercase ? 'check' : 'error_outline'}
                            />
                            &nbsp;
                            At least one capital letter
                        </ListItem>}
                        {!!passwordHasLowercase && <ListItem
                            // variants:
                            size='sm'
                            theme={password2ValidationLowercase ? 'success' : 'danger'}
                            outlined={true}
                        >
                            <Icon
                                // appearances:
                                icon={password2ValidationLowercase ? 'check' : 'error_outline'}
                            />
                            &nbsp;
                            At least one non-capital letter
                        </ListItem>}
                        <ListItem
                            // variants:
                            size='sm'
                            theme={password2ValidationMatch ? 'success' : 'danger'}
                            outlined={true}
                        >
                            <Icon
                                // appearances:
                                icon={password2ValidationMatch ? 'check' : 'error_outline'}
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
                        onClick   : buttonResetPasswordComponent.props.onClick   ?? handleDoPasswordReset,
                    },
                    
                    
                    
                    // children:
                    buttonResetPasswordComponent.props.children ?? 'Reset Password',
                )}
            </ValidationProvider>
            <ModalStatus
                // variants:
                theme='primary'
                
                
                
                // global stackable:
                viewport={formResetRef}
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
