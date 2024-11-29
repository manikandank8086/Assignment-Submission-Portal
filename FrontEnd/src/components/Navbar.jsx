import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const userName = localStorage.getItem('email')

  const handleLogout = () => {
    localStorage.removeItem('UserToken')
    localStorage.removeItem('UserEmail')
    localStorage.removeItem('Role')
    navigate('/login')
  }

  return (
    <nav className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white py-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-pink-200 transition-colors duration-300">
          GADGET IT MAGAZINE
        </Link>
        
        <div className="flex items-center space-x-6">
          {userName && (
            <span className="text-lg text-white bg-white bg-opacity-20 px-3 py-1 rounded-full">
              {userName}
            </span>
          )}

          <div className="space-x-4">
           
            
            <button
              onClick={handleLogout}
              className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-md transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar