import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleRegister() {
    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/users', {
        email,
        firstName,
        lastName,
        password,
      });
      console.log(response.data);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="w-full h-screen bg-[url('login.jpg')] bg-center bg-cover flex items-center justify-center">
      <div className="w-[50%] h-full"></div>

      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[700px] backdrop-blur-md rounded-md shadow-lg flex flex-col justify-center items-center p-8 bg-white/5">
          
          {/* Heading */}
          <h2 className="text-3xl font-bold text-white mb-6">Register</h2>

          {/* First Name */}
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full h-[50px] bg-white text-black p-3 mb-4 rounded-md outline-none"
          />

          {/* Last Name */}
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full h-[50px] bg-white text-black p-3 mb-4 rounded-md outline-none"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[50px] bg-white text-black p-3 mb-4 rounded-md outline-none"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[50px] bg-white text-black p-3 mb-6 rounded-md outline-none"
          />

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className="w-full h-[50px] bg-pink-500 text-white rounded-md hover:bg-pink-600 transition cursor-pointer"
          >
            Register
          </button>

          {/* Additional Links */}
          <div className="mt-6 text-white text-center space-y-2">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-300 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
