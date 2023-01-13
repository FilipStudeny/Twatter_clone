import React from 'react'
import Image from 'next/image'
import styles from '../styles/Post.module.css'

function Post() {
  return (
    <div className={styles.Post}>
        <div className={styles.PostHeader}>
            <Image src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
            <div>
                <h1>username</h1>
                <h2>10:22</h2>
            </div>
        </div>

        <div className={styles.PostContent}>
            <p>
                Lorem ipsum sudo lomen duro lomen laros pam saudlo lumeno ite
            </p>
        </div>

        <div className={styles.PostFooter}>
            <div className={styles.PostUserButtons}>
                <button className={styles.LikeButton}>
                    <i className="fa-solid fa-heart"></i>
                </button>
                <button className={styles.CommentButton}>
                    <i className="fa-solid fa-comment"></i>
                </button>
            </div>
            <button className={styles.DeletePostButton}>Delete</button>
        </div>

    </div>
  )
}

export default Post