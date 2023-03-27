
import { UserSessionContext } from '@/components/context/UserSession';

import React, { useCallback, useContext, useEffect, useState } from 'react'
import style from '../../styles/Profile.module.css'
import styles2 from '../../styles/404.module.css'
import modalStyle from '../../styles/Modal.module.css';

import Post, { PostDataProps as PostData} from '../../components/Post';
import { Comment } from '@/components/Comment';
import { useRouter } from 'next/router';
import Modal from '@/components/modal/Modal';
import ReactCrop, { Crop } from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";

enum DataToFetch {
    Posts = "Posts",
    Comments = "Comments"
}

interface CommentData{
    '_id': string,
    'creator': {
        'username': string,
        '_id': string
    },
    'comment': string,
    'isOwner': boolean,
    'createdAt': string,
    'post_id': string
}

const Profile = () => {

    const [searchOption, setPostsSearch] = useState<String>('POSTS'); 
    const userSessionData = useContext(UserSessionContext);
    const [data, setData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const router = useRouter();

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const openModal = (state: boolean) => {
        setModalIsOpen(state)

        if(!state){
            setSrc("")

        }
    }

    const setSearchOption = (searchFor: DataToFetch) => {
        let searchOption = '';
      
        if (searchFor === DataToFetch.Posts) {
          searchOption = 'POSTS';
          fetchData(DataToFetch.Posts);
        } else {
          searchOption = 'COMMENTS';
          fetchData(DataToFetch.Comments);
        }
      
        setPostsSearch(searchOption); 
    };

    const fetchData = async (dataToFetch: DataToFetch) => {
        setIsLoading(true);
        const payload = { 
          'token': localStorage.getItem('token'),
          'userID': userSessionData.user_id
        }
        
        let url = `http://localhost:8888/api/post/allPosts?userID=${payload.userID}`;
        if (dataToFetch === DataToFetch.Comments) {
            url = `http://localhost:8888/api/post/${payload.userID}/allComments`;
        }
      
        const response = await fetch(url, {     
          method: "GET",
          headers: {
            "Authorization": 'Bearer ' + payload.token
          },
        });
        
        const data: any = await response.json();
        setIsLoading(false);
        setData(data);
    }
 
    useEffect(() => {
        fetchData(DataToFetch.Posts);
    }, [])

    const getProfileID = useCallback(() => {
        return router.query.username
    }, [router.query.username])
    
    useEffect(() => {
        const userID = getProfileID();
    
        if (userID === userSessionData.user_id) {
            setIsOwner(true)
        }

    }, [getProfileID, userSessionData.user_id]);
    const renderComment = (_id:string, comment:string, createdAt:string, postID:any) => {
        const isOwner = userSessionData.user_id === userSessionData.user_id
        return(
            <Comment
                key={_id}
                _id={_id}
                creator={{
                    'username': userSessionData.username,
                    '_id': userSessionData.user_id
                }}
                comment={comment}
                isOwner={isOwner}
                createdAt={createdAt}
                postID={postID}
            />
        )
    }

    const [profilePicture, setProfilePicture] = useState<any>(); 
    const [src, setSrc] = useState<string>("");
    const [crop, setCrop] = useState<any>({
        unit: 'px',
        width: 50,
        height: 50,
        x: 25,
        y: 25,
        aspect: 1 / 1,
        circularCrop: true
    });
    const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Url = event.target?.result as string;
          setSrc(base64Url);
        };
        reader.readAsDataURL(file);
    };
    
    const handleCropChange = (crop: Crop) => {
        setCrop(crop);
    };
    
    const handleCropComplete = (crop: Crop) => {
        if (!src) return;
    
        const image = new Image();
        image.src = src;
    
        const canvas = document.createElement("canvas");
        canvas.width = crop.width ?? 0;
        canvas.height = crop.height ?? 0;
    
        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(
            image,
            crop.x ?? 0,
            crop.y ?? 0,
            crop.width ?? 0,
            crop.height ?? 0,
            0,
            0,
            crop.width ?? 0,
            crop.height ?? 0
          );
    
          const croppedImageUrl = canvas.toDataURL("image/png");
          setCroppedImageUrl(croppedImageUrl);
        }
      
    };
    
    console.log(croppedImageUrl)

    return (
        <>
            { modalIsOpen && 
                <Modal onCancel={() => {openModal(!modalIsOpen); setProfilePicture("")}}>
                    <div className={modalStyle.ModalHeader}>
                        <h2 className={modalStyle.ModalTitle}>Profile picture editor</h2>
                        <button className={modalStyle.CloseButton} onClick={() => {openModal(!modalIsOpen);  setProfilePicture("")}}>
                            <i className="fa-solid fa-xmark"></i>                      
                        </button>
                    </div>
                    <div className={modalStyle.ModalContent}>
                        <div>
                            <input id='imageInput' className={modalStyle.ImageInput} type={'file'} onClick={(e:any) => {
                                e.stopPropagation();
                            }} onChange={(e:any) => { handleFileChange(e); }}></input>

                            { !src &&
                                <label htmlFor='imageInput'>
                                    <div className={modalStyle.ImageContainer}>
                                        <i className="fa-solid fa-upload"></i>
                                    </div>
                                </label> 
                            } 
                            { src && 
                                <div className={modalStyle.ImageContainer}>
                                    <ReactCrop crop={crop} onComplete={handleCropComplete} onChange={handleCropChange}>
                                        <img src={src}/>
                                    </ReactCrop>
                                </div>
                               
                            }     
                            { croppedImageUrl &&

                                <div className={modalStyle.ImageContainer}>
                                    <img src={croppedImageUrl} alt="Cropped Image"/>
                                </div>
                            }              
                        </div>
                    </div>
                    <div className={modalStyle.ModalFooter}>
                        <button>Update profile picture</button>
                    </div>
                </Modal>
            }

            <div>
                <div className={style.ProfileHeader}>
                    <div className={style.ProfileBackgroundPicture}>
                        {   isOwner &&
                            <button className={style.BackgroundPictureCoverPhotoButton}>
                                <i className={`fa-solid fa-camera ${style.CameraCover}`}></i>
                            </button>
                        }
                    </div>
                    <div className={style.ProfileHeaderData}>
                        <div className={style.UserData}>
                            <div className={style.ProfilePictureContainer}>
                                <img className={style.ProfilePicture} src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                                {   isOwner &&
                                    <button onClick={() => openModal(!modalIsOpen)} className={style.ProfilePictureCoverPhotoButton}>
                                        <i className={`fa-solid fa-camera ${style.CameraCover}`}></i>
                                    </button>
                                }
                            </div>
                            <h2>@{userSessionData.username}</h2>
                        </div>
                        <div className={style.ProfileOptions}>
                            <button>
                                <i className="fa-solid fa-message"></i>
                            </button>
                            <button>Follow</button>
                        </div>
                    </div>
                </div>


                <div className={style.ProfileData}>
                    <h2>Following: 10000</h2>
                    <h2>Followers: 10000</h2>
                </div>
                <div className={style.UserContent}>
                    <div className={style.SearchOptions}>
                        <button className={searchOption === DataToFetch.Posts ? style.Selected : style.NotSelected}  id='postsOption' onClick={() => setSearchOption(DataToFetch.Posts)}>Posts</button>
                        <button className={searchOption === DataToFetch.Comments ? style.Selected : style.NotSelected} id='usersOption' onClick={() => setSearchOption(DataToFetch.Comments)}>Comments</button>
                    </div>
                    <div className="ContentContainer">
                        {
                            isLoading && 
                            <>
                                <div className={styles2.NotFound}>
                                    <h1>Fetching data...</h1>
                                </div>                    
                            </>
                        }

                        { !isLoading && searchOption === 'POSTS' && data.map((post: PostData, index: string) => (
                            <Post 
                                key={index}
                                _id={post._id}
                                post_creator={post.post_creator} 
                                post_content={post.post_content} 
                                likes={post.likes}
                                replies={post.replies}
                                createdAt={post.createdAt}
                                type='POST'
                                isOwner={userSessionData.user_id === post.post_creator._id}
                            />
                        ))}

                        { !isLoading  && searchOption === 'COMMENTS' && data.map((comment: CommentData) => (
                            renderComment(comment._id, comment.comment, comment.createdAt, comment.post_id)              
                        ))}

                    </div>
                </div>

            </div>
            
        </>
    )
}

export default Profile