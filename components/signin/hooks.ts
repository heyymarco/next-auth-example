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
