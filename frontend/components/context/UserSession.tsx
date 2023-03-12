import { createContext } from 'react'

interface LoginData {
    "token": string, 
    "user_id": string,
    "username": string,
    "first_name": string,
    "last_name": string,
    "profile_picture": string
}

const UserSession = createContext({

    'isLoggedIn': false,
    'username': "",

    'login': (data: LoginData) => {

    },

    'loggout': () => {

    }

})

export default UserSession