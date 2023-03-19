import React from 'react'
import Image from 'next/image'
import styles from '../styles/Post.module.css'

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

    return (
        <div key={post_id} className={styles.Post} id={post_id}>
            <div className={styles.PostHeader}>
                <Image src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                <div>
                    <h1>{post_creator.username}</h1>
                    <h2>{timestamp}</h2>
                </div>
            </div>

            <div className={styles.PostContent}>
                <p>{post_body}</p>
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