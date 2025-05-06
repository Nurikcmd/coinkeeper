import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

const monthlyData = [
  { month: 'Янв', доход: 100000, расход: 80000 },
  { month: 'Фев', доход: 120000, расход: 90000 },
  { month: 'Мар', доход: 150000, расход: 100000 },
  { month: 'Апр', доход: 130000, расход: 95000 },
  { month: 'Май', доход: 140000, расход: 110000 },
  { month: 'Июн', доход: 160000, расход: 120000 },
]

const categoryData = [
  { name: 'Продукты', value: 40000 },
  { name: 'Транспорт', value: 20000 },
  { name: 'Развлечения', value: 15000 },
  { name: 'Коммунальные', value: 25000 },
  { name: 'Прочее', value: 10000 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

function Stats() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Статистика</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Фильтры */}
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Фильтры</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Выберите период для отображения статистики
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                      Начало периода
                    </label>
                    <input
                      type="date"
                      name="start-date"
                      id="start-date"
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                      Конец периода
                    </label>
                    <input
                      type="date"
                      name="end-date"
                      id="end-date"
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Графики */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* График доходов и расходов */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Доходы и расходы по месяцам
                </h3>
                <div className="h-80">
                  <BarChart
                    width={500}
                    height={300}
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="доход" fill="#4CAF50" />
                    <Bar dataKey="расход" fill="#F44336" />
                  </BarChart>
                </div>
              </div>
            </div>

            {/* График расходов по категориям */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Расходы по категориям
                </h3>
                <div className="h-80">
                  <PieChart width={500} height={300}>
                    <Pie
                      data={categoryData}
                      cx={250}
                      cy={150}
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
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