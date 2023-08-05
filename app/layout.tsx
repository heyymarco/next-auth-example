'use client'

import { Container } from '@reusable-ui/components'
import { StylesCSR } from './StylesCSR' // client_side_rendering CSS (required)
import { StylesSSR } from './StylesSSR' // server_side_rendering CSS (optional)

// import '@/theme.config'

import './layoutStyles.css'

// import { Header } from './Header'
// import { Footer } from './Footer'

// import { store } from '@/store/store'
// import { Provider } from 'react-redux'

// import { WEBSITE_LANGUAGE } from '@/website.config'

// internal components:
import {
    // dialogs:
    DialogMessageProvider,
}                           from '@/hooks/dialogMessage'



export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <head>
                <StylesCSR />
                <StylesSSR />
            </head>
            <body>
                <DialogMessageProvider>
                    {/* <Header /> */}
                    {/* <Provider store={store}> */}
                    <Container theme='primary' tag='main'>
                        {children}
                    </Container>
                    {/* </Provider> */}
                    {/* <Footer /> */}
                </DialogMessageProvider>
            </body>
        </html>
    )
}
