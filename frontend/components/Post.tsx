import React from 'react'
import Image from 'next/image'
import styles from '../styles/Post.module.css'
import Link from 'next/link'

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
    'type': string
}


const Post = ({post_creator, post_content, _id, createdAt, likes, replies, type} : PostDataProps) => {

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

    return (
        
        <div key={_id} className={styles.Post} id={_id}>
            <Link href={`/profile/${post_creator.username}`} className={styles.PostHeader}>
                <Image className={styles.PostUserImage} src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                <div>
                    <h2>{post_creator.username}</h2>
                    <h3>{timestamp}</h3>
                </div>
            </Link>
            <div className={styles.PostBody}>
                {
                    type == 'POST' &&
                    <Link href={`/post/${_id}`} className={styles.PostLink}>
                        {post_content}
                    </Link>
                }
                {
                    type == 'DETAIL' &&
                    <p className={styles.PostLink}>
                        {post_content}
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
                <button className={styles.DeletePostButton}>Delete</button>
            </div>

        </div>
    )
}

export default Post