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
    section            : SignInSection
    isBusy             : BusyState
    setIsBusy          : (isBusy: BusyState) => void
    
    
    
    // data:
    callbackUrl        : string|null
    resetPasswordToken : string|null
    
    
    
    // navigations:
    gotoHome           : () => void
    gotoSignIn         : () => void
    gotoRecover        : () => void
}
const SignInStateContext = createContext<SignInState>({
    // states:
    section            : 'signIn',
    isBusy             : false,
    setIsBusy          : () => {},
    
    
    
    // data:
    callbackUrl        : null,
    resetPasswordToken : null,
    
    
    
    // navigations:
    gotoHome           : () => {},
    gotoSignIn         : () => {},
    gotoRecover        : () => {},
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
            {props.children}
        </SignInStateContext.Provider>
    );
}
export const useSignInState = (): SignInState => {
    return useContext(SignInStateContext);
};
