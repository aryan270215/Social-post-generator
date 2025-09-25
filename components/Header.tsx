
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <img
          src="https://ik.imagekit.io/VOX/VOX%20Website%20logo.jpg?updatedAt=1757676822355"
          alt="VOX Logo"
          className="h-12 w-auto mx-auto mb-4 rounded-md"
        />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Social Post Image Generator
        </h1>
        <p className="mt-2 text-md text-gray-400">
          Turn your text posts into stunning, shareable graphics.
        </p>
      </div>
    </header>
  );
};

export default Header;
