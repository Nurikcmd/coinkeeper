import { useState, useEffect } from 'react'
import { useAccounts } from '../context/AccountContext'

function AccountModal({ isOpen, onClose, account = null }) {
  const { addAccount, updateAccount } = useAccounts()
  const [formData, setFormData] = useState({
    name: '',
    currency: '₸',
    description: '',
    color: '#4CAF50'
  })

  const currencies = [
    { code: '₸', name: 'Тенге (KZT)' },
    { code: '₽', name: 'Рубль (RUB)' },
    { code: '$', name: 'Доллар (USD)' }
  ]

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        currency: account.currency,
        description: account.description || '',
        color: account.color
      })
    }
  }, [account])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const accountData = {
        ...formData,
        icon: '💰' // Фиксированная иконка для всех счетов
      }
      if (account) {
        await updateAccount(account.id, accountData)
      } else {
        await addAccount(accountData)
      }
      onClose()
    } catch (error) {
      console.error('Ошибка при сохранении счета:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
          {account ? 'Редактировать счет' : 'Добавить счет'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Название</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Валюта</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Цвет</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <textarea
              name="description"
              value={formData.description}
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
              {account ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AccountModal 