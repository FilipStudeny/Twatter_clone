import Link from 'next/link'
import React, { ReactElement } from 'react'
import styles from '../styles/Login.module.css'

const Register = () =>{

    const errorMessagesClass = `${styles.disabled}`;

    return (
        <div className={styles.LoginPage}>
            <div className={styles.LoginForm}>
                <h1>Create new account</h1>
                <form>
                    <div className={styles.LoginFormInputs}>
                        <div>
                            <label htmlFor='usernameInput'>Username: </label>
                            <input type={'text'} id='usernameInput'></input>
                        </div>
                        <div>
                            <label htmlFor='emailInput'>Email adress: </label>
                            <input type={'text'} id='emailInput'></input>
                        </div>
                        <div>
                            <label htmlFor='passwordInput'>Password: </label>
                            <input type={'password'} id='passwordInput'/>
                        </div>
                        <div>
                            <label htmlFor='repeatPasswordInput'>Repeat password: </label>
                            <input type={'password'} id='repeatPasswordInput'></input>
                        </div>
                    </div>
                    <div className={`${styles.ErrorMessages} ${errorMessagesClass}`}>
                    
                    </div>
                    <button>Login in to your account</button>
                </form>
                <p className={styles.FormFooter}>Already have an account ? 
                    <Link href='/login'>Sign in
                        <i className="fa-solid fa-right-to-bracket"></i>
                    </Link>
                </p>

            </div>

        </div>
    )
}

export default Register