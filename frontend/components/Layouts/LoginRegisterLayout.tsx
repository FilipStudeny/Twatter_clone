import React, { ReactNode } from 'react'
import PageHeader from '../PageHeader'

function LoginRegisterLayout({children} : {children: ReactNode}) {
  return (
    <>
        <PageHeader/>
        {children}
    </>

  )
}

export default LoginRegisterLayout