import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import axios from 'axios'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true

function App() {
  return (
    <div>
      <Toaster position='bottom-right' toastOptions={{duration: 2000}} />
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/dashboard' element={
          <ProtectedRoute adminOnly={true}>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        }/>
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
