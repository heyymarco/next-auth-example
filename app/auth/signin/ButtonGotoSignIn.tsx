'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
}                           from '@reusable-ui/components'

// internals:
import {
    useSigninContext,
}                           from './signinContext'



// react components:
export const ButtonGotoSignIn = () => {
    // contexts:
    const {
        // navigations:
        gotoSignIn,
    } = useSigninContext();
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // appearances:
            icon='arrow_back'
            
            
            
            // variants:
            buttonStyle='link'
            
            
            
            // handlers:
            onClick={gotoSignIn}
        >
            Back to Sign In Page
        </ButtonIcon>
    );
};
