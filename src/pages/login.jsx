import React from 'react'

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <form className='flex flex-col justify-center items-center'>
        <input type="text" placeholder='Username' className='border-2 border-black rounded-md p-2 m-2'/>
        <input type="password" placeholder='Password' className='border-2 border-black rounded-md p-2 m-2'/>
        <button className='bg-blue-500 text-white rounded-md p-2 m-2'>Login</button>
      </form>
      <p className='text-center'>Don't have an account? <a href="/register" className='text-blue-500'>Register here</a></p>
      
    </div>
  )
}
