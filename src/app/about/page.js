'use client'; // Add this directive at the top of the file

import React, { useEffect, useState } from 'react';

const AboutPage = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div>
      <h1>About Page</h1>
      <p>Welcome, {username || 'Guest'}!</p>
    </div>
  );
};

export default AboutPage;