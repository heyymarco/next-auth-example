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
export const ButtonGotoReset = () => {
    // contexts:
    const {
        // navigations:
        gotoReset,
    } = useSigninContext();
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // appearances:
            icon='help_center'
            
            
            
            // variants:
            buttonStyle='link'
            
            
            
            // handlers:
            onClick={gotoReset}
        >
            Forgot Password?
        </ButtonIcon>
    );
};
