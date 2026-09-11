import Link from 'next/link';
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-base-content">
      <header className="border-b border-base-300 pb-3 text-xl font-semibold">Dashboard</header>
      <Link href="/about" className="link link-hover">
        About
      </Link>
      {children}
    </div>
  )
}

export default Layout