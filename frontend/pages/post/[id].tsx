import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Post.module.css';
import formStyle from '../../styles/HomePage.module.css';
import { useRouter } from 'next/router';
import Post from '@/components/Post';
import { Comment } from '@/components/Comment';




interface PostData {
    'post_creator': {
        'username': string,
        '_id': string
    },
    '_id': string,
    'post_content': string,
    'createdAt': string,
    'likes': [],
    'replies': []
}

interface CommentData {
    comment: string,
    creator: string,
    _id: string
}
const PostDetail = () => {
    const [newComment, setNewComment] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [postData, setPostData] = useState<PostData>();
    const [comments, setComments] = useState<any>([]);
    const router = useRouter();

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

        setNewComment(textArea.value)
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        createNewComment();

    }

    const createNewComment = async () => {
        const payload = { 
            'token': localStorage.getItem('token'),
            'newComment': encodeURIComponent(newComment)
        }
        
        const body = JSON.stringify(payload);
        try {
            const response = await fetch(`http://localhost:8888/api/post/${postData?._id}/newComment`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + payload.token
                },
                body: body,
            })

            const newComment: CommentData = await response.json();
            //setPosts([newPost, ...posts]); // add the new post to the beginning of the posts array
            setComments([newComment, ...comments]);

            let textArea = (document.getElementById("NewPostForm") as HTMLTextAreaElement);
            textArea.value = "";
            textArea.style.height = "80px";

            setNewComment("");

        } catch (error) {
            console.log(error);
        }
    }

    const fetchComments = async() => {

    }


   
    const fetchPostData = async () => {
        const postID = router.query.id;

        setIsLoading(true);

        const payload = { 
            'token': localStorage.getItem('token'),
        }

        const response = await fetch(`http://localhost:8888/api/post/post/${postID}`, {
            method: "GET",
            headers: {
                "Authorization": 'Bearer ' + payload.token
            }
        })

        const data: PostData = await response.json();
        setIsLoading(false);
        setPostData(data);
    }

    useEffect(() => {

        fetchPostData();
        
    }, []);

    return (
        <>
            {postData && (
                <Post 
                    key={postData._id}
                    _id={postData._id}
                    post_creator={postData.post_creator} 
                    post_content={postData.post_content} 
                    likes={postData.likes}
                    replies={postData.replies}
                    createdAt={postData.createdAt}
                    type='DETAIL'
                />
            )}

            <div className={`${formStyle.NewPostContainer} ${formStyle.BorderTop}`}>
                <Image src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                <form className={formStyle.Form} onSubmit={onSubmit}>
                    <textarea id='NewPostForm' onChange={changeFormHeight}/>
                    <div className={`${formStyle.FormToolBar} ${formStyle.Flex_reverse}`}>
                        <button>Post</button>
                    </div>
                </form>
            </div>

            <Comment/>

            
        </>
    )
}

export default PostDetail