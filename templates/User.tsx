// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useContext,
}                           from 'react'
import {
    // contexts:
    UserContext,
}                           from './UserContextProvider'



// hooks:
const useUserContext = () => {
    return useContext(UserContext);
};



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
