import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const UserSessionHook = () => {

    const [username, setUsername] = useState<any>();
    const [loggedIn, setIsLoggedIn] = useState<any>();

    const router = useRouter();

    const login =  useCallback(() => {


        const name = "Admin";
        const loggedIn = true;



        localStorage.setItem('userData', JSON.stringify({
            username: name,
            loggedIn: loggedIn
        }));

        
        setUsername(name);
        setIsLoggedIn(loggedIn);

    }, [])


    const loggout = useCallback(() => {


        const name = "";
        const loggedIn = false;


        localStorage.removeItem('userData');


        
        setUsername(name);
        setIsLoggedIn(loggedIn);

        router.push("/login");


    }, [router])

    return{ username, loggedIn, login, loggout }
}


export default UserSessionHook;