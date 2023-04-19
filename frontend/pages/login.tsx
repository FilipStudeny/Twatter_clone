import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { ReactElement, useContext, useState } from 'react'
import { UserSessionContext } from '@/components/context/UserSession'

import styles from '../styles/Login.module.css'

interface Payload {
    username: string | undefined;
    password: string | undefined;
}
  
enum InputType {
    USERNAME = 'username',
    PASSWORD = 'password',
}
  

const Login = () =>{


    const router = useRouter();
    const userSession = useContext(UserSessionContext)

    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [errorMessage, setErrorMessage] = useState<string>()
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>()
  
    const errorMessagesClass = showErrorMessage ? '' : styles.disabled

    const getInputValue = (inputType: InputType) => (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (inputType) {
          case InputType.USERNAME:
            setUsername(event.target.value)
            break
          case InputType.PASSWORD:
            setPassword(event.target.value)
            break
        }
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username || !password ) {
            setErrorMessage('Make sure all fields are populated')
            setShowErrorMessage(true)
            return
        }
      
        const payload: Payload = { username, password }
        const body = JSON.stringify(payload);
        let response: any;

        try {
            response = await fetch("http://localhost:8888/api/user/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: body,
            })
        } catch (error) {
            setErrorMessage('There was an error submitting the form');
            setShowErrorMessage(true);
        }
        
        const data: any = await response.json();
        if (response.ok) {
            if(data.error){
                setErrorMessage('There was an error submitting the form');
                setShowErrorMessage(true);
                return;
            }else{
                userSession.login(data)
                router.push("/")
            }
        } else {
            setErrorMessage("Account does not found.");
            setShowErrorMessage(true);
        }
    }

    return (
        <div className={styles.LoginPage}>
            <div className={styles.LoginForm}>
                <h1>Login</h1>
                <form onSubmit={onSubmit}>
                    <div className={styles.LoginFormInputs}>
                        <div>
                            <label htmlFor='usernameInput'>Username or Email: </label>
                            <input type={'text'} id='usernameInput' onChange={getInputValue(InputType.USERNAME)}></input>
                        </div>
                        <div>
                            <label htmlFor='passwordInput'>Password: </label>
                            <input type={'password'} id='passwordInput' onChange={getInputValue(InputType.PASSWORD)}/>
                        </div>
                    </div>
                    <div className={`${styles.ErrorMessages} ${errorMessagesClass}`}>
                        <p>{errorMessage}</p>
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