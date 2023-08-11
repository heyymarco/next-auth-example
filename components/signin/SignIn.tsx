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
    
    
    
    // composite-components:
    TabPanel,
    Tab,
}                           from '@reusable-ui/components'

// internal components:
import {
    // reusable-ui components:
    ButtonGotoHome,
}                           from './ButtonGotoHome'
import {
    // reusable-ui components:
    ButtonGotoSignIn,
}                           from './ButtonGotoSignIn'
import {
    // reusable-ui components:
    ButtonGotoReset,
}                           from './ButtonGotoReset'
import {
    // reusable-ui components:
    TabSignIn,
}                           from './TabSignIn'
import {
    // reusable-ui components:
    TabForgot,
}                           from './TabForgot'
import {
    // reusable-ui components:
    TabReset,
}                           from './TabReset'

// internals:
import {
    SignInStateProvider,
    useSignInState,
}                           from './states/signInState'



// styles:
export const useSignInStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'mhxnjino7v' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './styles/styles'



// react components:
export interface SignInProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ContentProps<TElement>
{
}
const SignIn         = <TElement extends Element = HTMLElement>(props: SignInProps<TElement>) => {
    return (
        <SignInStateProvider>
            <SignInInternal />
        </SignInStateProvider>
    );
};
const SignInInternal = <TElement extends Element = HTMLElement>(props: SignInProps<TElement>) => {
    // styles:
    const styleSheet = useSignInStyleSheet();
    
    
    
    // states:
    const {
        // states:
        expandedTabIndex,
    } = useSignInState();
    
    
    
    // jsx:
    return (
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
                    {...props}
                    
                    
                    
                    // variants:
                    mild={props.mild ?? true}
                    
                    
                    
                    // classes:
                    mainClass={props.mainClass ?? styleSheet.main}
                />
            }
        >
            <TabPanel className='signIn'>
                <TabSignIn />
                <ButtonGotoReset />
                <ButtonGotoHome />
            </TabPanel>
            <TabPanel className='recovery'>
                <TabForgot />
                <ButtonGotoSignIn />
                <ButtonGotoHome />
            </TabPanel>
            <TabPanel className='reset'>
                <TabReset />
                <ButtonGotoSignIn />
                <ButtonGotoHome />
            </TabPanel>
        </Tab>
    );
};
export {
    SignIn,
    SignIn as default,
};
