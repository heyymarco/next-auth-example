'use client'



// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
}                           from 'react'

// models:
import type {
    User,
}                           from '@prisma/client'



// contexts:
export const UserContext = createContext<Partial<User>>({
});



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
