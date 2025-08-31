import { useState } from 'react';
import axios from 'axios';
import { GrGoogle } from 'react-icons/gr';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';


export default function LoginPage() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      setIsGoogleLoading(true);
      try {
        const accessToken = response.access_token;
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/login/google`,
          { accessToken }
        );

        const { token } = res.data;
        const decoded = jwtDecode(token);
        
        // Store user info
        localStorage.setItem('token', token);
        window.dispatchEvent(new Event('authChange'));
        localStorage.setItem('role', decoded.role);
        localStorage.setItem('userEmail', decoded.email);
        localStorage.setItem('userId', decoded.email);
        localStorage.setItem('firstName', decoded.firstName);
        localStorage.setItem('lastName', decoded.lastName);
        localStorage.setItem('img', decoded.img);

        toast.success('Google login successful');
        
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
          'Google login failed. Please try again.';
        toast.error(message);
        console.error('Google login error:', error);
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (error) => {
      toast.error('Google login failed. Please try again.');
      console.error('Google login error:', error);
    }
  });

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
      localStorage.setItem('userId', decoded.email);
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
    <div className="w-full min-h-screen bg-[url('login.jpg')] bg-center bg-cover flex flex-col lg:flex-row items-center justify-center p-4">
      {/* Left side - hidden on mobile */}
      <div className="hidden lg:block lg:w-[50%] h-full"></div>

      {/* Right side - full width on mobile */}
      <div className="w-full lg:w-[50%] h-full flex justify-center items-center">
        <div className="w-full max-w-[500px] min-h-[500px] backdrop-blur-md rounded-md shadow-lg flex flex-col justify-center items-center p-6 md:p-8 bg-white/5">
          <h2 className="text-3xl font-bold text-white mb-6">Login</h2>

          <div className="w-full space-y-4">
            <input
              onChange={(e) => setMail(e.target.value)}
              type="email"
              placeholder="Email"
              value={mail}
              className="w-full h-[50px] rounded-md bg-white text-black p-3 outline-none"
              disabled={isLoading || isGoogleLoading}
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              value={password}
              className="w-full h-[50px] rounded-md bg-white text-black p-3 outline-none"
              disabled={isLoading || isGoogleLoading}
            />

            <button
              onClick={handleLogin}
              className={`w-full h-[50px] rounded-md text-white transition ${
                isLoading ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'
              }`}
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="flex items-center justify-center my-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-white">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button 
              onClick={() => googleLogin()}
              className={`w-full h-[50px] rounded-md text-white transition flex items-center justify-center ${
                isGoogleLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
              }`}
              disabled={isGoogleLoading || isLoading}
            >
              <GrGoogle className="text-xl mr-2" />
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
          </div>

          <div className="mt-6 text-white text-center space-y-2">
            <p>
              Don't have an account?{' '}
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