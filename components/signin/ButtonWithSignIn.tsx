// react:
import {
    // react:
    default as React,
}                           from 'react'

// next auth:
import {
    // types:
    type BuiltInProviderType,
}                           from 'next-auth/providers'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'

// reusable-ui components:
import {
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
}                           from '@reusable-ui/components'



// react components:
export interface ButtonWithBusyProps
    extends
        // bases:
        ButtonProps,
        
        // components:
        Required<Pick<ButtonComponentProps,
            'buttonComponent' // a required underlying <Button>
        >>
{
    // auths:
    providerType : BuiltInProviderType
    
    
    
    // handlers:
    onSignInWith : (providerType: BuiltInProviderType) => void
}
const ButtonWithSignIn = (props: ButtonWithBusyProps): JSX.Element|null => {
    // rest props:
    const {
        // auths:
        providerType,
        
        
        
        // components:
        buttonComponent,
        
        
        
        // handlers:
        onSignInWith,
    ...restButtonProps} = props;
    
    
    
    // handlers:
    const handleClick = useEvent(() => {
        onSignInWith(providerType);
    });
    
    
    
    // jsx:
    /* <Button> */
    return React.cloneElement<ButtonProps>(buttonComponent,
        // props:
        {
            // other props:
            ...restButtonProps,
            ...buttonComponent.props, // overwrites restButtonProps (if any conflics)
            
            
            
            // handlers:
            onClick : buttonComponent.props.onClick ?? handleClick,
        },
    );
};
export {
    ButtonWithSignIn,
    ButtonWithSignIn as default,
};
