'use client'; //Make sure to add this at the top of the file to enable client-side rendering
import React from 'react'

function AddToCard() {
  return (
    <button className='btn btn-primary' onClick={() => console.log('Here')}>Product Card</button>
  )
}

export default AddToCard