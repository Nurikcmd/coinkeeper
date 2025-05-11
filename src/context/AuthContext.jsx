import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Проверяем наличие пользователя при загрузке
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleAuthError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Очищаем данные из localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      
      // Обновляем состояние
      setUser(null)
      setIsAuthenticated(false)
      
      // Перенаправляем на страницу входа
      navigate('/login')
    }
    throw error
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const { user, token } = response.data
      
      // Сохраняем данные в localStorage
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      
      // Обновляем состояние
      setUser(user)
      setIsAuthenticated(true)
      
      // Перенаправляем на дашборд
      navigate('/dashboard')
    } catch (error) {
      console.error('Ошибка входа:', error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      const { user, token } = response.data
      
      // Сохраняем данные в localStorage
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
      
      // Обновляем состояние
      setUser(user)
      setIsAuthenticated(true)
      
      // Перенаправляем на дашборд
      navigate('/dashboard')
    } catch (error) {
      console.error('Ошибка регистрации:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Ошибка выхода:', error)
    } finally {
      // Очищаем данные из localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      
      // Обновляем состояние
      setUser(null)
      setIsAuthenticated(false)
      
      // Перенаправляем на страницу входа
      navigate('/login')
    }
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, handleAuthError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
} 