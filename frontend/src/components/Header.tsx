import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-teal-600">GrabNextDoor</Link>
        <nav className="flex space-x-3 items-center">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-500 mr-2 hidden md:inline">Hello, {user}</span>
              <Link to="/reservations" className="text-teal-600 hover:text-teal-700 font-semibold text-sm">
                My Reservations
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-gray-600 hover:text-teal-600 px-3 font-medium">Login</Link>
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
