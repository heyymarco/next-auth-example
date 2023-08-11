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
    // states:
    useSignInState,
}                           from './states/signInState'



// react components:
export const ButtonGotoSignIn = () => {
    // states:
    const {
        // navigations:
        gotoSignIn,
    } = useSignInState();
    
    
    
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
