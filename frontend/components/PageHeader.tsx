import Link from 'next/link'
import React, { useContext } from 'react'
import styles from '../styles/PageHeader.module.css'
import { UserSessionContext } from '@/components/context/UserSession'


function PageHeader() {

    const userSessionData = useContext(UserSessionContext);

    const displayAuthOptions = () => {
        if(userSessionData.isLoggedIn){
            return(
                <>
                    <Link href='/login' onClick={userSessionData.logout}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <p>Loggout</p>
                    </Link>
                </>
            )
        }else{
            return(
                <>
                    <Link href='/login'>
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