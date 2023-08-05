// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useContext,
}                           from 'react'
import {
    // contexts:
    ResetPasswordContext,
}                           from './ResetPasswordContextProvider'



// hooks:
const useResetPasswordContext = () => {
    return useContext(ResetPasswordContext);
};



const ResetPasswordUrl = (): React.ReactNode => {
    // contexts:
    const model = useResetPasswordContext();
    
    
    
    // jsx:
    return (
        model.url ?? null
    );
};

export interface ResetPasswordLinkProps {
    // children:
    children ?: React.ReactNode
}
const ResetPasswordLink = (props: ResetPasswordLinkProps): React.ReactNode => {
    // contexts:
    const model = useResetPasswordContext();
    
    
    
    // jsx:
    return (
        <a href={model.url}>
            {props.children ?? 'Reset Password'}
        </a>
    );
};

export const ResetPassword = {
    Url  : ResetPasswordUrl,
    Link : ResetPasswordLink,
};
