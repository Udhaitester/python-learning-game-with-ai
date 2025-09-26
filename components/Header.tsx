
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-6xl mx-auto mb-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-400 to-green-500">
        The Sutras of Python: A Yodha's Journey
      </h1>
      <p className="text-gray-400 mt-2">Master Python with stories from ancient India, guided by an AI Guru.</p>
    </header>
  );
};

export default Header;