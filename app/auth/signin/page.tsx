'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // base-content-components:
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
    SigninContextProvider,
    useSigninContext,
}                           from './signinContext'



// react components:
const SignIn     = () => {
    return (
        <SigninContextProvider>
            <SignInInternal />
        </SigninContextProvider>
    );
};
const SignInInternal = () => {
    // contexts:
    const {
        // states:
        expandedTabIndex,
    } = useSigninContext();
    
    
    
    // jsx:
    return (
        <Content theme='primary'>
            <Tab
                // identifiers:
                id='tabSignIn'
                
                
                
                // states:
                expandedTabIndex={expandedTabIndex}
                
                
                
                // components:
                tabHeaderComponent={null}
                bodyComponent={<Content mild={true} />}
            >
                <TabPanel label='Sign In'>
                    <TabSignIn />
                    <ButtonGotoReset />
                    <ButtonGotoHome />
                </TabPanel>
                <TabPanel label='Recovery'>
                    <TabForgot />
                    <ButtonGotoSignIn />
                    <ButtonGotoHome />
                </TabPanel>
                <TabPanel label='Reset'>
                    <TabReset />
                    <ButtonGotoSignIn />
                    <ButtonGotoHome />
                </TabPanel>
            </Tab>
        </Content>
    );
};
export default SignIn;
