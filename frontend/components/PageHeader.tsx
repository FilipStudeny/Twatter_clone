import Link from 'next/link'
import React from 'react'
import styles from '../styles/PageHeader.module.css'
import UserSideBar from './UserSideBar'


function PageHeader() {
  return (
    <>
        <div className={styles.PageHeader}>
            <Link href='/' className={styles.AppName}>Twatter</Link>

            <div>
                <Link href='/login'>
                    <i className="fa-solid fa-right-to-bracket"></i>
                    <p>Login</p>
                </Link>
                <Link href='/register'>
                    <i className="fa-solid fa-user-plus"></i>
                    <p>Sign up</p>
                </Link>

                <Link href='/login'>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <p>Loggout</p>
                </Link>
            </div>
        </div>


    </>
  )
}

export default PageHeader