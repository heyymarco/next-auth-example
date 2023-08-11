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
    TabForgotProps,
    TabForgot,
}                           from './TabForgot'
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
        TabForgotProps,
        TabResetProps
{
    // components:
    buttonGotoHome   ?: Required<ButtonComponentProps>['buttonComponent']
    buttonGotoSignIn ?: Required<ButtonComponentProps>['buttonComponent']
    buttonGotoReset  ?: Required<ButtonComponentProps>['buttonComponent']
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
        resolveProviderName,
        
        
        
        // components:
        buttonGotoHome   = (<ButtonIcon icon='home'        buttonStyle='link' /> as React.ReactComponentElement<any, ButtonProps>),
        buttonGotoSignIn = (<ButtonIcon icon='arrow_back'  buttonStyle='link' /> as React.ReactComponentElement<any, ButtonProps>),
        buttonGotoReset  = (<ButtonIcon icon='help_center' buttonStyle='link' /> as React.ReactComponentElement<any, ButtonProps>),
        
        buttonSignInComponent,
        buttonSignInWithComponent,
        
        buttonSendResetLinkComponent,
        
        buttonResetPasswordComponent,
    ...restContentProps} = props;
    // type T1 = typeof restContentProps
    // type T2 = Omit<T1, keyof ContentProps>
    
    
    
    // states:
    const {
        // states:
        expandedTabIndex,
        isBusy,
        
        
        
        // navigations:
        gotoHome,
        gotoSignIn,
        gotoReset,
    } = useSignInState();
    
    
    
    // jsx:
    const ButtonGotoHome   = () => React.cloneElement<ButtonProps>(buttonGotoHome,
        // props:
        {
            // classes:
            className : buttonGotoHome.props.className ?? 'gotoHome',
            
            
            
            // handlers:
            onClick   : buttonGotoHome.props.onClick   ?? gotoHome,
        },
        
        
        
        // children:
        buttonGotoHome.props.children ?? 'Back to Home',
    );
    const ButtonGotoSignIn = () => React.cloneElement<ButtonProps>(buttonGotoSignIn,
        // props:
        {
            // classes:
            className : buttonGotoSignIn.props.className ?? 'gotoSignIn',
            
            
            
            // handlers:
            onClick   : buttonGotoSignIn.props.onClick   ?? gotoSignIn,
        },
        
        
        
        // children:
        buttonGotoSignIn.props.children ?? 'Back to Sign In',
    );
    const ButtonGotoReset  = () => React.cloneElement<ButtonProps>(buttonGotoReset,
        // props:
        {
            // classes:
            className : buttonGotoReset.props.className ?? 'gotoReset',
            
            
            
            // handlers:
            onClick   : buttonGotoReset.props.onClick   ?? gotoReset,
        },
        
        
        
        // children:
        buttonGotoReset.props.children ?? 'Forgot Password?',
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
                expandedTabIndex={expandedTabIndex}
                
                
                
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
                        resolveProviderName={resolveProviderName}
                        
                        
                        
                        // components:
                        buttonSignInComponent={buttonSignInComponent}
                        buttonSignInWithComponent={buttonSignInWithComponent}
                    />
                    <ButtonGotoHome />
                    <ButtonGotoReset />
                </TabPanel>
                <TabPanel className='recovery'>
                    <TabForgot
                        // components:
                        buttonSendResetLinkComponent={buttonSendResetLinkComponent}
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
