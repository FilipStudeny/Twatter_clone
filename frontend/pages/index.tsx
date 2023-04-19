import Head from 'next/head'
import { useContext, useEffect, useState } from 'react';
import Post, { PostData } from '../components/Post';
import styles from '../styles/HomePage.module.css'
import styles2 from '../styles/404.module.css'
import { UserSessionContext } from '@/components/context/UserSession';



const Home = () => {

    const [newPostBody, setNewPostBody] = useState<any>();
    const [posts, setPosts] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userSessionData = useContext(UserSessionContext);

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
            setPosts([newPost, ...posts]); // add the new post to the beginning of the posts array
            
            let textArea = (document.getElementById("NewPostForm") as HTMLTextAreaElement);
            textArea.value = "";
            textArea.style.height = "80px";

            setNewPostBody("");

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        const fetchPosts = async () => {
            setIsLoading(true);
            const payload = { 
                'token': userSessionData.token,
            }

            const response = await fetch('http://localhost:8888/api/post/allPosts', {
                method: "GET",
                headers: {
                    "Authorization": 'Bearer ' + payload.token
                },
            })

            const data: any = await response.json();

            setIsLoading(false);
            setPosts(data);
        }

        fetchPosts();
    }, []);
  
    return (
        <>
            <Head>
                <title>Kiwi | Home page</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.NewPostContainer}>
                <h2 className={styles.NewFormTitle}>Create new post: </h2>
                <form className={styles.Form} onSubmit={onSubmit}>
                    <textarea id='NewPostForm' onChange={changeFormHeight}/>
                    <div className={styles.FormToolBar}>
                        <div>
                            <button>Image</button>
                        </div>

                        <button className={styles.PostButton}>Create new post</button>
                    </div>
                </form>
            </div>
                    
            <div id='PostsContainer'>
                {
                    isLoading &&
                    <>
                        <div className={styles2.NotFound}>
                            <h1>Loading posts...</h1>
                        </div>                    
                    </>
                }
                { !isLoading && posts.map((post: PostData, index: string) => (
                    <Post 
                        key={index}
                        _id={post._id}
                        post_creator={post.post_creator} 
                        post_content={post.post_content} 
                        likes={post.likes}
                        replies={post.replies}
                        createdAt={post.createdAt}
                        type='POST'
                    />
                ))}
            </div>
        </>
    )
}

export default Home