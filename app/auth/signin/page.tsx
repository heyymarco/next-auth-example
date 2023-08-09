'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useMemo,
    useRef,
    useState,
}                           from 'react'

// next:
import {
    // navigations:
    useRouter,
    usePathname,
    useSearchParams,
}                           from 'next/navigation'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    ButtonIcon,
    
    
    
    // composite-components:
    TabPanel,
    Tab,
}                           from '@reusable-ui/components'

// internal components:
import {
    // dialogs:
    useDialogMessage,
}                           from '@/hooks/dialogMessage'
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
}                           from './signinContext'
import {
    // utilities:
    getAuthErrorDescription,
}                           from './utilities'



// react components:
const SignIn     = () => {
    // navigations:
    const router       = useRouter();
    const pathName     = usePathname() ?? '/'
    const searchParams = useSearchParams();
    
    
    
    // states:
    const callbackUrlRef                          = useRef<string|null>(searchParams?.get('callbackUrl'       ) || null);
    const resetPasswordTokenRef                   = useRef<string|null>(searchParams?.get('resetPasswordToken') || null);
    const [expandedTabIndex, setExpandedTabIndex] = useState<number>(!!resetPasswordTokenRef.current ? 2 : 0);
    
    
    
    // dialogs:
    const {
        showMessageError,
    } = useDialogMessage();
    
    
    
    // dom effects:
    
    // displays an error passed by `next-auth`:
    useEffect(() => {
        // conditions:
        const error = searchParams?.get('error');
        if (!error) return; // no error passed => ignore
        
        
        
        // report the failure:
        showMessageError(getAuthErrorDescription(error));
    }, []);
    
    // remove passed queryString(s):
    useEffect(() => {
        // conditions:
        if (
            !searchParams?.get('error')
            &&
            !searchParams?.get('callbackUrl')
            &&
            !searchParams?.get('resetPasswordToken')
        ) return; // no queryString(s) passed => nothing to remove => ignore
        
        
        
        try {
            // get current browser's queryString:
            const newSearchParams = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
            
            // remove `?error=***` on browser's url:
            newSearchParams.delete('error');
            
            // remove `?callbackUrl=***` on browser's url:
            newSearchParams.delete('callbackUrl');
            
            // remove `?resetPasswordToken=***` on browser's url:
            newSearchParams.delete('resetPasswordToken');
            
            // update browser's url:
            router.replace(`${pathName}${!!newSearchParams.size ? `?${newSearchParams}` : ''}`, { scroll: false });
        }
        catch {
            // ignore any error
        } // if
    }, []);
    
    
    
    // stable callbacks:
    const backSignIn = useEvent(() => {
        setExpandedTabIndex(0);
    });
    
    
    
    // handlers:
    const handleBackSignIn = backSignIn;
    const handleGotoReset  = useEvent(() => {
        setExpandedTabIndex(1);
    });
    const handleBackHome   = useEvent(() => {
        router.push('/');
    });
    
    
    
    // jsx:
    const ButtonGotoHome   = () => {
        // jsx:
        return (
            <ButtonIcon
                // appearances:
                icon='home'
                
                
                
                // variants:
                buttonStyle='link'
                
                
                
                // handlers:
                onClick={handleBackHome}
            >
                Back to Home
            </ButtonIcon>
        );
    };
    const ButtonGotoSignIn = () => {
        // jsx:
        return (
            <ButtonIcon
                // appearances:
                icon='arrow_back'
                
                
                
                // variants:
                buttonStyle='link'
                
                
                
                // handlers:
                onClick={handleBackSignIn}
            >
                Back to Sign In Page
            </ButtonIcon>
        );
    };
    const ButtonGotoReset  = () => {
        // jsx:
        return (
            <ButtonIcon
                // appearances:
                icon='help_center'
                
                
                
                // variants:
                buttonStyle='link'
                
                
                
                // handlers:
                onClick={handleGotoReset}
            >
                Forgot Password?
            </ButtonIcon>
        );
    };
    return (
        <Content theme='primary'>
            <SigninContextProvider signinApi={useMemo(() => ({
                expandedTabIndex   : expandedTabIndex,
                callbackUrl        : callbackUrlRef.current,
                resetPasswordToken : resetPasswordTokenRef.current,
                
                backSignIn         : backSignIn,
            }), [expandedTabIndex])}>
                <Tab
                    // identifiers:
                    id='tabSignIn'
                    
                    
                    
                    // states:
                    expandedTabIndex={expandedTabIndex}
                    
                    
                    
                    // components:
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
            </SigninContextProvider>
        </Content>
    )
};
export default SignIn;
