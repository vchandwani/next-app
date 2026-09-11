import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>Dashboard</header>
      {children}
    </div>
  )
}

export default Layout