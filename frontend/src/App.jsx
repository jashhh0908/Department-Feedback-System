import { Navigate, Route, Routes } from 'react-router-dom'
import axios from 'axios'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FillForm from './pages/FillForm'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import SuccessPage from './pages/Success'
import AdminLayout from './components/AdminLayout'
import Navbar from './components/Navbar'
import UsersPage from './pages/UsersPage'
import FormsPage from './pages/FormsPage'
import NewFormPage from './pages/NewFormPage'
import Analytics from './pages/Analytics'

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
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }/>
        <Route path='/dashboard/users' element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout>
              <UsersPage />
            </AdminLayout>
          </ProtectedRoute>
        }/>
        <Route path='/dashboard/forms' element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout>
              <FormsPage />
            </AdminLayout>
          </ProtectedRoute>
        }/>
        <Route path='/dashboard/forms/new' element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout>
              <NewFormPage />
            </AdminLayout>
          </ProtectedRoute>
        }/>
        <Route path='/dashboard/analytics' element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout>
              <Analytics />
            </AdminLayout>
          </ProtectedRoute>
        }/>
        <Route path='/dashboard/analytics/:formId' element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout>
              <Analytics />
            </AdminLayout>
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
