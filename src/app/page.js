'use client';
import Link from 'next/link';
import Image from "next/image";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";


export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigateToHome();
    }
  }, []);
  const navigateToHome = () => {
    router.push('/home');
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 bg-gradient-to-r from-blue-500 to-purple-600 animate-gradient bg-[length:400%_400%] text-white">
      {/* Hero Section */}
      <motion.h1
        className="text-5xl font-extrabold text-center mb-4 drop-shadow-lg"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to Daily Planner
      </motion.h1>
      <motion.p
        className="text-lg text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        A smarter way to organize your tasks and daily stories.
      </motion.p>

      {/* Call-to-Action Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
        <Link
          href="/login"
          className="bg-white text-blue-600 hover:bg-blue-100 transition duration-300 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 text-center font-semibold"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="bg-white text-blue-600 hover:bg-blue-100 transition duration-300 px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 text-center font-semibold"
        >
          Register
        </Link>
      </div>

      {/* Features Section */}
      <motion.div
        className="mt-16 text-center w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <h2 className="text-3xl font-bold">Why Choose Daily Planner?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <FeatureCard icon="📝" title="Easy Note-Taking" description="Save and manage tasks for any date effortlessly." />
          <FeatureCard icon="📅" title="Date-Specific" description="Associate notes with specific days for better tracking." />
          <FeatureCard icon="⚡" title="Fast & Lightweight" description="Built with modern tech for a seamless experience." />
        </div>
      </motion.div>

      {/* Social Links Section with Cards */}
      <motion.div
        className="mt-16 text-center w-full max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <h2 className="text-3xl font-bold mb-4">Connect With Me:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <SocialCard icon="🌐" title="Website" link="https://www.saurabhsolanke.com" />
          <SocialCard icon="📂" title="GitHub Repo" link="https://github.com/saurabhsolanke?tab=repositories" />
          <SocialCard icon="✍️" title="Medium Blog" link="https://medium.com/@saurabh.solanke_6285/daily-planner-a-smarter-way-to-organize-your-tasks-notes-f7d385727914" />
          <SocialCard icon="🔗" title="LinkedIn" link="https://www.linkedin.com/in/saurabh-solanke/" />
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-12 text-sm">
        <p>© 2025 . All rights reserved.</p>
      </footer>
    </div>
  );
}

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    className="p-6 bg-white text-blue-600 rounded-xl shadow-lg transform hover:scale-105 transition duration-300"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <div className="text-4xl">{icon}</div>
    <h3 className="text-xl font-bold mt-2">{title}</h3>
    <p className="text-sm mt-1">{description}</p>
  </motion.div>
);

// Social Link Card Component
const SocialCard = ({ icon, title, link }) => (
  <motion.a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="p-6 bg-white text-blue-600 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 flex flex-col items-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
  >
    <div className="text-4xl">{icon}</div>
    <h3 className="text-lg font-bold mt-2">{title}</h3>
  </motion.a>
);