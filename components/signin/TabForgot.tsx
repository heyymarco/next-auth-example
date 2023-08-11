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
    TextInput,
    
    
    
    // composite-components:
    Group,
}                           from '@reusable-ui/components'

// internal components:
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



// react components:
export interface TabForgotProps {
    // components:
    buttonSendResetLinkComponent ?: Required<ButtonComponentProps>['buttonComponent']
}
export const TabForgot = (props: TabForgotProps) => {
    // rest props:
    const {
        // components:
        buttonSendResetLinkComponent = (<ButtonWithBusy busyType='sendResetLink' buttonComponent={<ButtonIcon icon='lock_open' />} /> as React.ReactComponentElement<any, ButtonProps>),
    } = props;
    
    
    
    // states:
    const {
        // states:
        expandedTabIndex,
        
        
        
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
    const [username        , setUsername        ] = useState<string>('');
    
    const isMounted       = useMountedFlag();
    let   [busy, setBusy] = useState<boolean>(false);
    
    
    
    // refs:
    const formForgotRef = useRef<HTMLFormElement|null>(null);
    const usernameRef   = useRef<HTMLInputElement|null>(null);
    
    
    
    // dom effects:
    
    // focus on username field when the <TabForgot> is active:
    useEffect(() => {
        // conditions:
        if (expandedTabIndex !== 1) return; // <TabForgot> is NOT active => ignore
        
        
        
        // actions:
        usernameRef.current?.focus();
    }, [expandedTabIndex]);
    
    // resets input states when the <TabForgot> is NOT active:
    useEffect(() => {
        // conditions:
        if (expandedTabIndex === 1) return; // <TabForgot> is active => ignore
        
        
        
        // resets:
        setEnableValidation(false);
        setUsername('');
    }, [expandedTabIndex]);
    
    
    
    // handlers:
    const handleRequestPasswordReset = useEvent(async (): Promise<void> => {
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
        const invalidFields = formForgotRef?.current?.querySelectorAll?.(invalidSelector);
        if (invalidFields?.length) { // there is an/some invalid field
            showMessageFieldError(invalidFields);
            return;
        } // if
        
        
        
        // attempts request password reset:
        setBusy(busy = true); // mark as busy
        try {
            const result = await axios.post('/api/auth/reset', { username });
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // success
            
            
            
            setBusy(busy = false); // unmark as busy
            
            
            
            // report the success:
            await showMessageSuccess(
                <p>
                    {result.data.message ?? 'A password reset link sent to your email. Please check your inbox in a moment.'}
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
            
            
            
            // report the failure:
            await showMessageFetchError(error);
            
            
            
            // focus to username field:
            usernameRef.current?.setSelectionRange(0, username.length);
            usernameRef.current?.focus();
        } // try
    });
    
    const handleUsernameChange       = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {value}}) => {
        setUsername(value);
    });
    
    
    
    // jsx:
    return (
        <form
            // refs:
            ref={formForgotRef}
            
            
            
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
                    <TextInput
                        // refs:
                        elmRef={usernameRef}
                        
                        
                        
                        // accessibilities:
                        placeholder='Username or Email'
                        autoComplete='username'
                        
                        
                        
                        // values:
                        value={username}
                        onChange={handleUsernameChange}
                        
                        
                        
                        // validations:
                        isValid={username.length >= 1}
                        required={true}
                    />
                </Group>
                {/* <ButtonSendResetLink> */}
                {React.cloneElement<ButtonProps>(buttonSendResetLinkComponent,
                    // props:
                    {
                        // actions:
                        type      : buttonSendResetLinkComponent.props.type      ?? 'submit',
                        
                        
                        
                        // classes:
                        className : buttonSendResetLinkComponent.props.className ?? 'sendResetLink',
                        
                        
                        
                        // handlers:
                        onClick   : buttonSendResetLinkComponent.props.onClick   ?? handleRequestPasswordReset,
                    },
                    
                    
                    
                    // children:
                    buttonSendResetLinkComponent.props.children ?? 'Send Reset Password Link',
                )}
            </ValidationProvider>
        </form>
    );
};
