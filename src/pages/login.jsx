import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin() {
    console.log('Login clicked', { mail, password });
    try {
      await axios
        .post(import.meta.env.VITE_BACKEND_URL + '/api/users/login', {
          email: mail,
          password: password,
        })
        .then((response) => {
          console.log(response.data);
          toast.success('Login successful');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.role);
          if (response.data.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        })
        .catch((error) => {
          console.log(error.response.data);
          toast.error(error.response.data.message);
        });
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="w-full h-screen bg-[url('login.jpg')] bg-center bg-cover flex items-center justify-center">
      <div className="w-[50%] h-full"></div>

      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[600px] backdrop-blur-md rounded-md shadow-lg flex flex-col justify-center items-center p-8 bg-white/5">
          
          {/* Heading */}
          <h2 className="text-3xl font-bold text-white mb-6">Login</h2>

          {/* Email Input */}
          <input
            onChange={(e) => setMail(e.target.value)}
            type="email"
            placeholder="Email"
            value={mail}
            className="w-full h-[50px] rounded-t-md bg-white text-black p-3 mb-4 outline-none"
          />

          {/* Password Input */}
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            value={password}
            className="w-full h-[50px] rounded-b-md bg-white text-black p-3 mb-6 outline-none"
          />

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full h-[50px] bg-pink-500 text-white rounded-md hover:bg-pink-600 transition cursor-pointer"
          >
            Login
          </button>

          {/* Additional Links */}
          <div className="mt-6 text-white text-center space-y-2">
            <p>
              Don’t have an account?{' '}
              <Link to="/register" className="text-blue-300 hover:underline">
                Sign Up
              </Link>
            </p>
            <p>
              <Link to="/forgot-password" className="text-blue-300 hover:underline">
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
