import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, Router, RouterProvider, Routes } from 'react-router-dom'

import { ContextProvider, UserContext } from './UserContext'


createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <App/>  
  </ContextProvider>

)
