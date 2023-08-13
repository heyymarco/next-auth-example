// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    ModalExpandedChangeEvent,
    
    ModalCardProps,
    ModalCard,
}                           from '@reusable-ui/components'              // a set of official Reusable-UI components

// hooks:
import {
    // hooks:
    useLastExistingChildren,
}                           from '@/hooks/lastExistingChildren'



export interface ModalStatusProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent = ModalExpandedChangeEvent>
    extends
        // bases:
        ModalCardProps<TElement, TModalExpandedChangeEvent>
{
    // components:
    modalCardComponent ?: React.ReactComponentElement<any, ModalCardProps<TElement, TModalExpandedChangeEvent>>
}
const ModalStatus = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent = ModalExpandedChangeEvent>(props: ModalStatusProps<TElement, TModalExpandedChangeEvent>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        modalCardComponent = (<ModalCard /> as React.ReactComponentElement<any, ModalCardProps<TElement, TModalExpandedChangeEvent>>),
        
        
        
        // children:
        children,
    ...restModalProps} = props;
    
    
    
    const [hasChildren, lastExistingChildren, clearChildren] = useLastExistingChildren(children);
    
    
    
    // handlers:
    const handleCollapseEnd = useMergeEvents(
        // preserves the original `onCollapseEnd` from `modalCardComponent`:
        modalCardComponent.props.onCollapseEnd,
        
        
        
        // preserves the original `onCollapseEnd` from `props`:
        props.onCollapseEnd,
        
        
        
        // actions:
        clearChildren,
    );
    
    
    
    // jsx:
    return React.cloneElement<ModalCardProps<TElement, TModalExpandedChangeEvent>>(modalCardComponent,
        // props:
        {
            // other props:
            ...restModalProps,
            ...modalCardComponent.props, // overwrites restModalProps (if any conflics)
            
            
            
            // states:
            expanded      : modalCardComponent.props.expanded ?? (props.expanded ?? hasChildren),
            
            
            
            // handlers:
            onCollapseEnd : handleCollapseEnd,
        },
        
        
        
        // children:
        (modalCardComponent.props.children ?? lastExistingChildren),
    );
}
export {
    ModalStatus,
    ModalStatus as default,
}
