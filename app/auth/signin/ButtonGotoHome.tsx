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
export const ButtonGotoHome = () => {
    // contexts:
    const {
        // navigations:
        gotoHome,
    } = useSigninContext();
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // appearances:
            icon='home'
            
            
            
            // variants:
            buttonStyle='link'
            
            
            
            // handlers:
            onClick={gotoHome}
        >
            Back to Home
        </ButtonIcon>
    );
};
