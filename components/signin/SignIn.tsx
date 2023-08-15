'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useId,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui components:
import {
    // base-components:
    BasicProps,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    ButtonProps,
    ButtonComponentProps,
    ButtonIcon,
    
    
    
    // composite-components:
    TabPanelProps,
    TabPanel,
    TabProps,
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
    SignInStateProps,
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
        Omit<BasicProps<TElement>,
            // children:
            |'children' // not supported
        >,
        
        // states:
        SignInStateProps,
        
        // tabs:
        TabSignInProps,
        TabRecoverProps,
        TabResetProps
{
    // components:
    bodyComponent              ?: React.ReactComponentElement<any, BasicProps<TElement>>
    tabComponent               ?: React.ReactComponentElement<any, TabProps<Element>>
    signInTabPanelComponent    ?: React.ReactComponentElement<any, TabPanelProps<Element>>
    recoverTabPanelComponent   ?: React.ReactComponentElement<any, TabPanelProps<Element>>
    resetTabPanelComponent     ?: React.ReactComponentElement<any, TabPanelProps<Element>>
    
    gotoHomeButtonComponent    ?: ButtonComponentProps['buttonComponent']
    gotoSignInButtonComponent  ?: ButtonComponentProps['buttonComponent']
    gotoRecoverButtonComponent ?: ButtonComponentProps['buttonComponent']
}
const SignIn         = <TElement extends Element = HTMLElement>(props: SignInProps<TElement>) => {
    return (
        <SignInStateProvider {...props}>
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
        resolveProviderName : _resolveProviderName, // remove
        basePath            : _basePath,            // remove
        
        
        
        // pages:
        homepagePath        : _homepagePath,        // remove
        
        
        
        // components:
        bodyComponent              = (<Content mild={true} />                               as React.ReactComponentElement<any, BasicProps<TElement>>),
        tabComponent               = (<Tab headerComponent={null}>{undefined}</Tab>         as React.ReactComponentElement<any, TabProps<Element>>),
        signInTabPanelComponent    = (<TabPanel />                                          as React.ReactComponentElement<any, TabPanelProps<Element>>),
        recoverTabPanelComponent   = (<TabPanel />                                          as React.ReactComponentElement<any, TabPanelProps<Element>>),
        resetTabPanelComponent     = (<TabPanel />                                          as React.ReactComponentElement<any, TabPanelProps<Element>>),
        
        gotoHomeButtonComponent    = (<ButtonIcon icon='home'        buttonStyle='link' />  as React.ReactComponentElement<any, ButtonProps>),
        gotoSignInButtonComponent  = (<ButtonIcon icon='arrow_back'  buttonStyle='link' />  as React.ReactComponentElement<any, ButtonProps>),
        gotoRecoverButtonComponent = (<ButtonIcon icon='help_center' buttonStyle='link' />  as React.ReactComponentElement<any, ButtonProps>),
        
        usernameInputComponent,
        passwordInputComponent,
        signInButtonComponent,
        signInWithButtonComponent,
        
        sendRecoverLinkButtonComponent,
        
        emailInputComponent,
        password2InputComponent,
        resetPasswordButtonComponent,
        
        passwordTooltipComponent,
        password2TooltipComponent,
        passwordValidationListComponent,
        password2ValidationListComponent,
        passwordValidationListItemComponent,
        password2ValidationListItemComponent,
        passwordValidationIconComponent,
        password2ValidationIconComponent,
        
        tokenValidationModalStatusComponent,
    ...restBasicProps} = props;
    
    
    
    // identifiers:
    const defaultId = useId();
    
    
    
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
    /* <Tab> */
    return React.cloneElement<TabProps<Element>>(tabComponent,
        // props:
        {
            // identifiers:
            id               : tabComponent.props.id               ?? defaultId,
            
            
            
            // states:
            expandedTabIndex : tabComponent.props.expandedTabIndex ?? (
                (section === 'recover')
                ? 1
                :   (section === 'reset')
                    ? 2
                    : 0
            ),
            
            
            
            // components:
            bodyComponent    : tabComponent.props.bodyComponent    ?? (
                /* <Content> */
                React.cloneElement<BasicProps<TElement>>(bodyComponent,
                    // props:
                    {
                        // other props:
                        ...restBasicProps,
                        ...bodyComponent.props, // overwrites restBasicProps (if any conflics)
                        
                        
                        
                        // classes:
                        mainClass : bodyComponent.props.mainClass ?? props.mainClass ?? styleSheet.main
                    },
                )
            ),
        },
        
        
        
        // children:
        tabComponent.props.children ?? [
            React.cloneElement<TabPanelProps<Element>>(signInTabPanelComponent,
                // props:
                {
                    // identifiers:
                    key       : signInTabPanelComponent.key              ?? 'signIn',
                    
                    
                    
                    // classes:
                    className : signInTabPanelComponent.props.className  ?? 'signIn',
                },
                
                
                
                // children:
                <TabSignIn
                    // auths:
                    providers={providers}
                    
                    
                    
                    // components:
                    usernameInputComponent={usernameInputComponent}
                    passwordInputComponent={passwordInputComponent}
                    signInButtonComponent={signInButtonComponent}
                    signInWithButtonComponent={signInWithButtonComponent}
                />,
                <GotoHomeButton />,
                <GotoRecoverButton />,
            ),
            React.cloneElement<TabPanelProps<Element>>(recoverTabPanelComponent,
                // props:
                {
                    // identifiers:
                    key       : recoverTabPanelComponent.key             ?? 'recover',
                    
                    
                    
                    // classes:
                    className : recoverTabPanelComponent.props.className ?? 'recover',
                },
                
                
                
                // children:
                <TabRecover
                    // components:
                    usernameInputComponent={usernameInputComponent}
                    sendRecoverLinkButtonComponent={sendRecoverLinkButtonComponent}
                />,
                <GotoSignInButton />,
            ),
            React.cloneElement<TabPanelProps<Element>>(resetTabPanelComponent,
                // props:
                {
                    // identifiers:
                    key       : resetTabPanelComponent.key               ?? 'reset',
                    
                    
                    
                    // classes:
                    className : resetTabPanelComponent.props.className   ?? 'reset',
                },
                
                
                
                // children:
                <TabReset
                    // components:
                    emailInputComponent={emailInputComponent}
                    passwordInputComponent={passwordInputComponent}
                    password2InputComponent={password2InputComponent}
                    resetPasswordButtonComponent={resetPasswordButtonComponent}
                    
                    passwordTooltipComponent={passwordTooltipComponent}
                    password2TooltipComponent={password2TooltipComponent}
                    passwordValidationListComponent={passwordValidationListComponent}
                    password2ValidationListComponent={password2ValidationListComponent}
                    passwordValidationListItemComponent={passwordValidationListItemComponent}
                    password2ValidationListItemComponent={password2ValidationListItemComponent}
                    passwordValidationIconComponent={passwordValidationIconComponent}
                    password2ValidationIconComponent={password2ValidationIconComponent}
                    
                    tokenValidationModalStatusComponent={tokenValidationModalStatusComponent}
                />,
                <GotoSignInButton />,
            ),
        ],
    );
};
export {
    SignIn,
    SignIn as default,
};
