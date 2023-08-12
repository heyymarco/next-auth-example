'use client'

// react:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useRef,
    useState,
    useEffect,
    useMemo,
}                           from 'react'

// next:
import {
    // navigations:
    useRouter,
    usePathname,
    useSearchParams,
}                           from 'next/navigation'

// next auth:
import {
    // types:
    type BuiltInProviderType,
}                           from 'next-auth/providers'
import {
    // apis:
    signIn,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'

// internal components:
import {
    // dialogs:
    useDialogMessage,
}                           from '@/hooks/dialogMessage'

// internals:
import {
    // utilities:
    invalidSelector,
    getAuthErrorDescription,
    resolveProviderName as defaultResolveProviderName,
}                           from '../utilities'
import {
    // hooks:
    useFieldState,
}                           from '../hooks'

// configs:
import {
    default as credentialsConfig,
}                           from '@/credentials.config'

// other libs:
import axios                from 'axios'



// contexts:
export type SignInSection =
    | 'signIn'
    | 'recover'
    | 'reset'
export type BusyState =
    | false               // idle
    | BuiltInProviderType // busy: login with ...
    | 'recover'           // busy: recover
    | 'reset'             // busy: reset
export interface SignInState {
    // data:
    callbackUrl             : string|null
    resetPasswordToken      : string|null
    
    
    
    // states:
    section                 : SignInSection
    isBusy                  : BusyState
    setIsBusy               : (isBusy: BusyState) => void
    
    
    
    // fields & validations:
    formRef                 : React.MutableRefObject<HTMLFormElement|null>
    
    usernameRef             : React.MutableRefObject<HTMLInputElement|null>
    username                : string
    usernameChange          : React.ChangeEventHandler<HTMLInputElement>
    usernameValid           : boolean
    
    password                : string
    passwordChange          : React.ChangeEventHandler<HTMLInputElement>
    passwordValid           : boolean
    passwordValidLength     : boolean
    passwordValidUppercase  : boolean
    passwordValidLowercase  : boolean
    
    password2               : string
    password2Change         : React.ChangeEventHandler<HTMLInputElement>
    password2Valid          : boolean
    password2ValidLength    : boolean
    password2ValidUppercase : boolean
    password2ValidLowercase : boolean
    password2ValidMatch     : boolean
    
    
    
    // navigations:
    gotoHome                : () => void
    gotoSignIn              : () => void
    gotoRecover             : () => void
    
    
    
    // actions:
    doSignIn                : () => Promise<void>
    doSignInWith            : (providerType: BuiltInProviderType) => Promise<void>
    doRecover               : () => Promise<void>
    
    
    
    // utilities:
    resolveProviderName     : (oAuthProvider: BuiltInProviderType) => string
}
const SignInStateContext = createContext<SignInState>({
    // data:
    callbackUrl             : null,
    resetPasswordToken      : null,
    
    
    
    // states:
    section                 : 'signIn',
    isBusy                  : false,
    setIsBusy               : () => {},
    
    
    
    // fields & validations:
    formRef                 : { current: null },
    
    usernameRef             : { current: null },
    username                : '',
    usernameChange          : () => {},
    usernameValid           : false,
    
    password                : '',
    passwordChange          : () => {},
    passwordValid           : false,
    passwordValidLength     : false,
    passwordValidUppercase  : false,
    passwordValidLowercase  : false,
    
    password2               : '',
    password2Change         : () => {},
    password2Valid          : false,
    password2ValidLength    : false,
    password2ValidUppercase : false,
    password2ValidLowercase : false,
    password2ValidMatch     : false,
    
    
    
    // navigations:
    gotoHome                : () => {},
    gotoSignIn              : () => {},
    gotoRecover             : () => {},
    
    
    
    // actions:
    doSignIn                : async () => {},
    doSignInWith            : async () => {},
    doRecover               : async () => {},
    
    
    
    // utilities:
    resolveProviderName     : () => '',
});
export interface SignInStateProps {
    // auths:
    resolveProviderName ?: (oAuthProvider: BuiltInProviderType) => string
}
export const SignInStateProvider = (props: React.PropsWithChildren<SignInStateProps>) => {
    // rest props:
    const {
        // auths:
        resolveProviderName = defaultResolveProviderName,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // navigations:
    const router       = useRouter();
    const pathName     = usePathname() ?? '/'
    const searchParams = useSearchParams();
    
    
    
    // data:
    const callbackUrlRef               = useRef<string|null>(searchParams?.get('callbackUrl'       ) || null);
    const callbackUrl                  = callbackUrlRef.current;
    const resetPasswordTokenRef        = useRef<string|null>(searchParams?.get('resetPasswordToken') || null);
    const resetPasswordToken           = resetPasswordTokenRef.current;
    
    
    
    // states:
    const [section, setSection       ] = useState<SignInSection>(!!resetPasswordTokenRef.current ? 'reset' : 'signIn');
    const [isBusy , setIsBusyInternal] = useState<BusyState>(false);
    const isMounted                    = useMountedFlag();
    
    
    
    // fields:
    const formRef     = useRef<HTMLFormElement|null>(null);
    const usernameRef = useRef<HTMLInputElement|null>(null);
    
    const [enableValidation, setEnableValidation          ] = useState<boolean>(false);
    const [username        , setUsername , usernameChange ] = useFieldState();
    const [password        , setPassword , passwordChange ] = useFieldState();
    const [password2       , setPassword2, password2Change] = useFieldState();
    
    
    
    // validations:
    const passwordMinLength       = credentialsConfig.PASSWORD_MIN_LENGTH;
    const passwordMaxLength       = credentialsConfig.PASSWORD_MAX_LENGTH;
    const passwordHasUppercase    = credentialsConfig.PASSWORD_HAS_UPPERCASE;
    const passwordHasLowercase    = credentialsConfig.PASSWORD_HAS_LOWERCASE;
    const isUpdating              = (section === 'reset');
    
    const usernameValid           = (username.length >= 1);
    
    const passwordValidLength     = !isUpdating ? (password.length >= 1)   : ((password.length >= passwordMinLength) && (password.length <= passwordMaxLength));
    const passwordValidUppercase  = !isUpdating ? true                     : (!passwordHasUppercase || !!password.match(/[A-Z]/));
    const passwordValidLowercase  = !isUpdating ? true                     : (!passwordHasLowercase || !!password.match(/[a-z]/));
    const passwordValid           = passwordValidLength && passwordValidUppercase && passwordValidLowercase;
    
    const password2ValidLength    = !isUpdating ? (password2.length >= 1) : ((password2.length >= passwordMinLength) && (password2.length <= passwordMaxLength));
    const password2ValidUppercase = !isUpdating ? true                    : (!passwordHasUppercase || !!password2.match(/[A-Z]/));
    const password2ValidLowercase = !isUpdating ? true                    : (!passwordHasLowercase || !!password2.match(/[a-z]/));
    const password2ValidMatch     = !isUpdating ? true                    : (!!password && (password2 === password));
    const password2Valid          = password2ValidLength && password2ValidUppercase && password2ValidLowercase;
    
    
    
    // dialogs:
    const {
        showMessageError,
        showMessageFieldError,
        showMessageFetchError,
        showMessageSuccess,
        showMessageNotification,
    } = useDialogMessage();
    
    
    
    // dom effects:
    
    // displays an error passed by `next-auth`:
    useEffect(() => {
        // conditions:
        const error = searchParams?.get('error');
        if (!error) return; // no error passed => ignore
        
        
        
        // report the failure:
        showMessageError(getAuthErrorDescription(error));
    }, []);
    
    // remove passed queryString(s):
    useEffect(() => {
        // conditions:
        if (
            !searchParams?.get('error')
            &&
            !searchParams?.get('callbackUrl')
            &&
            !searchParams?.get('resetPasswordToken')
        ) return; // no queryString(s) passed => nothing to remove => ignore
        
        
        
        try {
            // get current browser's queryString:
            const newSearchParams = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
            
            // remove `?error=***` on browser's url:
            newSearchParams.delete('error');
            
            // remove `?callbackUrl=***` on browser's url:
            newSearchParams.delete('callbackUrl');
            
            // remove `?resetPasswordToken=***` on browser's url:
            newSearchParams.delete('resetPasswordToken');
            
            // update browser's url:
            router.replace(`${pathName}${!!newSearchParams.size ? `?${newSearchParams}` : ''}`, { scroll: false });
        }
        catch {
            // ignore any error
        } // if
    }, []);
    
    // focus on username field when the section is 'signIn' or 'recover':
    useEffect(() => {
        // conditions:
        if (section === 'reset') return; // other than 'signIn' or 'recover' => ignore
        
        
        
        // actions:
        usernameRef.current?.focus();
    }, [section]);
    
    // resets input states when the `section` changes:
    const prevSection = useRef<SignInSection>(section);
    useEffect(() => {
        // conditions:
        if (prevSection.current === section) return; // no change => ignore
        prevSection.current = section; // sync
        
        
        
        // reset fields & validations:
        setEnableValidation(false);
        setUsername('');
        setPassword('');
        setPassword2('');
    }, [section]);
    
    
    
    // stable callbacks:
    const setIsBusy    = useEvent((isBusy: BusyState) => {
        signInState.isBusy = isBusy; /* instant update without waiting for (slow|delayed) re-render */
        setIsBusyInternal(isBusy);
    });
    
    const gotoHome     = useEvent(() => {
        router.push('/');
    });
    const gotoSignIn   = useEvent(() => {
        setSection('signIn');
    });
    const gotoRecover  = useEvent(() => {
        setSection('recover');
    });
    
    const doSignIn     = useEvent(async (): Promise<void> => {
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
        const invalidFields = formRef?.current?.querySelectorAll?.(invalidSelector);
        if (invalidFields?.length) { // there is an/some invalid field
            showMessageFieldError(invalidFields);
            return;
        } // if
        
        
        
        // attempts sign in using credentials:
        setIsBusy('credentials'); // mark as busy
        const result = await signIn('credentials', { username, password, redirect: false });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // verify the sign in status:
        if (!result?.ok) { // error
            setIsBusy(false); // unmark as busy
            
            
            
            // resets:
            setEnableValidation(false);
            setPassword('');
            
            
            
            // report the failure:
            await showMessageError(getAuthErrorDescription(result?.error ?? 'CredentialsSignin'));
            
            
            
            // focus to username field:
            usernameRef.current?.setSelectionRange(0, username.length);
            usernameRef.current?.focus();
        }
        else { // success
            // resets:
            setUsername('');
            setPassword('');
            
            
            
            // redirect to origin page:
            if (callbackUrl) router.replace(callbackUrl);
        } // if
    });
    const doSignInWith = useEvent(async (providerType: BuiltInProviderType): Promise<void> => {
        // conditions:
        if (signInState.isBusy) return; // ignore when busy /* instant update without waiting for (slow|delayed) re-render */
        
        
        
        // attempts sign in using OAuth:
        setIsBusy(providerType); // mark as busy
        const result = await signIn(providerType, { callbackUrl: callbackUrl ?? undefined });
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // verify the sign in status:
        if ((result !== undefined) && !result?.ok) { // error
            setIsBusy(false); // unmark as busy
            
            
            
            // report the failure:
            showMessageError(getAuthErrorDescription(result?.error ?? 'OAuthSignin'));
        }
        else { // success
            // report the success:
            showMessageNotification(
                <p>You are being redirected to <strong>{resolveProviderName(providerType)} sign in page</strong>. Please wait...</p>
            );
        } // if
    });
    const doRecover    = useEvent(async(): Promise<void> => {
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
        const invalidFields = formRef?.current?.querySelectorAll?.(invalidSelector);
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
    
    
    
    // apis:
    const signInState = useMemo<SignInState>(() => ({
        // data:
        callbackUrl,
        resetPasswordToken,
        
        
        
        // states:
        section,
        isBusy,
        setIsBusy,           // stable ref
        
        
        
        // fields & validations:
        formRef,             // stable ref
        
        usernameRef,         // stable ref
        username,
        usernameChange,      // stable ref
        usernameValid,
        
        password,
        passwordChange,      // stable ref
        passwordValid,
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        
        password2,
        password2Change,     // stable ref
        password2Valid,
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
        
        
        
        // navigations:
        gotoHome,            // stable ref
        gotoSignIn,          // stable ref
        gotoRecover,         // stable ref
        
        
        
        // actions:
        doSignIn,            // stable ref
        doSignInWith,        // stable ref
        doRecover,           // stable ref
        
        
        
        // utilities:
        resolveProviderName, // stable ref
    }), [
        // states:
        section,
        isBusy,
        
        
        
        // fields & validations:
        username,
        usernameValid,
        
        password,
        passwordValid,
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        
        password2,
        password2Valid,
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
        
        
        
        // data:
        callbackUrl,
        resetPasswordToken,
    ]);
    
    
    
    // jsx:
    return (
        <SignInStateContext.Provider value={signInState}>
            <ValidationProvider
                // validations:
                enableValidation={enableValidation}
            >
                {children}
            </ValidationProvider>
        </SignInStateContext.Provider>
    );
}
export const useSignInState = (): SignInState => {
    return useContext(SignInStateContext);
};
