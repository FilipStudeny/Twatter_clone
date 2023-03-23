import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import styles from '../styles/Comment.module.css'

interface CommentProps{
    '_id': string,
    'creator': {
        'username': string,
        '_id': string
    },
    'comment': string
}

export const Comment = () => {
    const [isOwner, setIsOwner] = useState<boolean>(false);

    
    const likeButtonHeight = !isOwner ? styles.fullHeight : '';
    const deletButtonHeight = isOwner ? styles.fullHeight  : '';

    return (
        <div className={styles.Comment}>
            <Link href='/profile/#' className={styles.CommentLeftBody}>
                <Image className={styles.UserImage}  src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                <div>
                    <h2 className={styles.UserName}>admin</h2>
                    <h3 className={styles.TimeStamp}>Just now</h3>
                </div>
            </Link>

            <div className={styles.CommentBody}>
                
            </div>
            
            <div className={styles.CommentToolbar}>
                { !isOwner &&
                    <button className={`${styles.LikeButton} ${likeButtonHeight}`}>
                        <i className="fa-solid fa-heart"></i>
                    </button>
                }
                
                { isOwner && 
                    <button className={`${styles.DeleteButton} ${deletButtonHeight}`}>
                        <i className="fa-solid fa-trash-can"></i>
                    </button>
                }
            </div>
        </div>
    )
}
