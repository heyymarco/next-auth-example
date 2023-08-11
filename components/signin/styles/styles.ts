// cssfn:
import {
    // writes css in javascript:
    rule,
    variants,
    style,
    
    
    
    // reads/writes css variables configuration:
    usesCssProps,
    
    
    
    // writes complex stylesheets in simpler way:
    watchChanges,
}                           from '@cssfn/core'                  // writes css in javascript

// reusable-ui core:
import {
    // size options of UI:
    usesResizable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // styles:
    onBasicStylesChange,
    usesBasicLayout,
    usesBasicVariants,
}                           from '@reusable-ui/basic'           // a base component
import {
    // styles:
    onContentStylesChange,
    usesContentBasicLayout,
    usesContentBasicVariants,
}                           from '@reusable-ui/content'         // a neighbor component

// internals:
import {
    // configs:
    signIns,
    cssSignInConfig,
}                           from './config'



// styles:
export const onSignInStylesChange = watchChanges(onBasicStylesChange, onContentStylesChange, cssSignInConfig.onChange);

export const usesSignInLayout = () => {
    return style({
        // layouts:
        ...usesBasicLayout(),
        ...style({
            // layouts:
            display        : 'inline-flex',  // use inline flexbox, so it takes the width & height as we set
            flexDirection  : 'row',          // items are stacked horizontally
            justifyContent : 'center',       // center items (text, icon, etc) horizontally
            alignItems     : 'center',       // center items (text, icon, etc) vertically
            flexWrap       : 'wrap',         // allows the items (text, icon, etc) to wrap to the next row if no sufficient width available
            
            
            
            // positions:
            verticalAlign  : 'baseline',     // <Label>'s text should be aligned with sibling text, so the <Label> behave like <span> wrapper
            
            
            
            // typos:
            textAlign      : 'start',        // flow to the document's writing flow
            
            
            
            // customize:
            ...usesCssProps(signIns),        // apply config's cssProps
        }),
    });
};

export const usesSignInVariants = () => {
    // dependencies:
    
    // variants:
    const {resizableRule} = usesResizable(signIns);
    
    
    
    return style({
        // variants:
        /* write specific labelStyle first, so it can be overriden by `.nude`, `.mild`, `.outlined`, etc */
        ...variants([
            rule('.content', { // content
                // layouts:
                ...usesContentBasicLayout(),
                
                // variants:
                ...usesContentBasicVariants(),
            }),
        ]),
        ...usesBasicVariants(),
        ...resizableRule(),
    });
};

export default () => style({
    // layouts:
    ...usesSignInLayout(),
    
    // variants:
    ...usesSignInVariants(),
});
