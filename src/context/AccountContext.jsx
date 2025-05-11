import { createContext, useContext, useState, useEffect } from 'react'
import { accountsAPI } from '../services/api'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'

const AccountContext = createContext(null)

export function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
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
      fetchAccounts()
    } else {
      setLoading(false)
      setAccounts([])
    }
  }, [user])

  const fetchAccounts = async () => {
    if (!checkAuth()) return
    
    try {
      setLoading(true)
      console.log('Загрузка счетов...')
      const response = await accountsAPI.getAll()
      console.log('Получены счета:', response.data)
      
      if (Array.isArray(response.data)) {
        const accountsData = response.data.map(account => ({
          ...account,
          id: String(account.id) // Преобразуем ID в строку
        }))
        console.log('Обработанные счета:', accountsData)
        setAccounts(accountsData)
        
        // Устанавливаем первый счет как выбранный, если есть счета
        if (accountsData.length > 0 && !selectedAccount) {
          console.log('Устанавливаем первый счет как выбранный:', accountsData[0])
          setSelectedAccount(accountsData[0])
        }
      } else {
        console.error('Неверный формат данных счетов:', response.data)
        setAccounts([])
      }
      setError(null)
    } catch (error) {
      console.error('Ошибка при загрузке счетов:', error)
      setError('Не удалось загрузить счета')
      setAccounts([])
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout()
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const addAccount = async (account) => {
    if (!checkAuth()) return
    
    try {
      const response = await accountsAPI.create(account)
      const newAccount = {
        ...response.data,
        id: String(response.data.id)
      }
      setAccounts(prev => [...prev, newAccount])
      setError(null)
      return newAccount
    } catch (error) {
      console.error('Ошибка при добавлении счета:', error)
      setError('Не удалось добавить счет')
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout()
        navigate('/login')
      }
      throw error
    }
  }

  const updateAccount = async (id, account) => {
    if (!checkAuth()) return
    
    try {
      const response = await accountsAPI.update(id, account)
      const updatedAccount = {
        ...response.data,
        id: String(response.data.id)
      }
      setAccounts(prev => prev.map(a => String(a.id) === String(id) ? updatedAccount : a))
      if (selectedAccount && String(selectedAccount.id) === String(id)) {
        console.log('Обновляем выбранный счет:', updatedAccount)
        setSelectedAccount(updatedAccount)
      }
      setError(null)
      return updatedAccount
    } catch (error) {
      console.error('Ошибка при обновлении счета:', error)
      setError('Не удалось обновить счет')
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout()
        navigate('/login')
      }
      throw error
    }
  }

  const deleteAccount = async (id) => {
    if (!checkAuth()) return
    
    try {
      await accountsAPI.delete(id)
      const stringId = String(id)
      setAccounts(prev => prev.filter(account => String(account.id) !== stringId))
      if (selectedAccount && String(selectedAccount.id) === stringId) {
        const remainingAccounts = accounts.filter(a => String(a.id) !== stringId)
        console.log('Оставшиеся счета после удаления:', remainingAccounts)
        setSelectedAccount(remainingAccounts[0] || null)
      }
      setError(null)
    } catch (error) {
      console.error('Ошибка при удалении счета:', error)
      setError('Не удалось удалить счет')
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout()
        navigate('/login')
      }
      throw error
    }
  }

  return (
    <AccountContext.Provider 
      value={{ 
        accounts, 
        selectedAccount, 
        setSelectedAccount,
        loading, 
        error, 
        addAccount, 
        updateAccount, 
        deleteAccount,
        fetchAccounts 
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export function useAccounts() {
  return useContext(AccountContext)
} 