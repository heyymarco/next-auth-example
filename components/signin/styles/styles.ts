// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // a spacer (gap) management system:
    spacers,
    
    
    
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onContentStylesChange,
    usesContentLayout,
    usesContentVariants,
}                           from '@reusable-ui/content'         // a base component

// internals:
import {
    // elements:
    signInTabElm,
    recoveryTabElm,
    resetTabElm,
    
    usernameElm,
    passwordElm,
    password2Elm,
    signinElm,
    sendResetLinkElm,
    resetPasswordElm,
    
    signinSeparatorElm,
    
    gotoHomeElm,
    gotoSignInElm,
    gotoResetElm,
}                           from './elements'
import {
    // configs:
    signIns,
    cssSignInConfig,
}                           from './config'



// styles:
export const onSignInStylesChange = watchChanges(onContentStylesChange, cssSignInConfig.onChange);

export const usesSignInLayout = () => {
    return style({
        // layouts:
        ...usesContentLayout(),
        ...style({
            // children:
            ...children([signInTabElm, recoveryTabElm, resetTabElm], {
                // layouts:
                display      : 'grid',
                
                
                
                // spacings:
                gap: spacers.default,
                
                
                
                // children:
                ...children('form', {
                    // layouts:
                    display: 'contents',
                    
                    
                    
                    // children:
                    ...children(usernameElm, {
                        // positions:
                        gridArea : 'username',
                    }),
                    ...children(passwordElm, {
                        // positions:
                        gridArea : 'password',
                    }),
                    ...children(password2Elm, {
                        // positions:
                        gridArea : 'password2',
                    }),
                    ...children(signinElm, {
                        ...rule('.credentials', {
                            // positions:
                            gridArea : 'actionBtn',
                        }),
                    }),
                    ...children(sendResetLinkElm, {
                        // positions:
                        gridArea : 'actionBtn',
                    }),
                    ...children(resetPasswordElm, {
                        // positions:
                        gridArea : 'actionBtn',
                    }),
                    ...children(signinSeparatorElm, {
                        // positions:
                        gridArea  : 'separator',
                        alignSelf : 'center',
                        
                        
                        
                        // layouts:
                        display: 'flex',
                        
                        
                        
                        // spacings:
                        margin   : 0,
                    }),
                }),
                ...children(gotoHomeElm, {
                    // positions:
                    gridArea    : 'gotoHome',
                    justifySelf : 'start',
                }),
                ...children(gotoSignInElm, {
                    // positions:
                    gridArea    : 'gotoSignIn',
                    justifySelf : 'start',
                }),
                ...children(gotoResetElm, {
                    // positions:
                    gridArea    : 'gotoReset',
                    justifySelf : 'end',
                }),
            }),
            ...children(signInTabElm, {
                // layouts:
                gridTemplate : [[
                    '"username     username" min-content',
                    '"password     password" min-content',
                    '"actionBtn   actionBtn" min-content',
                    '"gotoHome    gotoReset" min-content',
                    '"separator   separator" min-content',
                    '".......... .........." auto',
                    '/',
                    '1fr 1fr'
                ]],
            }),
            ...children(recoveryTabElm, {
                // layouts:
                gridTemplate : [[
                    '"username     username" min-content',
                    '"actionBtn   actionBtn" min-content',
                    '"gotoSignIn .........." min-content',
                    '".......... .........." auto',
                    '/',
                    '1fr 1fr'
                ]],
            }),
            ...children(resetTabElm, {
                // layouts:
                gridTemplate : [[
                    '"username     username" min-content',
                    '"password     password" min-content',
                    '"password2   password2" min-content',
                    '"actionBtn   actionBtn" min-content',
                    '"gotoSignIn .........." min-content',
                    '".......... .........." auto',
                    '/',
                    '1fr 1fr'
                ]],
            }),
            
            
            
            // customize:
            ...usesCssProps(signIns), // apply config's cssProps
        }),
    });
};

export const usesSignInVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(signIns);
    
    
    
    return style({
        // variants:
        ...usesContentVariants(),
        ...resizableRule(),
    });
};

export default () => style({
    // layouts:
    ...usesSignInLayout(),
    
    // variants:
    ...usesSignInVariants(),
});
