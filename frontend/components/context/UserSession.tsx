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
}

const UserSessionContext = createContext<IUserSessionContext>({
  isLoggedIn: false,
  username: '',
  login: () => {},
  logout: () => {}
});

const UserSessionProvider = () => {
    const [username, setUsername] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const router = useRouter();
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
    
      if (token && userData) {
        const parsedData: LoginData = JSON.parse(userData);
        setUsername(parsedData.username);
        setIsLoggedIn(true);

        console.log(parsedData)
      } 
    
    }, []);
  
    const login = (data: LoginData) => {
      const userData: LoginData = data;
  
      setUsername(userData.username);
      setIsLoggedIn(true)
  
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userData', JSON.stringify(userData));
  
      router.push("/");
    };
  
    const logout = () => {
      const name = "";
      const loggedIn = false;
    
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    
      setUsername(name);
      setIsLoggedIn(loggedIn);
    }
  
    return { username, isLoggedIn, login, logout}
};

export { UserSessionProvider, UserSessionContext };
