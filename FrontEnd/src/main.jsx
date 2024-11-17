import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";


createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="57312022361-oqu8lankngbhqjbq3auuohsvtuvupkma.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
)
