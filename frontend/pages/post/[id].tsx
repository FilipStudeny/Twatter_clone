import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Post.module.css';
import formStyle from '../../styles/HomePage.module.css';
import { useRouter } from 'next/router';
import Post from '@/components/Post';
import { Comment } from '@/components/Comment';


interface CommentData{
    '_id': string,
    'creator': {
        'username': string,
        '_id': string
    },
    'comment': string,
    'isOwner': boolean,
    'createdAt': string,
}

interface PostData {
    'post_creator': {
        'username': string,
        '_id': string
    },
    '_id': string,
    'post_content': string,
    'createdAt': string,
    'comments': {
        '_id': string,
        'username': string
    }
    'likes': [],
    'replies': []
}

const PostDetail = () => {
    const [newComment, setNewComment] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [postData, setPostData] = useState<PostData>();
    const [comments, setComments] = useState<any>([]);

    const userData: any = localStorage.getItem('userData');
    const parsedData = JSON.parse(userData)
    const userID = parsedData.user_id

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
        console.log(comments)
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
    
            const newCommentData: CommentData = await response.json();
    
            // set the isOwner value based on the current user's ID
            const userData: any = localStorage.getItem('userData');
            const parsedData = JSON.parse(userData);
            const userID = parsedData.user_id;
            newCommentData.isOwner = userID === newCommentData.creator._id;
    
            setComments((prevComments: CommentData[]) => [newCommentData, ...prevComments]);    

            let textArea = (document.getElementById("NewPostForm") as HTMLTextAreaElement);
            textArea.value = "";
            textArea.style.height = "80px";
    
            setNewComment("");    
        } catch (error) {
            console.log(error);
        }
    }
    
    const fetchPostData = async (postID: any) => {
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
        setComments(data.comments)
    }

    const getPostID = useCallback(() => {
        return router.query.id
    }, [router.query.id])
    
    
    useEffect(() => {
        const postID = getPostID();
    
        if (postID) {
            fetchPostData(postID);
        }
    }, [getPostID]);

    const renderComment = (_id:string, creator:any, comment:string, createdAt:string, postID:any) => {
        const isOwner = userID === creator._id
        return(
            <Comment
                key={_id}
                _id={_id}
                creator={creator}
                comment={comment}
                isOwner={isOwner}
                createdAt={createdAt}
                postID={postID}
            />
        )
    }
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
                    isOwner={userID === postData.post_creator._id}
                />
            )}

            <div className={`${formStyle.NewPostContainer} ${formStyle.BorderTop}`}>
                <h2 className={formStyle.NewFormTitle}>Create new comment: </h2>
                <form className={formStyle.Form} onSubmit={onSubmit}>
                    <textarea id='NewPostForm' onChange={changeFormHeight}/>
                    <div className={`${formStyle.FormToolBar} ${formStyle.Flex_reverse}`}>
                        <button className={formStyle.PostButton}>Post new comment</button>
                    </div>
                </form>
            </div>

            { !isLoading && comments.map((comment: CommentData) => (
                renderComment(comment._id, comment.creator, comment.comment, comment.createdAt, postData?._id)              
            ))}

        </>
    )
}

export default PostDetail