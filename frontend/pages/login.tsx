import Link from 'next/link'
import React, { ReactElement } from 'react'

import styles from '../styles/Login.module.css'

const Login = () =>{

    const errorMessagesClass = `${styles.disabled}`;

    return (
        <div className={styles.LoginPage}>
            <div className={styles.LoginForm}>
                <h1>Login</h1>
                <form>
                    <div className={styles.LoginFormInputs}>
                        <div>
                            <label htmlFor='usernameInput'>Username or Email: </label>
                            <input type={'text'} id='usernameInput'></input>
                        </div>
                        <div>
                            <label htmlFor='passwordInput'>Password: </label>
                            <input type={'password'} id='passwordInput'/>
                        </div>
                    </div>
                    <div className={`${styles.ErrorMessages} ${errorMessagesClass}`}>
                        
                    </div>
                    <button>Login in to your account</button>
                </form>
                <p className={styles.FormFooter}>Don&apos;t have a profile ? 
                    <Link href='/register'>Create one now
                        <i className="fa-solid fa-user-plus"></i>
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Login