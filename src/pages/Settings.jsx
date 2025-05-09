import { useState, useEffect } from 'react'
import { categoriesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Settings() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'EXPENSE',
    icon: '📦',
    color: '#4CAF50'
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll()
      setCategories(response.data)
    } catch (error) {
      setError('Ошибка при загрузке категорий')
      console.error('Ошибка загрузки категорий:', error)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      await categoriesAPI.create(newCategory)
      setNewCategory({ name: '', type: 'EXPENSE', icon: '📦', color: '#4CAF50' })
      loadCategories()
    } catch (error) {
      setError('Ошибка при создании категории')
      console.error('Ошибка создания категории:', error)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }
    
    try {
      await categoriesAPI.delete(id)
      loadCategories()
      setError(null)
    } catch (error) {
      if (error.response?.status === 403) {
        setError('У вас нет прав для удаления этой категории')
      } else if (error.response?.status === 404) {
        setError('Категория не найдена')
      } else {
        setError('Ошибка при удалении категории')
      }
      console.error('Ошибка удаления категории:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Настройки</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4 lg:px-8">
          {error && (
            <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
              {error}
            </div>
          )}

          {/* Категории */}
          <div className="bg-white shadow sm:rounded-lg mb-4 sm:mb-6">
            <div className="px-3 sm:px-4 py-4 sm:py-5 sm:p-6">
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">Категории</h3>
              <div className="mt-4 sm:mt-5">
                <div className="space-y-3 sm:space-y-4">
                  {/* Список категорий */}
                  {categories.map((category) => (
                    <div key={category.id} className="bg-gray-50 px-3 sm:px-4 py-4 sm:py-5 sm:rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center">
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: category.color }}
                          >
                            <span className="text-white font-medium">{category.icon}</span>
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                            <p className="text-sm text-gray-500">
                              {category.type === 'EXPENSE' ? 'Расходы' : 'Доходы'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full sm:w-auto justify-center"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Форма добавления категории */}
                  <form onSubmit={handleAddCategory} className="mt-4 sm:mt-6">
                    <h4 className="text-sm font-medium text-gray-900">Добавить категорию</h4>
                    <div className="mt-2 grid grid-cols-1 gap-y-4 sm:gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
                          Название
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="category-name"
                            id="category-name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            required
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="category-type" className="block text-sm font-medium text-gray-700">
                          Тип
                        </label>
                        <div className="mt-1">
                          <select
                            id="category-type"
                            name="category-type"
                            value={newCategory.type}
                            onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="INCOME">Доход</option>
                            <option value="EXPENSE">Расход</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
                      >
                        Добавить категорию
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Настройки профиля */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-3 sm:px-4 py-4 sm:py-5 sm:p-6">
              <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">Профиль</h3>
              <div className="mt-4 sm:mt-5">
                <div className="grid grid-cols-1 gap-y-4 sm:gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Имя
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={user?.name || ''}
                        disabled
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings 