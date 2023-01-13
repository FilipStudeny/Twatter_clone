import React, { ReactNode } from 'react'
import PageHeader from '../PageHeader'
import UserSideBar from '../UserSideBar'

function MainLayout({children} : {children: ReactNode}) {
  return (
    <>
        <PageHeader/>
        <UserSideBar/>
        <div className="pageContent">
            {children}
        </div>
    
    </>

  )
}

export default MainLayout