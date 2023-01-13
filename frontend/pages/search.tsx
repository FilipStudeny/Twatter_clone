import Image from 'next/image'
import Link from 'next/link'
import React, { MouseEventHandler, ReactElement, useState } from 'react'
import { PageWithLayout } from '../components/Layouts/LayoutConfig'
import MainLayout from '../components/Layouts/MainLayout'
import SearchedPost from '../components/Search/SearchedPost'
import SearchedUser from '../components/Search/SearchedUser'

import style from '../styles/Search.module.css'

const Search: PageWithLayout = () => {

    const [searchPosts, setPostsSearch] = useState<String>();

    const setSearchOption = (searchFor: String) => {

        let searchOption = '';
        if(searchFor == 'POSTS'){
            searchOption = 'POSTS';
        }else{
            searchOption = 'USERS';
        }

        console.log(searchOption);
        setPostsSearch(searchOption); 

    }


    return (
        <>
            <div className={style.SearchBarContainer}>
                <div className={style.SearchContainer}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input className={style.SearchBar} type={'text'} placeholder='Search...'/>

                </div>
                <div className={style.SearchOptions}>
                    <button className={searchPosts === 'USERS' ? style.Selected : style.NotSelected} id='usersOption' onClick={() => setSearchOption('USERS')}>Users</button>
                    <button className={searchPosts === 'POSTS' ? style.Selected : style.NotSelected}  id='postsOption' onClick={() => setSearchOption('POSTS')}>Posts</button>
                </div>

            </div>
            <div className="ContentContainer">

                {searchPosts === 'USERS' &&
                    <SearchedUser creator="niky"/>
                }

                {searchPosts === 'POSTS' &&
                    <SearchedPost creator="User1" postTitle="Post1"/>
                }
            </div>
        </>
    )
}

Search.getLayout = function getLayout(page: ReactElement){
    return(
        <MainLayout>
            {page}
        </MainLayout>
    )
}


export default Search