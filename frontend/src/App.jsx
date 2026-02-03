import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import axios from 'axios'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FillForm from './pages/FillForm'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import SuccessPage from './pages/Success'

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

        <Route path='/fill-form/:id' element={
          <ProtectedRoute adminOnly={false}>
            <Navbar />
            <FillForm/>
          </ProtectedRoute>
        }/>
        <Route path="*" element={<Navigate to='/login' replace />} />
        <Route path='/success' element={<SuccessPage />}></Route>
      </Routes>

    </div>
  )
}

export default App
