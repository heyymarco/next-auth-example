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
}                           from './utilities'



// contexts:
export interface SigninApi {
    // states:
    expandedTabIndex   : number
    callbackUrl        : string|null
    resetPasswordToken : string|null
    
    
    
    // navigations:
    gotoHome           : () => void
    gotoSignIn         : () => void
    gotoReset          : () => void
}
const SigninContext = createContext<SigninApi>({
    // states:
    expandedTabIndex   : 0,
    callbackUrl        : null,
    resetPasswordToken : null,
    
    
    
    // navigations:
    gotoHome           : () => {},
    gotoSignIn         : () => {},
    gotoReset          : () => {},
});
export interface SigninContextProviderProps {
    // children:
    children  : React.ReactNode
}
export const SigninContextProvider = (props: SigninContextProviderProps) => {
    // navigations:
    const router       = useRouter();
    const pathName     = usePathname() ?? '/'
    const searchParams = useSearchParams();
    
    
    
    // states:
    const callbackUrlRef                          = useRef<string|null>(searchParams?.get('callbackUrl'       ) || null);
    const resetPasswordTokenRef                   = useRef<string|null>(searchParams?.get('resetPasswordToken') || null);
    const [expandedTabIndex, setExpandedTabIndex] = useState<number>(!!resetPasswordTokenRef.current ? 2 : 0);
    
    
    
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
    const gotoHome   = useEvent(() => {
        router.push('/');
    });
    const gotoSignIn = useEvent(() => {
        setExpandedTabIndex(0);
    });
    const gotoReset  = useEvent(() => {
        setExpandedTabIndex(1);
    });
    
    
    
    // apis:
    const signinApi = useMemo<SigninApi>(() => ({
        // states:
        expandedTabIndex   : expandedTabIndex,
        callbackUrl        : callbackUrlRef.current,        // stable ref
        resetPasswordToken : resetPasswordTokenRef.current, // stable ref
        
        
        
        // navigations:
        gotoHome,   // stable ref
        gotoSignIn, // stable ref
        gotoReset,  // stable ref
    }), [
        // states:
        expandedTabIndex,
    ]);
    
    
    
    // jsx:
    return (
        <SigninContext.Provider value={signinApi}>
            {props.children}
        </SigninContext.Provider>
    );
}
export const useSigninContext = (): SigninApi => {
    return useContext(SigninContext);
};
