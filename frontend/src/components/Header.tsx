import React from 'react';
import Button from './Button';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teal-600">GrabNextDoor</h1>
        <nav className="flex space-x-3 items-center">
          <a href="#" className="text-gray-600 hover:text-teal-600 px-3 font-medium">Login</a>
          <Button variant="outline" size="sm">
            Sign Up
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
