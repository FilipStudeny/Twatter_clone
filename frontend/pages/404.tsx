import Link from 'next/link'
import React from 'react'

import styles from '../styles/404.module.css'

const PageNotFound = () =>{
    return (
        <div className={styles.NotFound}>
            <h1>Page not found !</h1>
            <Link href={'/'}>Get back to home page</Link>
        </div>
    )
}

export default PageNotFound