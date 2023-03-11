import Link from 'next/link'
import React, { useContext } from 'react'
import styles from '../styles/PageHeader.module.css'
import UserSession from './context/UserSession'


function PageHeader() {

    const userSessionData = useContext(UserSession);

    const displayAuthOptions = () => {
        if(userSessionData.isLoggedIn){
            return(
                <>
                    <Link href='#' onClick={userSessionData.loggout}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <p>Loggout</p>
                    </Link>
                </>
            )
        }else{
            return(
                <>
                    <Link href='/#' onClick={userSessionData.login}>
                        <i className="fa-solid fa-right-to-bracket"></i>
                        <p>Login</p>
                    </Link>
                    <Link href='/register'>
                        <i className="fa-solid fa-user-plus"></i>
                        <p>Sign up</p>
                    </Link>
                </>
            )
        }

    }

    return (
        <>
            <div className={styles.PageHeader}>
                <Link href='/' className={styles.AppName}>Twatter</Link>

                <div>
                    <>
                        {displayAuthOptions()}
                    </>
                </div>
            </div>


        </>
    )
}

export default PageHeader