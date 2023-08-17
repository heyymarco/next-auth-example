// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createServerContext,
    
    
    
    // hooks:
    useContext,
}                           from 'react'

// models:
import type {
    User,
}                           from '@prisma/client'



// contexts:
const UserContext = createServerContext<Partial<Omit<User, 'createdAt'|'updatedAt'|'emailVerified'>>>('UserContext', {
});



// hooks:
export const useUserContext = () => {
    return useContext(UserContext);
};



// react components:
export interface UserContextProviderProps {
    // models:
    model : Partial<User>
}
export const UserContextProvider = (props: React.PropsWithChildren<UserContextProviderProps>): React.ReactNode => {
    // jsx:
    return (
        <UserContext.Provider value={props.model}>
            {props.children}
        </UserContext.Provider>
    );
};
