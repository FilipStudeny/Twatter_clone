import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { SearchedUser_Props } from '../props/SearchProps'
import style from '../../styles/Search.module.css'

const SearchedUser = ({creator} : SearchedUser_Props) => {
  return (
    <>
        <Link href="#" className={style.SearchedItem}>
            <Image src='/images/user_icon.png' width="512" height="512" alt='User profile image'/>
            <h1>@{creator}</h1>
        </Link>
    </>
  )
}

export default SearchedUser