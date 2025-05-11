import { useState, useEffect } from 'react'
import { useTransactions } from '../context/TransactionContext'
import { useAccounts } from '../context/AccountContext'
import { categoriesAPI } from '../services/api'

function EditTransactionModal({ isOpen, onClose, transaction }) {
  const { updateTransaction } = useTransactions()
  const { accounts } = useAccounts()
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    date: '',
    category: { id: '' },
    account: { id: '' },
    comment: ''
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll()
        console.log('Ответ API категорий:', response)
        if (response?.data) {
          const categoriesData = response.data.map(category => ({
            ...category,
            id: String(category.id)
          }))
          setCategories(categoriesData)
        } else {
          console.error('Неверный формат данных категорий:', response)
          setCategories([])
        }
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error)
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (transaction) {
      console.log('Транзакция для редактирования:', transaction)
      setFormData({
        amount: transaction.amount,
        type: transaction.type,
        date: new Date(transaction.date).toISOString().split('T')[0],
        category: { id: String(transaction.category?.id || '') },
        account: { id: String(transaction.account?.id || '') },
        comment: transaction.comment || ''
      })
    }
  }, [transaction])

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log('Изменение поля:', name, value)
    
    if (name === 'account') {
      if (value === '') {
        setFormData(prev => ({
          ...prev,
          account: { id: '' }
        }))
        return
      }
      const selectedAccount = accounts.find(acc => String(acc.id) === String(value))
      console.log('Найденный счет:', selectedAccount)
      if (selectedAccount) {
        setFormData(prev => ({
          ...prev,
          account: selectedAccount
        }))
      }
    } else if (name === 'category') {
      if (value === '') {
        setFormData(prev => ({
          ...prev,
          category: { id: '' }
        }))
        return
      }
      const selectedCategory = categories.find(cat => String(cat.id) === String(value))
      console.log('Найденная категория:', selectedCategory)
      if (selectedCategory) {
        setFormData(prev => ({
          ...prev,
          category: selectedCategory
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log('Текущие данные формы:', formData)
      console.log('Доступные категории:', categories)
      console.log('Доступные счета:', accounts)
      
      const selectedCategory = categories.find(cat => String(cat.id) === String(formData.category.id))
      const selectedAccount = accounts.find(acc => String(acc.id) === String(formData.account.id))
      
      console.log('Выбранная категория:', selectedCategory)
      console.log('Выбранный счет:', selectedAccount)
      
      if (!selectedCategory) {
        console.error('Не выбрана категория')
        alert('Пожалуйста, выберите категорию')
        return
      }
      
      if (!selectedAccount) {
        console.error('Не выбран счет')
        alert('Пожалуйста, выберите счет')
        return
      }
      
      const transactionData = {
        ...formData,
        amount: Number(formData.amount),
        date: new Date(formData.date).toISOString(),
        category: selectedCategory,
        account: selectedAccount
      }
      
      console.log('Подготовленные данные для отправки:', transactionData)
      await updateTransaction(transaction.id, transactionData)
      onClose()
    } catch (error) {
      console.error('Ошибка при обновлении транзакции:', error)
      alert('Ошибка при обновлении транзакции: ' + (error.response?.data?.message || error.message))
    }
  }

  if (!isOpen || !transaction) return null

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
          Редактировать транзакцию
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Сумма</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Тип</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="EXPENSE">Расход</option>
              <option value="INCOME">Доход</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Дата</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Счет</label>
            <select
              name="account"
              value={formData.account.id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Выберите счет</option>
              {Array.isArray(accounts) && accounts.length > 0 ? (
                accounts.map(account => (
                  <option key={account.id} value={String(account.id)}>
                    {account.name} ({account.currency})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Нет доступных счетов
                </option>
              )}
            </select>
            {formData.account.id && formData.account.name && (
              <p className="mt-1 text-sm text-gray-500">
                Выбран счет: {formData.account.name} ({formData.account.currency})
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Категория</label>
            <select
              name="category"
              value={formData.category.id}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Выберите категорию</option>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map(category => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Нет доступных категорий
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Комментарий</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTransactionModal 