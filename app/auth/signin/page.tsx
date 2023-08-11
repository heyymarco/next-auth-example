'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    // reusable-ui components:
    SignIn,
}                           from '@/components/signin'
import { Button } from '@reusable-ui/components'



// react components:
const SignInPage = () => {
    return (
        <SignIn buttonComponent={<Button theme='danger' outlined={true} />} />
    );
};
export default SignInPage;
