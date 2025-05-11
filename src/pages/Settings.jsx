import { useState, useEffect } from 'react'
import { categoriesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import AccountList from '../components/AccountList'

function Settings() {
  const { user, logout } = useAuth()
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
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
      console.log('Отправляемые данные категории:', newCategory)
      const response = await categoriesAPI.create(newCategory)
      console.log('Ответ сервера:', response)
      setNewCategory({ name: '', type: 'EXPENSE', icon: '📦', color: '#4CAF50' })
      loadCategories()
    } catch (error) {
      console.error('Ошибка создания категории:', error)
      console.error('Детали ошибки:', error.response?.data)
      setError('Ошибка при создании категории: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
  }

  const handleUpdateCategory = async (e) => {
    e.preventDefault()
    try {
      await categoriesAPI.update(editingCategory.id, editingCategory)
      setEditingCategory(null)
      loadCategories()
      setError(null)
    } catch (error) {
      if (error.response?.status === 403) {
        setError('У вас нет прав для редактирования этой категории')
      } else if (error.response?.status === 404) {
        setError('Категория не найдена')
      } else {
        setError('Ошибка при обновлении категории')
      }
      console.error('Ошибка обновления категории:', error)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Профиль</h2>
          <div className="mt-4 bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 text-sm text-gray-900">{user?.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Имя пользователя</label>
                <div className="mt-1 text-sm text-gray-900">{user?.username}</div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={logout}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="mt-4">
            <AccountList />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900">Категории</h2>
          {error && (
            <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
              {error}
            </div>
          )}

          <div className="mt-4 bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
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
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditCategory(category)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
                    >
                      Редактировать
                    </button>
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

              {editingCategory && (
                <form onSubmit={handleUpdateCategory} className="mt-4 sm:mt-6 border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900">Редактировать категорию</h4>
                  <div className="mt-2 grid grid-cols-1 gap-y-4 sm:gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="edit-category-name" className="block text-sm font-medium text-gray-700">
                        Название
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="edit-category-name"
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          required
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="edit-category-type" className="block text-sm font-medium text-gray-700">
                        Тип
                      </label>
                      <div className="mt-1">
                        <select
                          id="edit-category-type"
                          value={editingCategory.type}
                          onChange={(e) => setEditingCategory({ ...editingCategory, type: e.target.value })}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="INCOME">Доход</option>
                          <option value="EXPENSE">Расход</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="edit-category-icon" className="block text-sm font-medium text-gray-700">
                        Иконка
                      </label>
                      <div className="mt-1">
                        <select
                          id="edit-category-icon"
                          value={editingCategory.icon}
                          onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="📦">📦 Коробка</option>
                          <option value="🍔">🍔 Еда</option>
                          <option value="🚗">🚗 Транспорт</option>
                          <option value="🏠">🏠 Жилье</option>
                          <option value="👕">👕 Одежда</option>
                          <option value="💊">💊 Здоровье</option>
                          <option value="🎮">🎮 Развлечения</option>
                          <option value="📱">📱 Техника</option>
                          <option value="💰">💰 Зарплата</option>
                          <option value="🎁">🎁 Подарки</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="edit-category-color" className="block text-sm font-medium text-gray-700">
                        Цвет
                      </label>
                      <div className="mt-1">
                        <select
                          id="edit-category-color"
                          value={editingCategory.color}
                          onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="#4CAF50">Зеленый</option>
                          <option value="#2196F3">Синий</option>
                          <option value="#F44336">Красный</option>
                          <option value="#FFC107">Желтый</option>
                          <option value="#9C27B0">Фиолетовый</option>
                          <option value="#FF9800">Оранжевый</option>
                          <option value="#795548">Коричневый</option>
                          <option value="#607D8B">Серый</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Сохранить
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              )}

              <form onSubmit={handleAddCategory} className="mt-4 sm:mt-6 border-t pt-4">
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
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="INCOME">Доход</option>
                        <option value="EXPENSE">Расход</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="category-icon" className="block text-sm font-medium text-gray-700">
                      Иконка
                    </label>
                    <div className="mt-1">
                      <select
                        id="category-icon"
                        name="category-icon"
                        value={newCategory.icon}
                        onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="📦">📦 Коробка</option>
                        <option value="🍔">🍔 Еда</option>
                        <option value="🚗">🚗 Транспорт</option>
                        <option value="🏠">🏠 Жилье</option>
                        <option value="👕">👕 Одежда</option>
                        <option value="💊">💊 Здоровье</option>
                        <option value="🎮">🎮 Развлечения</option>
                        <option value="📱">📱 Техника</option>
                        <option value="💰">💰 Зарплата</option>
                        <option value="🎁">🎁 Подарки</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="category-color" className="block text-sm font-medium text-gray-700">
                      Цвет
                    </label>
                    <div className="mt-1">
                      <select
                        id="category-color"
                        name="category-color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="#4CAF50">Зеленый</option>
                        <option value="#2196F3">Синий</option>
                        <option value="#F44336">Красный</option>
                        <option value="#FFC107">Желтый</option>
                        <option value="#9C27B0">Фиолетовый</option>
                        <option value="#FF9800">Оранжевый</option>
                        <option value="#795548">Коричневый</option>
                        <option value="#607D8B">Серый</option>
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
    </div>
  )
}

export default Settings 