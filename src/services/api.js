import axios from 'axios'
import { useAuth } from '../context/AuthContext'

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Изменен порт на 8080 (порт Spring Boot)
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000 // Таймаут 5 секунд
})

// Добавляем перехватчик запросов
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('Текущий токен:', token)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Заголовки запроса:', config.headers)
    } else {
      console.warn('Токен отсутствует в localStorage')
    }
    return config
  },
  (error) => {
    console.error('Ошибка в перехватчике запросов:', error)
    return Promise.reject(error)
  }
)

// Добавляем перехватчик ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Ошибка при получении ответа:', error)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Ошибка аутентификации. Проверьте:')
      console.error('1. Наличие токена в localStorage')
      console.error('2. Валидность токена')
      console.error('3. Права доступа пользователя')
      console.error('Полный ответ сервера:', error.response)
      
      // Очищаем данные аутентификации
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      
      // Перенаправляем на страницу входа
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Методы для работы с аутентификацией
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout')
}

// Методы для работы с транзакциями
export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  create: (transaction) => {
    console.log('Отправляемые данные транзакции:', transaction)
    return api.post('/transactions', transaction)
  },
  update: (id, transaction) => api.put(`/transactions/${id}`, transaction),
  delete: (id) => api.delete(`/transactions/${id}`),
  getByPeriod: (startDate, endDate) => 
    api.get('/transactions/period', { params: { start: startDate, end: endDate } })
}

// Методы для работы с категориями
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
  search: (name) => api.get('/categories/search', { params: { name } })
}

// Методы для работы со счетами
export const accountsAPI = {
  getAll: () => api.get('/accounts'),
  create: (account) => api.post('/accounts', account),
  update: (id, account) => api.put(`/accounts/${id}`, account),
  delete: (id) => api.delete(`/accounts/${id}`)
}

export default api 