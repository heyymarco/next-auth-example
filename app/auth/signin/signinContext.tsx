'use client'

// react:
import {
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from 'react'



// contexts:
export interface SigninApi {
    // states:
    expandedTabIndex   : number
    callbackUrl        : string|null
    resetPasswordToken : string|null
    
    
    
    // navigations:
    backSignIn         : () => void
}
const SigninContext = createContext<SigninApi>({
    // states:
    expandedTabIndex   : 0,
    callbackUrl        : null,
    resetPasswordToken : null,
    
    
    
    // navigations:
    backSignIn         : () => {},
});
export interface SigninContextProviderProps {
    // contexts:
    value    : SigninApi
    
    
    
    // children:
    children : React.ReactNode
}
export const SigninContextProvider = (props: SigninContextProviderProps) => {
    return (
        <SigninContext.Provider value={props.value}>
            {props.children}
        </SigninContext.Provider>
    );
}
export const useSigninContext = (): SigninApi => {
    return useContext(SigninContext);
};
