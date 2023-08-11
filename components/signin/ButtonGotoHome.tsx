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
export const ButtonGotoHome = () => {
    // states:
    const {
        // navigations:
        gotoHome,
    } = useSignInState();
    
    
    
    // jsx:
    return (
        <ButtonIcon
            // appearances:
            icon='home'
            
            
            
            // variants:
            buttonStyle='link'
            
            
            
            // classes:
            className='home'
            
            
            
            // handlers:
            onClick={gotoHome}
        >
            Back to Home
        </ButtonIcon>
    );
};
