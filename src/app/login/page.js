'use client'
import { useState,useEffect } from 'react';
// import { useRouter } from 'next/router';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Add this import


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log(token, "token" );
            navigateToHome();
        }
    }, []); 

    const navigateToHome = () => {
        router.push('/home');
    };
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || 'https://two025planner.onrender.com';
    console.log(baseurl,"Login");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(baseurl + '/login', { username, password },{ withCredentials: true });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username);
                toast.success('User logged in successfully!');
                router.push('/home');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };
    

    return (
       
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
             <ToastContainer /> 
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <h3 className='text-center text-4xl font-extrabold text-gray-900'>Calendar 2025</h3>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={loading}>
                        {loading ? 'Loading...' : 'Sign in'}
                    </button>
                </form>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                ><a href="/register">
                        Register
                    </a>
                </button>
            </div>
        </div>
    );
}