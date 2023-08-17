// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createServerContext,
    
    
    
    // hooks:
    useContext,
}                           from 'react'



// contexts:
export interface ResetPasswordApi {
    // data:
    url : string
}
const ResetPasswordContext = createServerContext<Partial<ResetPasswordApi>>('ResetPasswordContext', {
});



// hooks:
export const useResetPasswordContext = () => {
    return useContext(ResetPasswordContext);
};



// react components:
export interface ResetPasswordContextProviderProps {
    // data:
    url : string
}
export const ResetPasswordContextProvider = (props: React.PropsWithChildren<ResetPasswordContextProviderProps>): React.ReactNode => {
    // jsx:
    return (
        <ResetPasswordContext.Provider value={{ url: props.url }}>
            {props.children}
        </ResetPasswordContext.Provider>
    );
};
