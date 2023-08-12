'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // an accessibility management system:
    AccessibilityProvider,
}                           from '@reusable-ui/core'

// reusable-ui components:
import {
    // base-content-components:
    ContentProps,
    Content,
    
    
    
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
    
    
    
    // composite-components:
    TabPanel,
    Tab,
}                           from '@reusable-ui/components'

// internal components:
import {
    // reusable-ui components:
    TabSignInProps,
    TabSignIn,
}                           from './TabSignIn'
import {
    // reusable-ui components:
    TabRecoverProps,
    TabRecover,
}                           from './TabRecover'
import {
    // reusable-ui components:
    TabResetProps,
    TabReset,
}                           from './TabReset'

// internals:
import {
    SignInState,
    SignInStateProvider,
    useSignInState,
}                           from './states/signInState'



// styles:
export const useSignInStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'mhxnjino7v' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './styles/styles'



// react components:
export type SignInChildrenWithState = (signInState: SignInState) => React.ReactNode
export interface SignInProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<ContentProps<TElement>,
            // children:
            |'children' // not supported
        >,
        TabSignInProps,
        TabRecoverProps,
        TabResetProps
{
    // components:
    buttonGotoHomeComponent    ?: Required<ButtonComponentProps>['buttonComponent']
    buttonGotoSignInComponent  ?: Required<ButtonComponentProps>['buttonComponent']
    buttonGotoRecoverComponent ?: Required<ButtonComponentProps>['buttonComponent']
}
const SignIn         = <TElement extends Element = HTMLElement>(props: SignInProps<TElement>) => {
    return (
        <SignInStateProvider>
            <SignInInternal {...props} />
        </SignInStateProvider>
    );
};
const SignInInternal = <TElement extends Element = HTMLElement>(props: SignInProps<TElement>) => {
    // styles:
    const styleSheet = useSignInStyleSheet();
    
    
    
    // rest props:
    const {
        // auths:
        providers,
        
        
        
        // components:
        buttonGotoHomeComponent    = (<ButtonIcon icon='home'        buttonStyle='link' /> as React.ReactComponentElement<any, ButtonProps>),
        buttonGotoSignInComponent  = (<ButtonIcon icon='arrow_back'  buttonStyle='link' /> as React.ReactComponentElement<any, ButtonProps>),
        buttonGotoRecoverComponent = (<ButtonIcon icon='help_center' buttonStyle='link' /> as React.ReactComponentElement<any, ButtonProps>),
        
        buttonSignInComponent,
        buttonSignInWithComponent,
        
        buttonSendRecoverLinkComponent,
        
        buttonResetPasswordComponent,
    ...restContentProps} = props;
    // type T1 = typeof restContentProps
    // type T2 = Omit<T1, keyof ContentProps>
    
    
    
    // states:
    const {
        // states:
        section,
        isBusy,
        
        
        
        // navigations:
        gotoHome,
        gotoSignIn,
        gotoRecover,
    } = useSignInState();
    
    
    
    // jsx:
    const ButtonGotoHome    = () => React.cloneElement<ButtonProps>(buttonGotoHomeComponent,
        // props:
        {
            // classes:
            className : buttonGotoHomeComponent.props.className ?? 'gotoHome',
            
            
            
            // handlers:
            onClick   : buttonGotoHomeComponent.props.onClick   ?? gotoHome,
        },
        
        
        
        // children:
        buttonGotoHomeComponent.props.children ?? 'Back to Home',
    );
    const ButtonGotoSignIn  = () => React.cloneElement<ButtonProps>(buttonGotoSignInComponent,
        // props:
        {
            // classes:
            className : buttonGotoSignInComponent.props.className ?? 'gotoSignIn',
            
            
            
            // handlers:
            onClick   : buttonGotoSignInComponent.props.onClick   ?? gotoSignIn,
        },
        
        
        
        // children:
        buttonGotoSignInComponent.props.children ?? 'Back to Sign In',
    );
    const ButtonGotoRecover = () => React.cloneElement<ButtonProps>(buttonGotoRecoverComponent,
        // props:
        {
            // classes:
            className : buttonGotoRecoverComponent.props.className ?? 'gotoRecover',
            
            
            
            // handlers:
            onClick   : buttonGotoRecoverComponent.props.onClick   ?? gotoRecover,
        },
        
        
        
        // children:
        buttonGotoRecoverComponent.props.children ?? 'Forgot Password?',
    );
    return (
        <AccessibilityProvider
            // accessibilities:
            enabled={!isBusy} // disabled if busy
        >
            <Tab
                // identifiers:
                id='tabSignIn'
                
                
                
                // states:
                expandedTabIndex={
                    (section === 'recover')
                    ? 1
                    :   (section === 'reset')
                        ? 2
                        : 0
                }
                
                
                
                // components:
                headerComponent={null}
                bodyComponent={
                    <Content
                        // other props:
                        {...restContentProps}
                        
                        
                        
                        // variants:
                        mild={props.mild ?? true}
                        
                        
                        
                        // classes:
                        mainClass={props.mainClass ?? styleSheet.main}
                    />
                }
            >
                <TabPanel className='signIn'>
                    <TabSignIn
                        // auths:
                        providers={providers}
                        
                        
                        
                        // components:
                        buttonSignInComponent={buttonSignInComponent}
                        buttonSignInWithComponent={buttonSignInWithComponent}
                    />
                    <ButtonGotoHome />
                    <ButtonGotoRecover />
                </TabPanel>
                <TabPanel className='recover'>
                    <TabRecover
                        // components:
                        buttonSendRecoverLinkComponent={buttonSendRecoverLinkComponent}
                    />
                    <ButtonGotoSignIn />
                </TabPanel>
                <TabPanel className='reset'>
                    <TabReset
                        // components:
                        buttonResetPasswordComponent={buttonResetPasswordComponent}
                    />
                    <ButtonGotoSignIn />
                </TabPanel>
            </Tab>
        </AccessibilityProvider>
    );
};
export {
    SignIn,
    SignIn as default,
};
