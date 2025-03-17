'use client';

import { useEffect, useState } from 'react';

export default function Navbar() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUsername = localStorage.getItem('username');
            setUsername(storedUsername || '');
        }
    }, []);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex w-full flex-col justify-between bg-white px-6 py-5 shadow-lg dark:bg-zinc-900 dark:shadow-black/5 lg:flex-row lg:items-center">
            <div className="flex items-center">
                <div className="flex h-10 w-10 items-center text-lg font-bold text-gray-700 dark:text-zinc-500">
                    <img className="h-full w-full" src="/logo2.jpg" alt="" />
                    <span className="px-1">Calendar</span>
                </div>
                <div className="flex w-full justify-end">
                    <button className="block lg:hidden" onClick={() => setIsOpen(!isOpen)}> {/* Toggle button */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="">
                <div className="" id="navigation">
                    <ul className={`mt-2 flex flex-col gap-2 font-medium text-gray-700 dark:text-zinc-400 lg:mt-0 lg:flex-row lg:gap-4 ${isOpen ? 'flex' : 'hidden'} lg:flex`}>
                        <li><span>Welcome, </span><span className="mr-4 rounded-md py-0.5 px-2 text-xs font-medium text-white bg-cyan-500">{username && <span> {username}</span>} </span></li>
                        <li><a href="/home" className="text-sky-700">Home</a></li>
                        <li><a href="/home" className="hover:text-sky-700">About</a></li>
                        <li><a href="/login" className="hover:text-sky-700"
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('username');
                            }}
                        >Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}