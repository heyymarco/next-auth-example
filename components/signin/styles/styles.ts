// cssfn:
import {
    // writes css in javascript:
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
    
    usernameFieldElm,
    passwordFieldElm,
    signinButtonElm,
    
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
                    '"username" auto',
                    '"password" auto',
                    '"   reset" auto',
                    '" signIn " auto',
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
                        // positions:
                        gridArea : 'signIn',
                    }),
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
