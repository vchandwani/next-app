import React from 'react'

const UserDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  return (
    <>
      <h1 className="text-2xl font-bold">Showing Details</h1>
      <p className="text-lg">{id}</p>
    </>
  )
}

export default UserDetails