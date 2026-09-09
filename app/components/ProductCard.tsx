import React, { use } from 'react'
import AddToCard from './AddToCard';
import styles from './ProductCard.module.css'

function ProductCard() {
  return (
    <div className='p-5 my-5 rounded-lg shadow-md bg-white text-gray-900 dark:bg-gray-800 dark:text-white text-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300'>
        <AddToCard />
    </div>
  )
}

export default ProductCard