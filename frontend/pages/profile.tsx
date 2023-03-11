import UserSession from '@/components/context/UserSession';
import SearchedPost from '@/components/search/SearchedPost';
import SearchedUser from '@/components/search/SearchedUser';
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import style from '../styles/Profile.module.css'

const Profile = () => {

    const [searchOption, setPostsSearch] = useState<String>(); 
    const userSessionData = useContext(UserSession);

    const setSearchOption = (searchFor: String) => {

        let searchOption = '';
        if(searchFor == 'POSTS'){
            searchOption = 'POSTS';
        }else{
            searchOption = 'USERS';
        }

        setPostsSearch(searchOption); 

    }



    return (
        <>
            <div className={style.ProfileContainer}>
                <div className={style.ProfileHeader}>
                    <div className={style.ProfileBackgroundPicture}>
                        <button className={style.BackgroundPictureCoverPhotoButton}>
                            <i className={`fa-solid fa-camera ${style.CameraCover}`}></i>
                        </button>
                    </div>
                    <div className={style.ProfileHeaderData}>
                        <div className={style.ProfilePhotoOptions}>
                            <div className={style.ProfilePictureContainer}>
                                <Image className={style.ProfilePicture} src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                                <button className={style.ProfilePictureCoverPhotoButton}>
                                    <i className={`fa-solid fa-camera ${style.CameraCover}`}></i>
                                </button>
                            </div>
                            <h1>@{userSessionData.username}</h1>
                        </div>
                        <div className={style.ProfileOptions}>
                            <button>
                                <i className="fa-solid fa-message"></i>
                            </button>
                            <button>Follow</button>

                        </div>
                        
                    </div>
                </div>

                <div className={style.ProfileBody}>
                    <h1>Following: 10000</h1>
                    <h1>Followers: 10000</h1>
                </div>
                <div className={style.UserContent}>
                    <div className={style.SearchOptions}>
                        <button className={searchOption === 'USERS' ? style.Selected : style.NotSelected} id='usersOption' onClick={() => setSearchOption('USERS')}>Users</button>
                        <button className={searchOption === 'POSTS' ? style.Selected : style.NotSelected}  id='postsOption' onClick={() => setSearchOption('POSTS')}>Posts</button>
                    </div>
                    <div className="ContentContainer">

                    {searchOption === 'USERS' &&
                        <SearchedUser creator="niky"/>
                  
                    }

                    {searchOption === 'POSTS' &&
                        <SearchedPost creator="User1" postTitle="Post1"/>
                    }
                    </div>
                </div>

            </div>
            
        </>
    )
}

export default Profile