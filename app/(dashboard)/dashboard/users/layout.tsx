import React from 'react'

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <>Users Insight</>
        {children}
    </div>
  )
}

export default Layout