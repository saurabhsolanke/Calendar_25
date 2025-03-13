import Link from 'next/link';
import Image from "next/image";
import React from 'react';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-r from-blue-500 to-purple-600 animate-gradient bg-[length:400%_400%]">
      <h1 className="text-4xl mt-16 font-bold mb-4 text-white text-center">Welcome to Calendar</h1> {/* Added a heading */}
      <div className="flex flex-col gap-4 w-full max-w-sm mx-auto"> {/* Flex container for buttons */}
        <Link href="/login" className="bg-white text-blue-600 hover:bg-blue-100 transition duration-300 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 text-center">
          Login
        </Link>
        <Link href="/register" className="bg-white text-blue-600 hover:bg-blue-100 transition duration-300 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 text-center">
          Register
        </Link>
      </div>
      <footer className="text-sm mt-4 text-white text-center"> {/* Added a footer for additional info */}
        <p>© 2025 . All rights reserved.</p>
        <p>
          <a href="https://www.saurabhsolanke@gmail.com" className="text-blue-300 hover:underline">
            Visit my website
          </a>
        </p>
      </footer>
    </div>
  );
}
