import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation
  const userName = localStorage.getItem('email'); // Retrieve username (or email) from localStorage

  const handleLogout = () => {
    // Clear local storage on logout
    localStorage.removeItem('UserToken');
    localStorage.removeItem('UserEmail');
    localStorage.removeItem('Role')

    navigate('/login'); 
  };

  return (
    <nav className="bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-500">
          GADGET IT MAGAZINE
        </Link>
        
        <div className="flex items-center space-x-6">
          {/* Display the username */}
          {userName && (
            <span className="text-lg text-slate-200">{userName}</span>
          )}

          {/* Navigation Links */}
          <div className="space-x-4">
            <Link to="/home" className="text-sm hover:text-green-500">Home</Link>
            <Link to="/profile" className="text-sm hover:text-green-500">Profile</Link>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-sm hover:text-green-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
