import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface LoginData {
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
  login: (data: LoginData) => void;
  logout: () => void;
  user_id: string,
}

const UserSessionContext = createContext<IUserSessionContext>({
  isLoggedIn: false,
  username: '',
  login: () => {},
  logout: () => {},
  user_id: ''
});

const UserSessionProvider = () => {
    const [username, setUsername] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user_id, setUserId] = useState<string>("");
    const router = useRouter();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
    
      if (token && userData) {
        const parsedData: LoginData = JSON.parse(userData);
        setUsername(parsedData.username);
        setUserId(parsedData.user_id)
        setIsLoggedIn(true);
      } 
    
    }, []);
  
    const login = (data: LoginData) => {
      const userData: LoginData = data;
  
      setUsername(userData.username);
      setUserId(userData.user_id);
      setIsLoggedIn(true)
  
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userData', JSON.stringify(userData));
  
      router.push("/");
    };
  
    const logout = () => {

      localStorage.removeItem('token');
      localStorage.removeItem('userData');

      setUserId("");
      setUsername("");
      setIsLoggedIn(false);
    }
  
    return { username, isLoggedIn, login, logout, user_id}
};

export { UserSessionProvider, UserSessionContext };
