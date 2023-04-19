import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/Comment.module.css'
import { UserSessionContext } from './context/UserSession'

export interface Comment{
    '_id': string,
    'comment': string,
    'creator': {
        '_id': string
        'username': string,
        'profilePicture': string
    },
    'createdAt': string,
    'postID'?:string
}

export const Comment = ({ _id, creator, comment, createdAt, postID } : Comment) => {

    const [isOwner, setIsOwner] = useState<boolean>(false)
    const userSessionData = useContext(UserSessionContext);

    const likeButtonHeight = !isOwner ? styles.fullHeight : '';
    const deletButtonHeight = isOwner ? styles.fullHeight  : '';
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
    
    let timestamp = timeDifference(new Date(), new Date(createdAt));

    const deleteComment = async() => {
        
        const payload = { 
            'token': localStorage.getItem('token'),
        }
    
        await fetch(`http://localhost:8888/api/post/${postID}/comment/${_id}`, {
            method: "DELETE",
            headers: {
                "Authorization": 'Bearer ' + payload.token
            }
        })

        router.reload()
    }

    useEffect(() => {
        setIsOwner(userSessionData.userId === creator._id)
    }, [])
    

    return (
        <div className={styles.Comment}>
            <Link href={`/profile/${creator._id}`} className={styles.CommentLeftBody}>
                <Image className={styles.UserImage}  src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                <div>
                    <h2 className={styles.UserName}>{creator.username}</h2>
                </div>

            </Link>

            <div className={styles.CommentBody}>
                <p>
                    {decodeURIComponent(comment)}
                </p>
                <h3 className={styles.TimeStamp}>{timestamp}</h3>
            </div>
            
            <div className={styles.CommentToolbar}>
                { !isOwner &&
                    <button className={`${styles.LikeButton} ${likeButtonHeight}`}>
                        <i className="fa-solid fa-heart"></i>
                    </button>
                }
                
                { isOwner && 
                    <button onClick={deleteComment}  className={`${styles.DeleteButton} ${deletButtonHeight}`}>
                        <i className="fa-solid fa-trash-can"></i>
                    </button>
                }
            </div>
        </div>
    )
}
