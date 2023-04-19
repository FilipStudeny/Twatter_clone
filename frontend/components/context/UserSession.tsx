import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export interface LoginData {
    token: string; 
    user_id: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture: string;
}

interface IUserSessionContext {
    isLoggedIn: boolean;
    username: string;
    profilePicture: string | null,
    login: (data: LoginData) => void;
    logout: () => void;
    userId: string,
    token: string,
    setProfilePicture: any

}

const UserSessionContext = createContext<IUserSessionContext>({
    isLoggedIn: false,
    username: '',
    profilePicture: '',
    login: () => {},
    logout: () => {},
    userId: '',
    token: '',
    setProfilePicture: () => {}
});

const UserSessionProvider = () => {
    const [username, setUsername] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [token, setToken] = useState<string>("");

    const router = useRouter();

    useEffect(() => {

        const token = localStorage.getItem('token');
        const storageUserData = localStorage.getItem('userData')

        if(token && storageUserData){
            const userData: LoginData = JSON.parse(storageUserData);

            login(userData);

        }
       
    }, []);
    
    const fetchProfilePicture = async(profilePicture: string) => {

        const url = `http://localhost:8888/api/user/uploads/users/${profilePicture}`
        const response = await fetch(url, {
            method: 'GET'
        });

        if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setProfilePicture(objectUrl);
            localStorage.setItem('profileImage', objectUrl);
        }            
    }

    const login = async (data: LoginData) => {

        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data));
        localStorage.setItem('userID', data.user_id);

        setUsername(data.username);
        setUserId(data.user_id);
        setProfilePicture(data.profile_picture);
        setToken(data.token);
        fetchProfilePicture(data.profile_picture);

        setIsLoggedIn(true);

    };
  
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('userID');
        localStorage.removeItem('profileImage');

        setUsername("");
        setUserId("");
        setProfilePicture(null);
        setToken("");
        setIsLoggedIn(false);

        router.push("/login");

    }
    
    return { username, isLoggedIn, login, logout, userId, profilePicture, token, setProfilePicture }
};

export { UserSessionProvider, UserSessionContext  };
