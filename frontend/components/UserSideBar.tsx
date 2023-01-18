import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import styles from '../styles/PageHeader.module.css'
import UserSession from './context/userSession'


function UserSideBar() {

    const userSessionData = useContext(UserSession);

    const displayUserName = () => {
        if(userSessionData.isLoggedIn){
            return(
                <h1>{userSessionData.username}</h1>
            )
        }
    }

    return (
        <>
            <div className={styles.UserSideBar}>
                <div className={styles.UserImage}>
                    <Image src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                </div>

                <>
                    {displayUserName()}
                </>

                <div className={styles.Menu}>
                    <Link href='/'>
                        <i className="fa-solid fa-house"></i>
                    </Link>
                    <Link href='/search'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </Link>

                    <Link href='#'>
                        <i className="fa-solid fa-message"></i> 
                    </Link>
                    <Link href='#'>
                        <i className="fa-solid fa-user"></i>
                    </Link>
                    <Link href='#'>
                        <i className="fa-solid fa-gear"></i>
                    </Link>

                    <Link href='#'>
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </Link>
                    
                </div>
            </div>
        </>

    )
}

export default UserSideBar