'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'https://two025planner.onrender.com';
  console.log(baseurl, "Register")

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(baseurl + '/register', formData);
      console.log(formData);

      setMessage(response.data.message);
      setError('');
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setMessage(''); // Clear any previous success message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h3 className='text-center text-4xl font-extrabold text-gray-900'>Calendar 2025</h3>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Register to your account
        </h2>
        <div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className='block text-sm font-medium text-gray-700"' htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 my-5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </form>
          <button type='button' className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <a href="/login">
              Login
            </a>
          </button>
          {message && <p className='mt-5 text-green-600'>{message}</p>}
          {error && <p className='mt-5 text-green-600'>{error}</p>}
        </div>
      </div>
    </div>
  );
}
