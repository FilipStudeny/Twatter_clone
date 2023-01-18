import { createContext } from 'react'

const UserSession = createContext({

    'isLoggedIn': false,
    'username': '',

    'login': () => {

    },

    'loggout': () => {

    }

})

export default UserSession