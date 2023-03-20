import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/SinglePost.module.css'


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

interface PostData {
    '_id': string,
    'post_content': string,
    'post_creator': {
      'id': string,
      'username': string
    },
    'likes': [],
    'replies': [],
    'createdAt': string,
}

const Post = () => {
    const [newPostBody, setNewPostBody] = useState<any>();

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
    

    //let timestamp = timeDifference(new Date(), new Date(post_creation_time));

    let timestamp = "10:10";
    let post_id = 12;
    let post_creator = "admin";
    let username = "admin"

    const changeFormHeight = () => {

        let textArea = (document.getElementById("NewPostForm") as HTMLTextAreaElement);
        const numOfRows = textArea.value.split('\n').length;        

        if(textArea.value == ""){
            textArea.style.height = "80px";
        }

        switch (true) {
            case (numOfRows >= 7):
                textArea.style.height = "200px";
                break;
            case (numOfRows >= 3):
                textArea.style.height = "150px";
                break;
            default:
                textArea.style.height = "80px";
                break;
        }

        setNewPostBody(textArea.value)
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        if(newPostBody != "" && newPostBody != undefined){
            createNewPost()
        }
    }

    const createNewPost = async () => {
        const payload = { 
            'token': localStorage.getItem('token'),
            'post_body': encodeURIComponent(newPostBody)
        }
        
        const body = JSON.stringify(payload);
        try {
            const response = await fetch("http://localhost:8888/api/post/new", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + payload.token
                },
                body: body,
            })
            const newPost: PostData = await response.json();
            let textArea = (document.getElementById("NewPostForm") as HTMLTextAreaElement);
            textArea.value = "";
            textArea.style.height = "80px";

            setNewPostBody("");

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div key={post_id} className={styles.Post}>
                <Link href={`/profile/${username}`} className={styles.PostHeader}>
                    <Image className={styles.PostUserImage} src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                    <div>
                        <h2>{username}</h2>
                        <h3>{timestamp}</h3>
                    </div>
                </Link>

                <div className={styles.PostBody}>
                    asdasdssadasdsa asd ad awd as das dad
                    
                </div>
                
                <div className={styles.PostFooter}>
                    <div className={styles.PostUserButtons}>
                        <button className={styles.LikeButton}>
                            <i className="fa-solid fa-heart">12</i>
                        </button>
                        <button className={styles.CommentButton}>
                            <i className="fa-solid fa-comment">32</i>
                        </button>
                    </div>
                    <button className={styles.DeletePostButton}>Delete</button>
                </div>
            </div>

            <div className={styles.NewPostContainer}>
                <Image src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                <form className={styles.Form} onSubmit={onSubmit}>
                    <textarea id='NewPostForm' onChange={changeFormHeight}/>
                    <div className={styles.FormToolBar}>
                        <button>Post</button>
                    </div>
                </form>
            </div>

            <div>
            <div key={post_id} className={styles.Post}>
                <Link href={`/profile/${username}`} className={styles.PostHeader}>
                    <Image className={styles.PostUserImage} src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                    <div>
                        <h2>{username}</h2>
                        <h3>{timestamp}</h3>
                    </div>
                </Link>

                <div className={styles.PostBody}>
                    asdasdssadasdsa asd ad awd as das dad
                    
                </div>
                
                <div className={styles.PostFooter}>
                    <div className={styles.PostUserButtons}>
                        <button className={styles.LikeButton}>
                            <i className="fa-solid fa-heart">12</i>
                        </button>
                        <button className={styles.CommentButton}>
                            <i className="fa-solid fa-comment">32</i>
                        </button>
                    </div>
                    <button className={styles.DeletePostButton}>Delete</button>
                </div>
            </div>
            <div key={post_id} className={styles.Post}>
                <Link href={`/profile/${username}`} className={styles.PostHeader}>
                    <Image className={styles.PostUserImage} src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                    <div>
                        <h2>{username}</h2>
                        <h3>{timestamp}</h3>
                    </div>
                </Link>

                <div className={styles.PostBody}>
                    asdasdssadasdsa asd ad awd as das dad
                    
                </div>
                
                <div className={styles.PostFooter}>
                    <div className={styles.PostUserButtons}>
                        <button className={styles.LikeButton}>
                            <i className="fa-solid fa-heart">12</i>
                        </button>
                        <button className={styles.CommentButton}>
                            <i className="fa-solid fa-comment">32</i>
                        </button>
                    </div>
                    <button className={styles.DeletePostButton}>Delete</button>
                </div>
            </div>

            </div>
        </>
    )
}

export default Post