import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../styles/Post.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { UserSessionContext } from './context/UserSession'

export interface PostData{
    '_id': string,
    'post_content': string,
    'post_creator': {
        'username': string,
        '_id': string,
        'profilePicture': string
    },

    'createdAt': string,
    'likes': [],
    'replies': [],
    'type': string,
}


const Post = ({post_creator, post_content, _id, createdAt, likes, replies, type} : PostData) => {

    const [creatorImage, setCreatorImage] = useState<string>('/images/user_icon.png');
    const router = useRouter();
    const userSessionData = useContext(UserSessionContext);

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
    
    useEffect(() => {

        fetchProfilePicture(post_creator.profilePicture)
 
    }, [])

    return (
        
        <div key={_id} className={styles.Post} id={_id}>
            <Link href={`/profile/${post_creator._id}`} className={styles.PostHeader}>
                <img className={styles.PostUserImage} src={creatorImage} width="512" height="512" alt='User profile image'/>
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
                        <i className="fa-solid fa-comment">{"aasd"}</i>
                    </button>
                </div>

                { post_creator._id === userSessionData.userId &&
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