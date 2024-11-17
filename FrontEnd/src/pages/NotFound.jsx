import {Link, useNavigate} from 'react-router-dom'
import React from 'react'
import { FileX, ArrowLeft } from 'lucide-react'

const  NotFound= ()=> {

  const navigate=useNavigate()

  const handleRedirect = () => {
    const role = localStorage.getItem('Role');
   if (role === 'Admin') {
    navigate('/admin/dashbord');
  } else if (role === 'User') {
    navigate('/home');
  } else {
    navigate('/login'); 
  }
  };
  
    
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <FileX className="mx-auto h-16 w-16 text-red-500" aria-hidden="true" />
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">404 - Page Not Found</h1>
          <p className="mt-2 text-base text-gray-600">
            We couldn't find the page you're looking for in our assignment portal.
          </p>
        </div>
        <div className="mt-8">
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h2 className="text-sm font-medium text-yellow-800">Possible reasons:</h2>
                <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                  <li>The assignment or course may have been moved or deleted</li>
                  <li>You might have mistyped the URL</li>
                  <li>You may not have permission to access this page</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button onClick={handleRedirect} className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-duration-150 ease-in-out">
            <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound