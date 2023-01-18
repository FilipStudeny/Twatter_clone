import UserSession from '@/components/context/userSession'
import UserSessionHook from '@/components/hooks/userSessionHook'
import PageHeader from '@/components/PageHeader'
import UserSideBar from '@/components/UserSideBar'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useContext } from 'react'

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    const pageToRender = () => {

        if(router.pathname == '/login' || router.pathname == '/register' ){
            return  <Component {...pageProps} />
        }else{
            return(
                <>
                    <UserSideBar/>
                    <div className='pageContent'>
                        <Component {...pageProps} />
                    </div>
                </>
            )
        }
    }


    const { username, loggedIn, login, loggout } = UserSessionHook();

    return( 
        <UserSession.Provider value={{username: username, isLoggedIn: loggedIn, login: login, loggout: loggout}}>
            <Script src="https://kit.fontawesome.com/a2c399c19b.js"></Script>

            <PageHeader/>
            { pageToRender() }

                
        </UserSession.Provider>
    )
}
