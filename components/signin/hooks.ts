'use client'

// react:
import {
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'



export const useFieldState = (): readonly [string, React.Dispatch<React.SetStateAction<string>>, React.ChangeEventHandler<HTMLInputElement>] => {
    // states:
    const [field, setField] = useState<string>('');
    
    
    
    // handlers:
    const handleFieldChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target: {value}}) => {
        setField(value);
    });
    
    
    
    // api:
    return [
        field,
        setField,
        handleFieldChange,
    ];
};

export const useFocusState = <TElement extends Element = HTMLElement>() : readonly [boolean, { onFocus: React.FocusEventHandler<TElement>, onBlur: React.FocusEventHandler<TElement> }] => {
    // states:
    const [isFocus, setIsFocus] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleFocus = useEvent<React.FocusEventHandler<TElement>>(() => {
        setIsFocus(true);
    });
    const handleBlur  = useEvent<React.FocusEventHandler<TElement>>(() => {
        setIsFocus(false);
    });
    
    
    
    // api:
    return [
        isFocus,
        {
            onFocus : handleFocus,
            onBlur  : handleBlur,
        },
    ];
};
