import axios from 'axios'

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Изменен порт на 8080 (порт Spring Boot)
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000 // Таймаут 5 секунд
})

// Добавляем интерцептор для запросов
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('Токен из localStorage:', token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Заголовки запроса:', config.headers)
    } else {
      console.warn('Токен не найден в localStorage')
    }
    return config
  },
  (error) => {
    console.error('Ошибка при отправке запроса:', error)
    return Promise.reject(error)
  }
)

// Добавляем интерцептор для ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Ошибка при получении ответа:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message
    })
    
    if (error.response?.status === 401) {
      console.log('Сессия истекла, перенаправление на страницу входа')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    if (error.response?.status === 403) {
      console.log('Доступ запрещен, проверьте права доступа')
      // Можно добавить перенаправление на страницу с сообщением об ошибке
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
  create: (transaction) => api.post('/transactions', transaction),
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

export default api 