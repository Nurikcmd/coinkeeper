import { useState } from 'react'
import { useTransactions } from '../context/TransactionContext'
import AddTransactionModal from '../components/AddTransactionModal'
import EditTransactionModal from '../components/EditTransactionModal'

function Dashboard() {
  const { transactions, getBalance, deleteTransaction } = useTransactions()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
      deleteTransaction(id)
    }
  }

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction)
    setIsEditModalOpen(true)
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Главная</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Добавить транзакцию
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-8">
        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Текущий баланс</h2>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">₽ {getBalance().toLocaleString()}</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">Последние транзакции</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{transaction.category.name}</p>
                  <p className="text-sm text-gray-500">{transaction.comment}</p>
                </div>
                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}₽ {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedTransaction(null)
        }}
        transaction={selectedTransaction}
      />
    </div>
  )
}

export default Dashboard 