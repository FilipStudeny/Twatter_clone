/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import styles from '../styles/PageHeader.module.css'
import { UserSessionContext } from '@/components/context/UserSession'
import { ProfilePictureContext } from './context/UserProfilePicture'


function UserSideBar() {
    const userSessionData = useContext(UserSessionContext);

    return (
        <>
            <div className={styles.UserSideBar}>
                <div className={styles.UserImage}>
                    <img className={styles.SideBarUserImage} src={`${userSessionData.profilePicture}`} width="512" height="512" alt='User profile image'/>
                </div>
                {
                    userSessionData.isLoggedIn &&
                    <Link href={`/profile/${userSessionData.userId}`} className={styles.Username}>{userSessionData.username}</Link>
                }

                <div className={styles.Menu}>
                    <Link href='/'>
                        <i className="fa-solid fa-house"></i>
                    </Link>
                    <Link href='/search'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </Link>

                    <Link href='/messages'>
                        <i className="fa-solid fa-message"></i> 
                    </Link>
                    <Link href={`/profile/${userSessionData.userId}`}>
                        <i className="fa-solid fa-user"></i>
                    </Link>
                    <Link href='/settings'>
                        <i className="fa-solid fa-gear"></i>
                    </Link>

                    <Link href='#' onClick={userSessionData.logout}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </Link>
                    
                </div>
            </div>
        </>

    )
}

export default UserSideBar