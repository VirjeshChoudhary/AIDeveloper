import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "../config/axios.js"; // Adjust the import path as necessary
import { useUser } from '../Context/UserContext.jsx';

const Signup = () => {
  const navigate=useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUser}=useUser();
  const handleSignup=async (e)=>{
    e.preventDefault();
    const res=await axios.post(`/users/register`,{
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch((err)=>{
      console.log(err);
      alert(err.response.data.message);
      return;
    })
    if(res.status===201){
      const data=res.data;
      localStorage.setItem('token',data.token);
      setUser(data.user);
      navigate('/');
    }
    setEmail('');
    setPassword('');
    console.log(res.data);
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export default Signup