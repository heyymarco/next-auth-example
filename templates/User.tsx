// react:
import {
    // react:
    default as React,
}                           from 'react'
import {
    // hooks:
    useUserContext,
}                           from './UserContextProvider'



const UserName = (): React.ReactNode => {
    // contexts:
    const model = useUserContext();
    
    
    
    // jsx:
    return (
        model.name ?? null
    );
};
const UserEmail = (): React.ReactNode => {
    // contexts:
    const model = useUserContext();
    
    
    
    // jsx:
    return (
        model.email ?? null
    );
};

export const User = {
    Name  : UserName,
    Email : UserEmail,
};
