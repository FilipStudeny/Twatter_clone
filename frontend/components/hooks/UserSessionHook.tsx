import { useCallback, useEffect, useState } from "react";

const UserSessionHook = () => {

    const [username, setUsername] = useState<any>();
    const [loggedIn, setIsLoggedIn] = useState<any>();

    const login = useCallback(() => {
        setUsername('Admin');
        setIsLoggedIn(true);

    }, [])


    const loggout = useCallback(() => {
        setUsername('');
        setIsLoggedIn(false);

    }, [])

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData') || '{}');

        if(storedData){
            console.log(storedData);
        }

    },[login])

    return{ username, loggedIn, login, loggout }
}


export default UserSessionHook;