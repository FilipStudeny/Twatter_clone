import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PageHeader from '../components/PageHeader'
import Head from 'next/head'
import Script from 'next/script'
import { AppPropsWithLayout } from '../components/Layouts/LayoutConfig'

export default function App({ Component, pageProps }: AppPropsWithLayout) {

    const getLayout = Component.getLayout ?? ((page) => page)
    
    return getLayout(    
        <>
            <Script src="https://kit.fontawesome.com/a2c399c19b.js"></Script>
            <Component {...pageProps} />
        </>
    )

    /*
    return (
    <>
        <Script src="https://kit.fontawesome.com/a2c399c19b.js"></Script>
        <PageHeader/>
        <Component {...pageProps} />

    </>
  */
  
}
