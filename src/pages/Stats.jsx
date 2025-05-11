import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { transactionsAPI } from '../services/api'
import { useAccounts } from '../context/AccountContext'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

function Stats() {
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 6)))
  const [endDate, setEndDate] = useState(new Date())
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState(null)
  const { accounts, selectedAccount, setSelectedAccount } = useAccounts()

  useEffect(() => {
    loadTransactions()
  }, [startDate, endDate])

  const loadTransactions = async () => {
    try {
      const response = await transactionsAPI.getByPeriod(
        startDate.toISOString(),
        endDate.toISOString()
      )
      setTransactions(response.data)
    } catch (error) {
      setError('Ошибка при загрузке транзакций')
      console.error('Ошибка загрузки транзакций:', error)
    }
  }

  const handleAccountChange = (e) => {
    const selectedId = e.target.value
    if (!selectedId) {
      setSelectedAccount(null)
      return
    }
    const account = accounts.find(a => String(a.id) === String(selectedId))
    setSelectedAccount(account || null)
  }

  // Фильтруем транзакции по выбранному счету
  const filteredTransactions = selectedAccount
    ? transactions.filter(t => String(t.account?.id) === String(selectedAccount.id))
    : transactions

  // Группировка транзакций по месяцам
  const monthlyData = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date)
    // Используем полный формат даты для ключа
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    // Форматируем для отображения
    const displayMonth = date.toLocaleString('ru', { month: 'short', year: 'numeric' })
    const amount = Number(transaction.amount)
    
    if (!acc[monthYear]) {
      acc[monthYear] = { 
        month: displayMonth,
        monthYear: monthYear, // Сохраняем для сортировки
        доход: 0, 
        расход: 0 
      }
    }
    
    if (transaction.type === 'INCOME') {
      acc[monthYear].доход += amount
    } else {
      acc[monthYear].расход += amount
    }
    
    return acc
  }, {})

  // Сортируем по дате и преобразуем в массив
  const monthlyChartData = Object.values(monthlyData)
    .sort((a, b) => a.monthYear.localeCompare(b.monthYear))

  console.log('Transactions:', transactions)
  console.log('Monthly Data:', monthlyData)
  console.log('Chart Data:', monthlyChartData)

  // Группировка расходов по категориям
  const categoryData = filteredTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, transaction) => {
      const category = transaction.category || { name: 'Без категории', icon: '📦' }
      const amount = Number(transaction.amount)
      
      if (!acc[category.name]) {
        acc[category.name] = { 
          name: `${category.icon} ${category.name}`, 
          value: 0,
          icon: category.icon
        }
      }
      
      acc[category.name].value += amount
      return acc
    }, {})

  const categoryChartData = Object.values(categoryData)

  // Получение общей суммы расходов
  const getTotalExpenses = () => {
    return filteredTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0)
  }

  // Получение статистики по категориям
  const getCategoryStats = () => {
    const stats = filteredTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, transaction) => {
        const category = transaction.category || { id: 'no-category', name: 'Без категории', icon: '📦', color: '#607D8B' }
        const amount = Number(transaction.amount)
        
        if (!acc[category.id]) {
          acc[category.id] = {
            id: category.id,
            name: category.name,
            icon: category.icon,
            color: category.color,
            total: 0,
            count: 0
          }
        }
        
        acc[category.id].total += amount
        acc[category.id].count += 1
        return acc
      }, {})

    return Object.values(stats).sort((a, b) => b.total - a.total)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Статистика</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4 lg:px-8">
          {error && (
            <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
              {error}
            </div>
          )}

          {/* Фильтры */}
          <div className="bg-white shadow px-3 sm:px-4 py-4 sm:py-5 sm:rounded-lg sm:p-6 mb-4 sm:mb-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-base sm:text-lg font-medium leading-6 text-gray-900">Фильтры</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Выберите период и счет для отображения статистики
                </p>
              </div>
              <div className="mt-4 sm:mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                      Начало периода
                    </label>
                    <input
                      type="date"
                      name="start-date"
                      id="start-date"
                      value={startDate.toISOString().split('T')[0]}
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                      Конец периода
                    </label>
                    <input
                      type="date"
                      name="end-date"
                      id="end-date"
                      value={endDate.toISOString().split('T')[0]}
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                      Счет
                    </label>
                    <select
                      id="account"
                      name="account"
                      value={selectedAccount?.id || ''}
                      onChange={handleAccountChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Все счета</option>
                      {accounts.map(account => (
                        <option key={account.id} value={String(account.id)}>
                          {account.name} ({account.currency})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Графики */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            {/* График доходов и расходов */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-3 sm:px-4 py-4 sm:py-5 sm:p-6">
                <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-4">
                  Доходы и расходы по месяцам
                </h3>
                <div className="h-[300px] sm:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value.toLocaleString('ru-RU')} ₸`} />
                      <Legend />
                      <Bar dataKey="доход" fill="#4CAF50" />
                      <Bar dataKey="расход" fill="#F44336" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* График расходов по категориям */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-3 sm:px-4 py-4 sm:py-5 sm:p-6">
                <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-4">
                  Расходы по категориям
                </h3>
                <div className="h-[300px] sm:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toLocaleString('ru-RU')} ₸`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Stats 