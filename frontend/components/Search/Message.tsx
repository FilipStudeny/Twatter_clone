import Image from 'next/image'
import React from 'react'
import style from '../../styles/Messages.module.css'

const Message = () => {
  return (
    <div className={style.MessageNotifiction}>
        <div className={style.UsersProfilePics}>
            <Image src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
            <Image src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
        </div>
        <p className={style.NumberOfUsers}>10</p>
        <div className={style.MessageData}>
            <div className={style.MessageDetails}>
                <h1>Convo</h1>
                <p>Lorem ipsum sudo lomen duros mal</p>
            </div>
        </div>
        <div className={style.NumberOfUnreadMessages}>
            <p>1</p>
        </div>
    </div>
  )
}

export default Message