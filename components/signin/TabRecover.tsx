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
        section,
        setIsBusy,
        
        
        
        // navigations:
        gotoSignIn,
    } = signInState;
    
    
    
    // dialogs:
    const {
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
    } = useDialogMessage();
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [username        , setUsername        ] = useState<string>('');
    
    const isMounted = useMountedFlag();
    
    
    
    // refs:
    const formRecoverRef = useRef<HTMLFormElement|null>(null);
    const usernameRef    = useRef<HTMLInputElement|null>(null);
    
    
    
    // dom effects:
    
    // resets input states when the <TabRecover> is NOT active:
    useEffect(() => {
        // conditions:
        if (section === 'recover') return; // <TabRecover> is active => ignore
        
        
        
        // resets:
        setEnableValidation(false);
        setUsername('');
    }, [section]);
    
    
    
    // handlers:
    const handleRequestRecoverLink = useEvent(async (): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
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
        const invalidFields = formRecoverRef?.current?.querySelectorAll?.(invalidSelector);
        if (invalidFields?.length) { // there is an/some invalid field
            showMessageFieldError(invalidFields);
            return;
        } // if
        
        
        
        // attempts request recover password:
        setIsBusy('recover'); // mark as busy
        try {
            const result = await axios.post('/api/auth/reset', { username });
            if (!isMounted.current) return; // unmounted => abort
            
            
            
            // success
            
            
            
            setIsBusy(false); // unmark as busy
            
            
            
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
            setIsBusy(false); // unmark as busy
            
            
            
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
            ref={formRecoverRef}
            
            
            
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
                {/* <ButtonSendRecoverLink> */}
                {React.cloneElement<ButtonProps>(buttonSendRecoverLinkComponent,
                    // props:
                    {
                        // actions:
                        type      : buttonSendRecoverLinkComponent.props.type      ?? 'submit',
                        
                        
                        
                        // classes:
                        className : buttonSendRecoverLinkComponent.props.className ?? 'sendRecoverLink',
                        
                        
                        
                        // handlers:
                        onClick   : buttonSendRecoverLinkComponent.props.onClick   ?? handleRequestRecoverLink,
                    },
                    
                    
                    
                    // children:
                    buttonSendRecoverLinkComponent.props.children ?? 'Send Reset Password Link',
                )}
            </ValidationProvider>
        </form>
    );
};
