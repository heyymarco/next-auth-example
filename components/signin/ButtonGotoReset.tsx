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
export const ButtonGotoReset = () => {
    // states:
    const {
        // navigations:
        gotoReset,
    } = useSignInState();
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // appearances:
            icon='help_center'
            
            
            
            // variants:
            buttonStyle='link'
            
            
            
            // classes:
            className='reset'
            
            
            
            // handlers:
            onClick={gotoReset}
        >
            Forgot Password?
        </ButtonIcon>
    );
};
