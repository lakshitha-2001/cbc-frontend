import React from 'react'

export default function SignUp() {
  return (
    <div>
      <h1>SignUp</h1>
      <form className='flex flex-col justify-center items-center'>
        <input type="text" placeholder='Username' className='border-2 border-black rounded-md p-2 m-2'/>
        <input type="email" placeholder='Email' className='border-2 border-black rounded-md p-2 m-2'/>
        <input type="password" placeholder='Password' className='border-2 border-black rounded-md p-2 m-2'/>
        <button className='bg-blue-500 text-white rounded-md p-2 m-2'>SignUp</button>
      </form>
      <p className='text-center'>Already have an account? <a href="/login" className='text-blue-500'>Login here</a></p>
      
    </div>
  )
}
