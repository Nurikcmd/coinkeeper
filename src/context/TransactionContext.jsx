import { createContext, useContext, useState, useEffect } from 'react'
import { transactionsAPI } from '../services/api'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'

const TransactionContext = createContext(null)

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      logout()
      navigate('/login')
      return false
    }
    return true
  }

  useEffect(() => {
    if (user) {
      fetchTransactions()
    } else {
      setLoading(false)
      setTransactions([])
    }
  }, [user])

  const fetchTransactions = async () => {
    if (!checkAuth()) return
    
    try {
      setLoading(true)
      const response = await transactionsAPI.getAll()
      console.log('Получены транзакции:', response.data)
      setTransactions(response.data)
      setError(null)
    } catch (error) {
      console.error('Ошибка при загрузке транзакций:', error.response?.data || error.message)
      setError(error.response?.data?.message || 'Не удалось загрузить транзакции')
      setTransactions([])
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout()
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const addTransaction = async (transaction) => {
    if (!checkAuth()) return
    
    try {
      console.log('Добавление транзакции:', transaction)
      const response = await transactionsAPI.create(transaction)
      console.log('Ответ сервера:', response)
      setTransactions(prev => [response.data, ...prev])
      setError(null)
    } catch (error) {
      console.error('Ошибка при добавлении транзакции:', error)
      setError('Не удалось добавить транзакцию')
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout()
        navigate('/login')
      }
      throw error
    }
  }

  const deleteTransaction = async (id) => {
    if (!checkAuth()) return
    
    try {
      console.log('Удаление транзакции:', id)
      await transactionsAPI.delete(id)
      console.log('Транзакция удалена')
      setTransactions(prev => prev.filter(transaction => transaction.id !== id))
      setError(null)
    } catch (error) {
      console.error('Ошибка при удалении транзакции:', error.response?.data || error.message)
      setError(error.response?.data?.message || 'Не удалось удалить транзакцию')
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout()
        navigate('/login')
      }
      throw error
    }
  }

  const updateTransaction = async (id, transaction) => {
    if (!checkAuth()) return
    
    try {
      console.log('Обновление транзакции:', { id, transaction })
      const response = await transactionsAPI.update(id, transaction)
      console.log('Транзакция обновлена:', response.data)
      setTransactions(prev => 
        prev.map(t => t.id === id ? response.data : t)
      )
      setError(null)
    } catch (error) {
      console.error('Ошибка при обновлении транзакции:', error.response?.data || error.message)
      setError(error.response?.data?.message || 'Не удалось обновить транзакцию')
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout()
        navigate('/login')
      }
      throw error
    }
  }

  const getBalance = () => {
    return transactions.reduce((acc, transaction) => {
      return acc + (transaction.type === 'INCOME' ? transaction.amount : -transaction.amount)
    }, 0)
  }

  const getTransactionsByPeriod = async (startDate, endDate) => {
    if (!checkAuth()) return []
    
    try {
      console.log('Запрос транзакций за период:', { startDate, endDate })
      const response = await transactionsAPI.getByPeriod(startDate, endDate)
      console.log('Получены транзакции за период:', response.data)
      return response.data
    } catch (error) {
      console.error('Ошибка при получении транзакций за период:', error.response?.data || error.message)
      setError(error.response?.data?.message || 'Не удалось загрузить транзакции за выбранный период')
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout()
        navigate('/login')
      }
      throw error
    }
  }

  const getTransactionsByCategory = (category) => {
    return transactions.filter(transaction => transaction.category === category)
  }

  if (loading) {
    return <div>Загрузка транзакций...</div>
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        getBalance,
        getTransactionsByPeriod,
        getTransactionsByCategory
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  return useContext(TransactionContext)
} 