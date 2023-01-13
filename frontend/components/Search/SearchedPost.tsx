import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import style from '../../styles/Search.module.css'
import { SearchedPost_Props } from '../props/SearchProps'

const SearchedPost = ({creator, postTitle} : SearchedPost_Props) => {
  return (
    <>
        <Link href="#" className={style.SearchedItem}>
            <Image src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
            <p>@{creator}</p>
            <h1>{postTitle}</h1>
        </Link>
    </>
  )
}

export default SearchedPost