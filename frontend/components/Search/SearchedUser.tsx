import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import style from '../../styles/Search.module.css'

interface SearchedProps{
    'profile_pic': string,
    '_id': string,
    'username': string
}

const SearchedUser = ({_id, profile_pic, username} : SearchedProps) => {
  return (
    <>
        <Link href={`/profile/${_id}`} className={style.SearchedItem}>
            <Image src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
            <h1>@{username}</h1>
        </Link>
    </>
  )
}

export default SearchedUser