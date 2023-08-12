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

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    
    
    
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
    getAuthErrorDescription,
}                           from '../utilities'
import {
    // hooks:
    useFieldState,
}                           from '../hooks'

// configs:
import {
    default as credentialsConfig,
}                           from '@/credentials.config'



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
    // states:
    section                 : SignInSection
    isBusy                  : BusyState
    setIsBusy               : (isBusy: BusyState) => void
    
    
    
    // fields & validations:
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
    
    
    
    // data:
    callbackUrl             : string|null
    resetPasswordToken      : string|null
    
    
    
    // navigations:
    gotoHome                : () => void
    gotoSignIn              : () => void
    gotoRecover             : () => void
}
const SignInStateContext = createContext<SignInState>({
    // states:
    section                 : 'signIn',
    isBusy                  : false,
    setIsBusy               : () => {},
    
    
    
    // fields & validations:
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
    
    
    
    // data:
    callbackUrl             : null,
    resetPasswordToken      : null,
    
    
    
    // navigations:
    gotoHome                : () => {},
    gotoSignIn              : () => {},
    gotoRecover             : () => {},
});
export interface SignInStateProps {
    /* empty */
}
export const SignInStateProvider = (props: React.PropsWithChildren<SignInStateProps>) => {
    // navigations:
    const router       = useRouter();
    const pathName     = usePathname() ?? '/'
    const searchParams = useSearchParams();
    
    
    
    // states:
    const callbackUrlRef               = useRef<string|null>(searchParams?.get('callbackUrl'       ) || null);
    const resetPasswordTokenRef        = useRef<string|null>(searchParams?.get('resetPasswordToken') || null);
    const [section, setSection       ] = useState<SignInSection>(!!resetPasswordTokenRef.current ? 'reset' : 'signIn');
    const [isBusy , setIsBusyInternal] = useState<BusyState>(false);
    
    
    
    // fields:
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
    
    const password2ValidLength     = !isUpdating ? (password2.length >= 1) : ((password2.length >= passwordMinLength) && (password2.length <= passwordMaxLength));
    const password2ValidUppercase  = !isUpdating ? true                    : (!passwordHasUppercase || !!password2.match(/[A-Z]/));
    const password2ValidLowercase  = !isUpdating ? true                    : (!passwordHasLowercase || !!password2.match(/[a-z]/));
    const password2ValidMatch      = !isUpdating ? true                    : (!!password && (password2 === password));
    const password2Valid           = password2ValidLength && password2ValidUppercase && password2ValidLowercase;
    
    
    
    // dialogs:
    const {
        showMessageError,
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
    const setIsBusy  = useEvent((isBusy: BusyState) => {
        signInState.isBusy = isBusy; /* instant update without waiting for (slow|delayed) re-render */
        setIsBusyInternal(isBusy);
    });
    
    const gotoHome    = useEvent(() => {
        router.push('/');
    });
    const gotoSignIn  = useEvent(() => {
        setSection('signIn');
    });
    const gotoRecover = useEvent(() => {
        setSection('recover');
    });
    
    
    
    // apis:
    const signInState = useMemo<SignInState>(() => ({
        // states:
        section            : section,
        isBusy             : isBusy,
        setIsBusy          : setIsBusy, // stable ref
        
        
        
        // fields & validations:
        username,
        usernameChange,
        usernameValid,
        
        password,
        passwordChange,
        passwordValid,
        passwordValidLength,
        passwordValidUppercase,
        passwordValidLowercase,
        
        password2,
        password2Change,
        password2Valid,
        password2ValidLength,
        password2ValidUppercase,
        password2ValidLowercase,
        password2ValidMatch,
        
        
        
        // data:
        callbackUrl        : callbackUrlRef.current,        // stable ref
        resetPasswordToken : resetPasswordTokenRef.current, // stable ref
        
        
        
        // navigations:
        gotoHome,    // stable ref
        gotoSignIn,  // stable ref
        gotoRecover, // stable ref
    }), [
        // states:
        section,
        isBusy,
    ]);
    
    
    
    // jsx:
    return (
        <SignInStateContext.Provider value={signInState}>
            <ValidationProvider
                // validations:
                enableValidation={enableValidation}
            >
                {props.children}
            </ValidationProvider>
        </SignInStateContext.Provider>
    );
}
export const useSignInState = (): SignInState => {
    return useContext(SignInStateContext);
};
