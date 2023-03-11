import Message from '@/components/search/Message'
import SearchedUser from '@/components/search/SearchedUser'
import React from 'react'
import style from '../styles/Messages.module.css'

const messages = () => {

    return(
        <>
            <h1 className={style.PageTitle}>Messages</h1>

            <div className="ContentContainer">
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>
                <Message/>



            </div>
        </>
        
    )
  
}

export default messages