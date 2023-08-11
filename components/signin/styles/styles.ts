// cssfn:
import {
    // writes css in javascript:
    rule,
    variants,
    states,
    children,
    style,
    vars,
    
    
    
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
    
    usernameFieldElm,
    passwordFieldElm,
    signinButtonElm,
    
    signinSeparatorElm,
    
    homeButtonElm,
    resetButtonElm,
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
            ...children(signInTabElm, {
                // layouts:
                display      : 'grid',
                gridTemplate : [[
                    '"username                   username" auto',
                    '"password                   password" auto',
                    '"home                          reset" auto',
                    '"signInCredentials signInCredentials" auto',
                    '"signinSeparator     signinSeparator" auto',
                    '/',
                    '1fr 1fr'
                ]],
                
                
                
                
                // spacings:
                gap: spacers.default,
                
                
                
                // children:
                ...children('form', {
                    // layouts:
                    display: 'contents',
                    
                    
                    
                    // children:
                    ...children(usernameFieldElm, {
                        // positions:
                        gridArea : 'username',
                    }),
                    ...children(passwordFieldElm, {
                        // positions:
                        gridArea : 'password',
                    }),
                    ...children(signinButtonElm, {
                        ...rule('.credentials', {
                            // positions:
                            gridArea : 'signInCredentials',
                        }),
                    }),
                    ...children(signinSeparatorElm, {
                        // positions:
                        gridArea : 'signinSeparator',
                        
                        
                        
                        // spacings:
                        margin   : 0,
                    }),
                }),
                ...children(homeButtonElm, {
                    // positions:
                    gridArea    : 'home',
                    justifySelf : 'start',
                }),
                ...children(resetButtonElm, {
                    // positions:
                    gridArea    : 'reset',
                    justifySelf : 'end',
                }),
            }),
            ...children(recoveryTabElm, {
                background: 'yellow',
            }),
            ...children(resetTabElm, {
                background: 'purpule',
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
