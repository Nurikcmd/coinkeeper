import { useState, useEffect } from 'react'
import { useTransactions } from '../context/TransactionContext'
import { categoriesAPI } from '../services/api'

function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction } = useTransactions()
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    category: { id: null },
    amount: '',
    date: new Date().toISOString(),
    comment: ''
  })

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.getAll()
        setCategories(response.data)
        if (response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            category: { id: response.data[0].id }
          }))
        }
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error)
      }
    }
    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log('Изменение поля:', name, 'значение:', value)
    
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        type: value
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Отправка формы с данными:', formData)
    
    try {
      const transactionData = {
        ...formData,
        amount: Number(formData.amount),
        type: formData.type,
        date: new Date(formData.date).toISOString()
      }
      console.log('Подготовленные данные для отправки:', transactionData)
      
      await addTransaction(transactionData)
      onClose()
      setFormData({
        type: 'EXPENSE',
        category: { id: categories.length > 0 ? categories[0].id : null },
        amount: '',
        date: new Date().toISOString(),
        comment: ''
      })
    } catch (error) {
      console.error('Ошибка при добавлении транзакции:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Добавить транзакцию</h3>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Тип</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="INCOME">Доход</option>
              <option value="EXPENSE">Расход</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Категория</label>
            <select
              name="category"
              value={formData.category.id || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                category: { id: Number(e.target.value) }
              }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Выберите категорию</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Сумма</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Дата</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date.slice(0, 16)}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
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
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTransactionModal 