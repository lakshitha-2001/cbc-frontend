import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import AdminProductPage from './admin/AdminProductPage'

export default function AdminPage() {
  return (
    <div className=' w-full h-screen flex'>
        <div className='h-full w-[300px] bg-blue-800 flex flex-col '>
          <Link to='/admin/products'>products</Link>
          <Link to='/admin/users'>users</Link>
          <Link to='/admin/orders'>orders</Link>
        </div>

        <div className='h-full w-[calc(100%-300px)] bg-red-300'>
          {/* navbar eke 300px adu karala thamai danne */}
          <Routes path= '/*'>
            <Route path='/products' element={<AdminProductPage/>} />
            <Route path='/users' element={<h1>users</h1>} />
            <Route path='/orders' element={<h1>orders</h1>} />
          </Routes>

        </div>
    </div>
  )
}
