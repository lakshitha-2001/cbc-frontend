import { useState } from 'react';
import axios from 'axios';

import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    if (!mail || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    console.log('Login attempt', { mail, backendUrl: import.meta.env.VITE_BACKEND_URL });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        {
          email: mail,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { token } = response.data;

      // Decode token
      const decoded = jwtDecode(token);
      console.log('Decoded Token:', decoded);

      // Store user info
      localStorage.setItem('token', token);
      window.dispatchEvent(new Event('authChange'));
      localStorage.setItem('role', decoded.role);
      localStorage.setItem('userEmail', decoded.email);
      localStorage.setItem('userId', decoded.email); // Fallback since id not in token
      localStorage.setItem('firstName', decoded.firstName);
      localStorage.setItem('lastName', decoded.lastName);
      localStorage.setItem('img', decoded.img);

      toast.success('Login successful');

      // Navigate based on role
      if (decoded.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your connection or try again.';
      toast.error(message);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen bg-[url('login.jpg')] bg-center bg-cover flex items-center justify-center">
      <div className="w-[50%] h-full"></div>

      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[600px] backdrop-blur-md rounded-md shadow-lg flex flex-col justify-center items-center p-8 bg-white/5">
          <h2 className="text-3xl font-bold text-white mb-6">Login</h2>

          <input
            onChange={(e) => setMail(e.target.value)}
            type="email"
            placeholder="Email"
            value={mail}
            className="w-full h-[50px] rounded-t-md bg-white text-black p-3 mb-4 outline-none"
            disabled={isLoading}
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            value={password}
            className="w-full h-[50px] rounded-b-md bg-white text-black p-3 mb-6 outline-none"
            disabled={isLoading}
          />

          <button
            onClick={handleLogin}
            className={`w-full h-[50px] rounded-md text-white transition ${
              isLoading ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

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