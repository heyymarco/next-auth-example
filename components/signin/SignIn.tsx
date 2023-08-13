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
    gotoHomeButtonComponent    ?: ButtonComponentProps['buttonComponent']
    gotoSignInButtonComponent  ?: ButtonComponentProps['buttonComponent']
    gotoRecoverButtonComponent ?: ButtonComponentProps['buttonComponent']
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
        gotoHomeButtonComponent    = (<ButtonIcon icon='home'        buttonStyle='link' /> as React.ReactComponentElement<any, ButtonProps>),
        gotoSignInButtonComponent  = (<ButtonIcon icon='arrow_back'  buttonStyle='link' /> as React.ReactComponentElement<any, ButtonProps>),
        gotoRecoverButtonComponent = (<ButtonIcon icon='help_center' buttonStyle='link' /> as React.ReactComponentElement<any, ButtonProps>),
        
        usernameInputComponent,
        passwordInputComponent,
        signInButtonComponent,
        signInWithButtonComponent,
        
        sendRecoverLinkButtonComponent,
        
        emailInputComponent,
        password2InputComponent,
        resetPasswordButtonComponent,
        tooltipComponent,
        tooltipComponent2,
        validatingModalStatusComponent,
    ...restContentProps} = props;
    // type T1 = typeof restContentProps
    // type T2 = Omit<T1, keyof ContentProps>
    
    
    
    // states:
    const {
        // states:
        section,
        
        
        
        // navigations:
        gotoHome,
        gotoSignIn,
        gotoRecover,
    } = useSignInState();
    
    
    
    // jsx:
    const GotoHomeButton    = () => React.cloneElement<ButtonProps>(gotoHomeButtonComponent,
        // props:
        {
            // classes:
            className : gotoHomeButtonComponent.props.className ?? 'gotoHome',
            
            
            
            // handlers:
            onClick   : gotoHomeButtonComponent.props.onClick   ?? gotoHome,
        },
        
        
        
        // children:
        gotoHomeButtonComponent.props.children ?? 'Back to Home',
    );
    const GotoSignInButton  = () => React.cloneElement<ButtonProps>(gotoSignInButtonComponent,
        // props:
        {
            // classes:
            className : gotoSignInButtonComponent.props.className ?? 'gotoSignIn',
            
            
            
            // handlers:
            onClick   : gotoSignInButtonComponent.props.onClick   ?? gotoSignIn,
        },
        
        
        
        // children:
        gotoSignInButtonComponent.props.children ?? 'Back to Sign In',
    );
    const GotoRecoverButton = () => React.cloneElement<ButtonProps>(gotoRecoverButtonComponent,
        // props:
        {
            // classes:
            className : gotoRecoverButtonComponent.props.className ?? 'gotoRecover',
            
            
            
            // handlers:
            onClick   : gotoRecoverButtonComponent.props.onClick   ?? gotoRecover,
        },
        
        
        
        // children:
        gotoRecoverButtonComponent.props.children ?? 'Forgot Password?',
    );
    return (
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
                    usernameInputComponent={usernameInputComponent}
                    passwordInputComponent={passwordInputComponent}
                    signInButtonComponent={signInButtonComponent}
                    signInWithButtonComponent={signInWithButtonComponent}
                />
                <GotoHomeButton />
                <GotoRecoverButton />
            </TabPanel>
            <TabPanel className='recover'>
                <TabRecover
                    // components:
                    usernameInputComponent={usernameInputComponent}
                    sendRecoverLinkButtonComponent={sendRecoverLinkButtonComponent}
                />
                <GotoSignInButton />
            </TabPanel>
            <TabPanel className='reset'>
                <TabReset
                    // components:
                    emailInputComponent={emailInputComponent}
                    passwordInputComponent={passwordInputComponent}
                    password2InputComponent={password2InputComponent}
                    resetPasswordButtonComponent={resetPasswordButtonComponent}
                    tooltipComponent={tooltipComponent}
                    tooltipComponent2={tooltipComponent2}
                    validatingModalStatusComponent={validatingModalStatusComponent}
                />
                <GotoSignInButton />
            </TabPanel>
        </Tab>
    );
};
export {
    SignIn,
    SignIn as default,
};
