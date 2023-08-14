// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    useContext,
    
    
    
    // hooks:
    useState,
    useRef,
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    useMountedFlag,
    
    
    
    // color options of UI:
    ThemeName,
}                           from '@reusable-ui/core'

// reusable-ui components:
import {
    // simple-components:
    Icon,
    Button,
    CloseButton,
    
    
    
    // layout-components:
    ListItem,
    List,
    CardHeader,
    CardFooter,
    CardBody,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
}                           from '@reusable-ui/components'

// internal components:
import {
    // dialog-components:
    ModalStatus,
}                           from '@/components/ModalStatus'



// types:
export interface DialogMessage {
    theme   ?: ThemeName
    title   ?: React.ReactNode
    message  : React.ReactNode
}



// contexts:
export interface DialogMessageApi {
    // dialogs:
    showMessage             : (dialogMessage : React.SetStateAction<DialogMessage|false>) => Promise<void>
    showMessageError        : (error         : React.ReactNode                          ) => Promise<void>
    showMessageFieldError   : (invalidFields : ArrayLike<Element>|undefined             ) => Promise<void>
    showMessageFetchError   : (error         : any                                      ) => Promise<void>
    showMessageSuccess      : (success       : React.ReactNode                          ) => Promise<void>
    showMessageNotification : (notification  : React.ReactNode                          ) => Promise<void>
}
const DialogMessageContext = createContext<DialogMessageApi>({
    // dialogs:
    showMessage             : async () => {},
    showMessageError        : async () => {},
    showMessageFieldError   : async () => {},
    showMessageFetchError   : async () => {},
    showMessageSuccess      : async () => {},
    showMessageNotification : async () => {},
});



