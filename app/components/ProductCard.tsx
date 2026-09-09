import React, { use } from 'react'
import AddToCard from './AddToCard';
import styles from './ProductCard.module.css'

function ProductCard() {
  return (
    <div className='p-5 my-5 rounded-lg shadow-md bg-base-200 text-base-content text-xl hover:bg-base-300 transition-colors duration-300'>
        <AddToCard />
    </div>
  )
}

export default ProductCard