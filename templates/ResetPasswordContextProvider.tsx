'use client'



// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'



// contexts:
export interface ResetPasswordApi {
    // data:
    url : string
}
export const ResetPasswordContext = createContext<Partial<ResetPasswordApi>>({
});



// react components:
export interface ResetPasswordContextProviderProps {
    // data:
    url : string
}
export const ResetPasswordContextProvider = (props: React.PropsWithChildren<ResetPasswordContextProviderProps>): React.ReactNode => {
    // jsx:
    return (
        <ResetPasswordContext.Provider value={useMemo<Partial<ResetPasswordApi>>(() => ({ url: props.url }), [props.url])}>
            {props.children}
        </ResetPasswordContext.Provider>
    );
};