// react components:
export interface DialogMessageProviderProps {
    /* empty */
}
export const DialogMessageProvider = (props: React.PropsWithChildren<DialogMessageProviderProps>) => {
    // states:
    const [dialogMessage, setDialogMessage]      = useState<DialogMessage|false>(false);
    
    const prevDialogMessage                      = useRef<DialogMessage|undefined>(dialogMessage || undefined);
    if (dialogMessage) prevDialogMessage.current = dialogMessage;
    
    const signalsDialogMessageClosed             = useRef<(() => void)[]>([]);
    
    const isMounted                              = useMountedFlag();
    
    
    
    // refs:
    const modalStatusButtonRef    = useRef<HTMLButtonElement|null>(null);
    
    
    
    // stable callbacks:
    const showMessage             = useEvent(async (dialogMessage : React.SetStateAction<DialogMessage|false>): Promise<void> => {
        setDialogMessage(dialogMessage);
        return new Promise<void>((resolved) => {
            signalsDialogMessageClosed.current.push(resolved);
        });
    });
    
    const showMessageError        = useEvent(async (error         : React.ReactNode                          ): Promise<void> => {
        await showMessage({
            theme   : 'danger',
            title   : 'Error',
            message : error,
        });
    });
    const showMessageFieldError   = useEvent(async (invalidFields : ArrayLike<Element>|undefined             ): Promise<void> => {
        // conditions:
        if (!invalidFields?.length) return;
        
        
        
        // show message:
        const isPlural = (invalidFields?.length > 1);
        await showMessageError(<>
            <p>
                There {isPlural ? 'are some' : 'is an'} invalid field{isPlural ? 's' : ''} that {isPlural ? 'need' : 'needs'} to be fixed:
            </p>
            <List listStyle='flat'>
                {Array.from(invalidFields).map((invalidField, index) =>
                    <ListItem key={index}>
                        <>
                            <Icon
                                icon={
                                    ((invalidField.parentElement?.previousElementSibling as HTMLElement)?.children?.[0]?.children?.[0] as HTMLElement)?.style?.getPropertyValue('--icon-image')?.slice(1, -1)
                                    ??
                                    'text_fields'
                                }
                                theme='primary'
                            />
                            &nbsp;
                            {(invalidField as HTMLElement).getAttribute('aria-label') || (invalidField.children[0] as HTMLInputElement).placeholder}
                        </>
                    </ListItem>
                )}
            </List>
        </>);
        if (!isMounted.current) return; // unmounted => abort
        
        
        
        // focus the first fieldError:
        const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), iframe';
        const firstInvalidField = invalidFields?.[0];
        const firstFocusableElm = (firstInvalidField.matches(focusableSelector) ? firstInvalidField : firstInvalidField?.querySelector(focusableSelector)) as HTMLElement|null;
        firstInvalidField.scrollIntoView({
            block    : 'start',
            behavior : 'smooth',
        });
        firstFocusableElm?.focus?.({ preventScroll: true });
    });
    const showMessageFetchError   = useEvent(async (error         : any                                      ): Promise<void> => {
        await showMessageError(
            // axios' human_readable server error   response:
            // axios' human_readable server message response:
            ((): string|undefined => {
                const data = error?.response?.data;
                
                
                
                // response as json:
                if (typeof(data) === 'object') {
                    const error   = data?.error;
                    if ((typeof(error)   === 'string') && !!error  ) return error;
                    
                    const message = data?.message;
                    if ((typeof(message) === 'string') && !!message) return message;
                }
                // response as text/**:
                else if (typeof(data) === 'string') {
                    if (!!data) return data;
                } // if
                
                
                
                return undefined; // unknown response format => skip
            })()
            ??
            // fetch's human_readable server error   response:
            // fetch's human_readable server message response:
            (await (async (): Promise<string|undefined> => {
                // conditions:
                const response = error?.cause;
                if ((typeof(response) !== 'object') || !(response instanceof Response)) return undefined; // not a `Response` object => skip
                const contentType = response.headers.get('Content-Type');
                if (!contentType) return undefined; // no 'Content-Type' defined => skip
                
                
                
                // response as json:
                if ((/^application\/json/i).test(contentType)) {
                    try {
                        const data    = await response.json();
                        
                        const error   = data?.error;
                        if ((typeof(error)   === 'string') && !!error  ) return error;
                        
                        const message = data?.message;
                        if ((typeof(message) === 'string') && !!message) return message;
                    }
                    catch {
                        return undefined; // parse failed => skip
                    } // try
                }
                // response as text/**:
                else if ((/^text/i).test(contentType)) {
                    try {
                        const text = await response.text();
                        
                        if (!!text) return text;
                    }
                    catch {
                        return undefined; // parse failed => skip
                    } // try
                } // if
                
                
                
                return undefined; // unknown response format => skip
            })())
            ??
            // if there is http client/server error => assumes as connection problem:
            ((): React.ReactNode => {
                const isRequestError = (
                    // axios'  error request:
                    !!error.request
                    ||
                    // fetch's error request:
                    (error instanceof TypeError)
                );
                
                let errorCode = (
                    // axios'  error status code:
                    error?.response?.status
                    ??
                    // fetch's error status code:
                    error?.cause
                );
                if (typeof(errorCode) !== 'number') errorCode = 0;
             // const isClientError  = (errorCode >= 400) && (errorCode <= 499);
                const isServerError  = (errorCode >= 500) && (errorCode <= 599);
                
                return (
                    <>
                        <p>
                            Oops, there was an error processing the command.
                        </p>
                        {isRequestError && <p>
                            There was a <strong>problem contacting our server</strong>.
                            <br />
                            Make sure your internet connection is available.
                        </p>}
                        {isServerError && <p>
                            Please try again in a few minutes.<br />
                            If the problem still persists, please contact our technical support.
                        </p>}
                    </>
                );
            })()
        );
    });
    const showMessageSuccess      = useEvent(async (success       : React.ReactNode                          ): Promise<void> => {
        await showMessage({
            theme   : 'success',
            title   : 'Success',
            message : success,
        });
    });
    const showMessageNotification = useEvent(async (notification  : React.ReactNode                          ): Promise<void> => {
        await showMessage({
            theme   : 'primary',
            title   : 'Notification',
            message : notification,
        });
    });
    
    
    
    // handlers:
    const handleModalExpandedChange = useEvent<EventHandler<ModalExpandedChangeEvent>>(({expanded}) => {
        if (expanded) return; // only interested of collapsed event
        handleCloseDialogMessage();
    });
    const handleModalFocus          = useEvent(() => {
        setTimeout(() => {
            modalStatusButtonRef.current?.focus();
        }, 0); // wait to next macroTask, to make sure the keyboard event from <Input> was gone
    });
    
    const handleCloseDialogMessage  = useEvent((): void => {
        setDialogMessage(false);
    });
    const handleClosedDialogMessage = useEvent((): void => {
        for (const signalDialogMessageClosed of signalsDialogMessageClosed.current) {
            signalDialogMessageClosed();
        } // for
        signalsDialogMessageClosed.current.splice(0); // clear
    });
    
    
    
    // apis:
    const dialogMessageApi = useMemo<DialogMessageApi>(() => ({
        // dialogs:
        showMessage,             // stable ref
        showMessageError,        // stable ref
        showMessageFieldError,   // stable ref
        showMessageFetchError,   // stable ref
        showMessageSuccess,      // stable ref
        showMessageNotification, // stable ref
    }), []);
    
    
    
    // jsx:
    return (
        <DialogMessageContext.Provider value={dialogMessageApi}>
            {props.children}
            
            <ModalStatus
                // variants:
                theme={prevDialogMessage.current?.theme ?? 'primary'}
                modalCardStyle='scrollable'
                
                
                
                // behaviors:
                lazy={true}
                
                
                
                // handlers:
                onExpandedChange={handleModalExpandedChange}
                onExpandStart={handleModalFocus}
                onCollapseEnd={handleClosedDialogMessage}
            >
                {!!dialogMessage && <>
                    <CardHeader>
                        {dialogMessage.title ?? 'Notification'}
                        <CloseButton
                            // handlers:
                            onClick={handleCloseDialogMessage}
                        />
                    </CardHeader>
                    <CardBody>
                        {dialogMessage.message}
                    </CardBody>
                    <CardFooter>
                        <Button
                            // refs:
                            elmRef={modalStatusButtonRef}
                            
                            
                            
                            // handlers:
                            onClick={handleCloseDialogMessage}
                        >
                            Okay
                        </Button>
                    </CardFooter>
                </>}
            </ModalStatus>
        </DialogMessageContext.Provider>
    );
};



// hooks:
export const useDialogMessage = (): DialogMessageApi => {
    return useContext(DialogMessageContext);
};
