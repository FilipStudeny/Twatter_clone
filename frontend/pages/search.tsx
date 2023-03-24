import SearchedPost from '@/components/search/SearchedPost'
import SearchedUser from '@/components/search/SearchedUser'
import styles2 from '../styles/404.module.css';

import React, { MouseEventHandler, ReactElement, useState } from 'react'

import style from '../styles/Search.module.css'

interface UserData{
    '_id': string,
    'username': string,
    'profile_pic': string
}

const Search = () => {

    const [searchedData, setSearchedData] = useState<String>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>();

    const setSearchOption = (searchFor: String) => {

        let searchOption = '';
        if(searchFor == 'POSTS'){
            searchOption = 'POSTS';
        }else{
            searchOption = 'USERS';
        }

        setSearchedData(searchOption); 
    }

    const fetchUsers = async() => {
        setIsLoading(true);

       

        const payload = { 
            'token': localStorage.getItem('token'),
        }

        const response = await fetch('http://localhost:8888/api/user/users', {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + payload.token
            },
        })
        const data: UserData = await response.json();
        setData(data)

        setIsLoading(false);
    }


    return (
        <>
            <div className={style.SearchBarContainer}>
                <div className={style.SearchContainer}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input className={style.SearchBar} type={'text'} placeholder='Search...'/>

                </div>
                <div className={style.SearchOptions}>
                    <button className={searchedData === 'USERS' ? style.Selected : style.NotSelected} id='usersOption' onClick={() => {setSearchOption('USERS'), fetchUsers()}}>Users</button>
                    <button className={searchedData === 'POSTS' ? style.Selected : style.NotSelected}  id='postsOption' onClick={() => setSearchOption('POSTS')}>Posts</button>
                </div>

            </div>
            <div className="ContentContainer">
                {
                    isLoading &&
                    <>
                        <div className={styles2.NotFound}>
                            <h1>Loading posts...</h1>
                        </div>                    
                    </>
                }
                { !isLoading && searchedData === 'USERS' && data.map((user: UserData, index: string) => (
                    <SearchedUser 
                        key={index}
                        _id={user._id}
                        username={user.username}
                        profile_pic={user.profile_pic}
                    />
                ))}

                { !isLoading && searchedData === 'POSTS' &&
                    <SearchedPost creator="User1" postTitle="Post1"/>
                }
            </div>
        </>
    )
}

export default Search