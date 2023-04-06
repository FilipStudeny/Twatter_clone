import { UserSessionContext } from '@/components/context/UserSession';

import React, { HTMLInputTypeAttribute, useCallback, useContext, useEffect, useRef, useState } from 'react'
import style from '../../styles/Profile.module.css'
import styles2 from '../../styles/404.module.css'
import modalStyle from '../../styles/Modal.module.css';

import Post, { PostDataProps as PostData} from '../../components/Post';
import { Comment } from '@/components/Comment';
import { useRouter } from 'next/router';
import Modal from '@/components/modal/Modal';
import ReactCrop, { Crop } from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";
import Head from 'next/head';

import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import Image from 'next/image';

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
    const [newImage, setNewImage] = useState<string>("");
    const [croppedImage, setCroppedImage] = useState("/#");
    const cropperRef = useRef<any>();


    const [username, setUsername] = useState<string>("");
    const [userID, setUserID] =  useState<any>("");
    const [profilePictureName, setPorfilePictureName] =  useState<any>("");
    const [profilePicture, setPorfilePicture] =  useState<any>("");


    const openModal = (state: boolean) => {
        setModalIsOpen(state)

        if(!state){
            setNewImage("");
            setCroppedImage("");

        }
    }

    const setSearchOption = (searchFor: DataToFetch, ) => {
        let searchOption = '';
      
        if (searchFor === DataToFetch.Posts) {
          searchOption = 'POSTS';
          fetchData(DataToFetch.Posts, userID);
        } else {
          searchOption = 'COMMENTS';
          fetchData(DataToFetch.Comments, userID);
        }
      
        setPostsSearch(searchOption); 
    };

    const fetchData = async (dataToFetch: DataToFetch, userID: any) => {
        setIsLoading(true);
        const payload = { 
          'token': localStorage.getItem('token'),
          'userID': userID
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

    const fetchUserData = async (userID: any) => {
        setIsLoading(true);

        let url = `http://localhost:8888/api/user/user/${userID}`;
        
        const response = await fetch(url, {     
          method: "GET",
        });
        
        const data: any = await response.json();
        setUsername(data.username)
        setPorfilePictureName(data.profilePicture)

        setIsLoading(false);


    }

    useEffect(() => {
        fetchProfilePicture()
    }, []);

      
    const fetchProfilePicture = async () => {

        console.log(profilePictureName)
        
        let url = `http://localhost:8888/api/user/uploads/users/${profilePictureName}`;
     
        const response = await fetch(url, {     
          method: "GET",
        });

        setPorfilePicture(response);
        console.log(response);


    }

    const getProfileID = useCallback(() => {
        return router.query.username
    }, [router.query.username])
    
    useEffect(() => {
        const userID = getProfileID();
        setUserID(userID);
    
        if (userID === userSessionData.user_id) {
            setIsOwner(true)
        }

        fetchUserData(userID)
        fetchData(DataToFetch.Posts, userID);
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


    const handleImageUpload = (e: any) => {
        e.preventDefault();
        let files;

        if(e.dataTransfer){
            files = e.dataTransfer.files;
        }else if(e.target){
            files = e.target.files;
        }

        const reader: FileReader = new FileReader();
        reader.onload = () => {
            setNewImage(reader.result as any)
        };
        reader.readAsDataURL(files[0]);
        
    };
    
    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            setCroppedImage(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
        }
    };

    const updateProfilePicture = async () => {
        const cropper = cropperRef.current?.cropper;
        const canvas = cropper.getCroppedCanvas();
        
        if(canvas == null){
            alert("Empty area in image cropper.")
            return
        }
      
        canvas.toBlob((imageBlob: any) => {
            const formData = new FormData();
            formData.append("croppedImage", imageBlob);
        
            fetch("http://localhost:8888/api/user/profile/newProfileImage", {
                method: "POST",
                headers: {
                    "Authorization": 'Bearer ' + localStorage.getItem('token')
                },
                body: formData,
                
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
               
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        });
    }
      
      
    return (
        
        <>
            <Head>
                <title>Kiwi | User profile page</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            { modalIsOpen && 
                <Modal onCancel={() => {openModal(!modalIsOpen); setCroppedImage(""); setNewImage("")}}>
                    <div className={modalStyle.ModalHeader}>
                        <h2 className={modalStyle.ModalTitle}>Update your profile picture</h2>
                        <button className={modalStyle.CloseButton} onClick={() => {openModal(!modalIsOpen); setCroppedImage(""); setNewImage("");}}>
                            <i className="fa-solid fa-xmark"></i>                      
                        </button>
                    </div>

                    <div className={modalStyle.ModalContent}>
                        <div>
                            <input id="imageInput" accept="image/*" className={modalStyle.ImageInput}
                                type={'file'} onClick={(e) => { e.stopPropagation(); }}
                                onChange={handleImageUpload}/>
                            {!newImage && 
                                <label htmlFor="imageInput">
                                <div className={modalStyle.ImageContainer}>
                                    <i className="fa-solid fa-upload"></i>
                                </div>
                                </label>
                            }
                        </div>
                        { newImage && 
                            <div className={`${modalStyle.CropperContainer}`}>
                                <Cropper
                                    style={{ height: 400, width: "50%"}}
                                    ref={cropperRef}
                                    zoomTo={0.5}
                                    initialAspectRatio={1}
                                    aspectRatio={1/1}
                                    preview=".img-preview"
                                    src={newImage}
                                    viewMode={1}
                                    minCropBoxHeight={10}
                                    minCropBoxWidth={10}
                                    background={false}
                                    responsive={true}
                                    autoCropArea={1}
                                    checkOrientation={false} 
                                    guides={true}
                                    cropBoxResizable={false}
                                />
                            </div>
                        }

                        {
                            croppedImage && newImage &&
                            <div className={`${modalStyle.CroppedImagesContainer}`}>
                                <img src={`${croppedImage}`} className={modalStyle.CroppedProfilePicLarge} alt="Cropped large profile image" width={180} height={180} />                    
                                <img src={`${croppedImage}`} className={modalStyle.CroppedProfilePicSmall}  alt="Cropped small profile image" width={100} height={100} />                    
                                <img src={`${croppedImage}`} className={modalStyle.CroppedProfilePicSmall}  alt="Cropped small profile image" width={70} height={70} />                    
                            </div> 
                        }
                    </div>
                    {
                        newImage && 
                        <div className={modalStyle.ModalFooter}>
                            <button onClick={getCropData}>Crop Image</button>
                            <button onClick={updateProfilePicture}>Update profile picture</button>
                        </div>
                    }
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
                                <Image className={style.ProfilePicture} src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
                                {   isOwner &&
                                    <button onClick={() => openModal(!modalIsOpen)} className={style.ProfilePictureCoverPhotoButton}>
                                        <i className={`fa-solid fa-camera ${style.CameraCover}`}></i>
                                    </button>
                                }
                            </div>
                            <h2>@{username}</h2>
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