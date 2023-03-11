import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactElement, SyntheticEvent, useState } from 'react'
import styles from '../styles/Login.module.css'

interface Payload {
    username: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    password: string | undefined;
}
  
interface ResponseData {
    error?: string;
    message?: string;
}
  
enum InputType {
    USERNAME = 'username',
    FIRSTNAME = 'firstName',
    LASTNAME = 'lastName',
    PASSWORD = 'password',
    REPEATPASSWORD = 'repeatPassword',
    EMAIL = 'email',
}
  
const Register = () =>{

    const router = useRouter();

    const [username, setUsername] = useState<string>()
    const [firstName, setFirstname] = useState<string>()
    const [lastName, setLastName] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [passwordRepeated, setPasswordRepeated] = useState<string>()
    const [errorMessage, setErrorMessage] = useState<string>()
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>()
  
    const errorMessagesClass = showErrorMessage ? '' : styles.disabled

    const getInputValue = (inputType: InputType) => (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (inputType) {
          case InputType.USERNAME:
            setUsername(event.target.value)
            break
          case InputType.FIRSTNAME:
            setFirstname(event.target.value)
            break
          case InputType.LASTNAME:
            setLastName(event.target.value)
            break
          case InputType.PASSWORD:
            setPassword(event.target.value)
            break
          case InputType.REPEATPASSWORD:
            setPasswordRepeated(event.target.value)
            break
          case InputType.EMAIL:
            setEmail(event.target.value)
            break
        }
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!username || !firstName || !lastName || !email || !password || !passwordRepeated) {
            setErrorMessage('ERROR: Make sure all fields are populated')
            setShowErrorMessage(true)
            return
        }
      
        if (password !== passwordRepeated) {
            setErrorMessage("ERROR: Passwords don't match!")
            setShowErrorMessage(true)
        }

        const payload: Payload = {
            username,
            firstName,
            lastName,
            email,
            password
        }

        const body = JSON.stringify(payload);
        let response: any;

        try {
            response = await fetch("http://localhost:8888/api/user/register", {
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
        
        const data: ResponseData = await response.json();
        if (response.ok) {
            if(data.error){
                setErrorMessage(data.error);
                setShowErrorMessage(true);
                return;
            }else{
                router.push("/login");
            }
        } else {
            setErrorMessage('There was an error submitting the form');
            setShowErrorMessage(true);
        }
    }

    return (
        <div className={styles.LoginPage}>
            <div className={styles.LoginForm}>
                <h2>Create new account</h2>
                <form onSubmit={onSubmit}>
                    <div className={styles.LoginFormInputs}>
                        <div>
                            <label htmlFor='usernameInput'>Username: </label>
                            <input type={'text'} id='usernameInput' onChange={getInputValue(InputType.USERNAME)}></input>
                        </div>
                        <div>
                            <label htmlFor='firstNameInput'>First name: </label>
                            <input type={'text'} id='firstNameInput' onChange={getInputValue(InputType.FIRSTNAME)}></input>
                        </div>
                        <div>
                            <label htmlFor='lastNameInput'>Last name: </label>
                            <input type={'text'} id='lastNameInput' onChange={getInputValue(InputType.LASTNAME)}></input>
                        </div>
                        <div>
                            <label htmlFor='emailInput'>Email adress: </label>
                            <input type={'text'} id='emailInput' onChange={getInputValue(InputType.EMAIL)}></input>
                        </div>
                        <div>
                            <label htmlFor='passwordInput'>Password: </label>
                            <input type={'password'} id='passwordInput' onChange={getInputValue(InputType.PASSWORD)}/>
                        </div>
                        <div>
                            <label htmlFor='repeatPasswordInput'>Repeat password: </label>
                            <input type={'password'} id='repeatPasswordInput' onChange={getInputValue(InputType.REPEATPASSWORD)}></input>
                        </div>
                    </div>
                    <div className={`${styles.ErrorMessages} ${errorMessagesClass}`}>
                        <p>{errorMessage}</p>
                    </div>
                    <button>Create new account</button>
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