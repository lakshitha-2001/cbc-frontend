import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    // Handle login logic here
    console.log('Login clicked', { mail, password });
    try {
    const response = await axios 
      .post('http://localhost:5000/users/login', {
        email: mail,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        toast.success('Login successful');
        // Handle successful login here (e.g., redirect, show message)
      })
      .catch((error) => {
        console.log(error.response.data);
        toast.error(error.response.data.message);
        // Handle login error here (e.g., show error message)
      });
    } catch (error) {
      console.log(error.response.data);
     toast.error(error.response.data.message);
     
      // Handle login error here (e.g., show error message)
    }
  }

  return (
    <div className="w-full h-screen bg-[url('login.jpg')] bg-center bg-cover flex items-center justify-center">
      <div className="w-[50%] h-full">
        {/* Left section (can be used for image or branding) */}
      </div>

      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[600px] backdrop-blur-md rounded-md shadow-lg flex flex-col justify-center items-center p-8">
          <input
            onChange={(e) => setMail(e.target.value)}
            type="email"
            placeholder="Email"
            value={mail}
            className="w-full h-[50px] rounded-t-md bg-white text-black p-3 mb-4 outline-none"
          />
          <input
          onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            value={password}
            className="w-full h-[50px] rounded-b-md bg-white text-black p-3 mb-6 outline-none"
          />
          <button onClick={handleLogin} className="w-full h-[50px] bg-pink-500 text-white rounded-md hover:bg-pink-600 transition cursor-pointer">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
