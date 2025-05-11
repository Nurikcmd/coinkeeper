import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const auth = useAuth()
  
  if (!auth) {
    console.error('Auth context is not available')
    return <Navigate to="/login" replace />
  }

  const { isAuthenticated } = auth

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
} 