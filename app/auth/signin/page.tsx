'use client'

// react:
import {
    // react:
    default as React, useMemo,
}                           from 'react'

// next auth:
import {
    // types:
    type BuiltInProviderType,
}                           from 'next-auth/providers'

// reusable-ui components:
import {
    // simple-components:
    Button,
}                           from '@reusable-ui/components'

// internal components:
import {
    // reusable-ui components:
    SignIn,
}                           from '@/components/signin'



// react components:
const SignInPage = () => {
    const providers = useMemo<BuiltInProviderType[]>(() => [
        'google',
    ], []);
    
    
    
    // jsx:
    return (
        <SignIn
            // auths:
            providers={providers}
            
            
            
            // components:
            buttonComponent={<Button theme='danger' outlined={true} />}
        />
    );
};
export default SignInPage;
