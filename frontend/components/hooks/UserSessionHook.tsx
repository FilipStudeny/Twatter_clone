import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

interface LoginData {
    "token": string, 
    "user_id": string,
    "username": string,
    "first_name": string,
    "last_name": string,
    "profile_picture": string
}

const UserSessionHook =  () => {

    const [username, setUsername] = useState<any>();
    const [loggedIn, setIsLoggedIn] = useState<any>();
    const router = useRouter();

    useEffect(() => {
        //CHECK IF USER HAS TOKEN
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if(token && userData){
            const parsedData: LoginData = JSON.parse(userData);
            setUsername(parsedData.username);
            setIsLoggedIn(true)
        }

        
    }, [router])

    const login = useCallback((data: LoginData) => {

        const userData: LoginData = data;

        setUsername(userData.username);
        setIsLoggedIn(true)

        localStorage.setItem('token', userData.token);
        localStorage.setItem('userData', JSON.stringify(userData));

        router.push("/");
    }, [router])


    const loggout = useCallback(() => {


        const name = "";
        const loggedIn = false;

        localStorage.removeItem('token');
        localStorage.removeItem('userData');

        setUsername(name);
        setIsLoggedIn(loggedIn);

        router.push("/login");


    }, [router])

    return{ username, loggedIn, login, loggout }
}


export default UserSessionHook;