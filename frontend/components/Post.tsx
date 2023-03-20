import React from 'react'
import Image from 'next/image'
import styles from '../styles/Post.module.css'
import Link from 'next/link'

interface PostDataProps{
    'key': string
    'post_creator': {
        'username': string,
        'id': string
    },
    'post_id': string,
    'post_body': string,
    'post_creation_time': string,
    'likes': [],
    'replies': []
}

const Post = ({post_creator, post_body, post_id, post_creation_time, likes, replies} : PostDataProps) => {

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
    

    let timestamp = timeDifference(new Date(), new Date(post_creation_time));
    console.log(post_id)
    return (
        
        <div key={post_id} className={styles.Post} id={post_id}>
            <Link href={`/profile/${post_creator.username}`} className={styles.PostHeader}>
                <Image className={styles.PostUserImage} src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                <div>
                    <h2>{post_creator.username}</h2>
                    <h3>{timestamp}</h3>
                </div>
            </Link>
            <div className={styles.PostBody}>
                <Link href={`/post/${post_id}`} className={styles.PostLink}>
                    {post_body}
                </Link>
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