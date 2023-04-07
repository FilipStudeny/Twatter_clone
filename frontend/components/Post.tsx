import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../styles/Post.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { UserSessionContext } from './context/UserSession'

export interface PostDataProps{
    'post_creator': {
        'username': string,
        '_id': string
    },
    '_id': string,
    'post_content': string,
    'createdAt': string,
    'likes': [],
    'replies': [],
    'type': string,
    'isOwner'?: boolean
}


const Post = ({post_creator, post_content, _id, createdAt, likes, replies, type, isOwner} : PostDataProps) => {
    const [creatorImage, setCreatorImage] = useState<string>('/images/user_icon.png');
    const router = useRouter();


    function timeDifference(current: any, previous: any): string {
        const intervals = {
            year: 31536000,
            month: 2592000,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
        };
        const secondsElapsed = Math.floor((current - previous) / 1000);
        for (const [key, value] of Object.entries(intervals)) {
            const count = Math.floor(secondsElapsed / value);
            if (count >= 1) {
                return count === 1 ? `1 ${key} ago` : `${count} ${key}s ago`;
            }
        }
        return "Just now";
    }

    const deletePost = async() => {
        
        const payload = { 
            'token': localStorage.getItem('token'),
        }
    
        await fetch(`http://localhost:8888/api/post/${_id}/delete`, {
            method: "DELETE",
            headers: {
                "Authorization": 'Bearer ' + payload.token
            }
        })

        if(router.pathname === "/"){
            router.reload()
        }else{
            router.push("/")
        }
    }

    let timestamp = timeDifference(new Date(), new Date(createdAt));

    const fetchUserData = async (userID: any) => {
      
        try {
            const userDataUrl = `http://localhost:8888/api/user/user/${userID}`;
            const userDataResponse = await fetch(userDataUrl, { method: 'GET' });
            const userData = await userDataResponse.json();

            fetchProfilePicture(userData.profilePicture)

        } catch (error) {
            console.error(error);
        }
    };
      
    const fetchProfilePicture = async(profilePicture: string) => {

        const url = `http://localhost:8888/api/user/uploads/users/${profilePicture}`
        const response = await fetch(url, {
            method: 'GET'
        });
    
        if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const imageType = typeof objectUrl;
            if (imageType === 'string') {
                setCreatorImage(objectUrl);
            }
        }            
    }
    

    const userSessionData = useContext(UserSessionContext);

    useEffect(() => {

        console.log("user ID" + localStorage.getItem('userID'));
        console.log("Post ID" + post_creator._id)
        console.log(isOwner)

        const storageUserData = localStorage.getItem('userData')
        if(storageUserData){
            const userData = JSON.parse(storageUserData);

            if (isOwner){
                setCreatorImage(`${userData.profile_picture}`)
            }else{
                fetchUserData(post_creator._id);
            }
        }
        
    }, [])

    return (
        
        <div key={_id} className={styles.Post} id={_id}>
            <Link href={`/profile/${post_creator._id}`} className={styles.PostHeader}>
                <Image className={styles.PostUserImage} src={creatorImage} width="512" height="512" alt='User profile image'/>
                <div>
                    <h2>{post_creator.username}</h2>
                    <h3>{timestamp}</h3>
                </div>
            </Link>
            <div className={styles.PostBody}>
                {
                    type == 'POST' &&
                    <Link href={`/post/${_id}`} className={`${styles.PostLink} ${styles.hiddenText}`}>
                        {decodeURIComponent(post_content)}
                    </Link>
                }
                {
                    type == 'DETAIL' &&
                    <p className={styles.PostLink}>
                        {decodeURIComponent(post_content)}
                    </p>
                }
            </div>
            
            <div className={styles.PostFooter}>
                <div className={styles.PostUserButtons}>
                    <button className={styles.LikeButton}>
                        <i className="fa-solid fa-heart">{likes}</i>
                    </button>
                    <button className={styles.CommentButton}>
                        <i className="fa-solid fa-comment">{replies}</i>
                    </button>
                </div>

                { isOwner &&
                    <button onClick={deletePost} className={styles.DeletePostButton}>
                        Delete
                        <i className="fa-solid fa-trash-can"></i>
                    </button>
                }
            </div>

        </div>
    )
}

export default Post