// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
    
    ButtonIconProps,
}                           from '@reusable-ui/components'

// internals:
import {
    // states:
    useSignInState,
}                           from './states/signInState'



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
    // appearances:
    iconBusy ?: ButtonIconProps['icon']
}
const ButtonWithBusy = (props: ButtonWithBusyProps): JSX.Element|null => {
    // states:
    const {
        // states:
        isBusy,
    } = useSignInState();
    
    
    
    // rest props:
    const {
        // appearances:
        iconBusy = 'busy',
        
        
        
        // components:
        buttonComponent,
    ...restButtonIconProps} = props;
    
    
    
    
    // fn props:
    const icon = (buttonComponent?.props as ButtonIconProps|undefined)?.icon
    
    
    
    // jsx:
    /* <Button> or <ButtonIcon> */
    return React.cloneElement<ButtonIconProps>(buttonComponent,
        // props:
        {
            // other props:
            ...restButtonIconProps,
            ...buttonComponent.props, // overwrites restButtonIconProps (if any conflics)
            
            
            
            // appearances:
            icon : !icon ? undefined : (isBusy ? iconBusy : icon),
        },
    );
};
export {
    ButtonWithBusy,
    ButtonWithBusy as default,
};
