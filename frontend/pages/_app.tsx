import { UserSessionContext, UserSessionProvider } from '@/components/context/UserSession'
import PageHeader from '@/components/PageHeader'
import UserSideBar from '@/components/UserSideBar'
import '@/styles/globals.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useContext, useEffect } from 'react'
import styles from '../styles/404.module.css'

type AppProps = {
  Component: React.ComponentType<any>,
  pageProps: any
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const pageToRender = () => {
    if (router.pathname === '/login' || router.pathname === '/register') {
        return <Component {...pageProps} />;
    }
  
    if (!isLoggedIn) {
        return (
            <div className={styles.NotFound}>
                <h1>You must sign in to view this content</h1>
                <Link href="/login">Sign in</Link>
            </div>
        );
    }
  
    return (
        <>
            <UserSideBar />
            <div className="pageContent">
                <Component {...pageProps} />
            </div>
        </>
    );
  };

  const { username, isLoggedIn, login, logout, userId, profilePicture, token, setProfilePicture } = UserSessionProvider();

  return (
    <UserSessionContext.Provider value={{ username, isLoggedIn, login, logout, userId, profilePicture, token, setProfilePicture }}>

      <Script src="https://kit.fontawesome.com/a2c399c19b.js"></Script>
      <PageHeader />
      {pageToRender()}
    </UserSessionContext.Provider>
  )
}
