import { useState, useEffect } from 'react'
import { useTransactions } from '../context/TransactionContext'
import { useAccounts } from '../context/AccountContext'
import AddTransactionModal from '../components/AddTransactionModal'
import EditTransactionModal from '../components/EditTransactionModal'

function Dashboard() {
  const { transactions, getBalance, deleteTransaction } = useTransactions()
  const { accounts, selectedAccount, setSelectedAccount } = useAccounts()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showAllTransactions, setShowAllTransactions] = useState(false)

  useEffect(() => {
    console.log('Текущий выбранный счет:', selectedAccount)
    console.log('Доступные счета:', accounts)
  }, [selectedAccount, accounts])

  const filteredTransactions = selectedAccount
    ? transactions.filter(t => String(t.account?.id) === String(selectedAccount.id))
    : transactions

  const displayedTransactions = showAllTransactions
    ? filteredTransactions
    : filteredTransactions.slice(0, 5)

  const totalBalance = accounts.reduce((sum, account) => {
    const accountTransactions = transactions.filter(t => String(t.account?.id) === String(account.id))
    const balance = accountTransactions.reduce((acc, t) => {
      return acc + (t.type === 'INCOME' ? t.amount : -t.amount)
    }, 0)
    return sum + balance
  }, 0)

  const selectedAccountBalance = selectedAccount
    ? transactions
        .filter(t => String(t.account?.id) === String(selectedAccount.id))
        .reduce((acc, t) => acc + (t.type === 'INCOME' ? t.amount : -t.amount), 0)
    : 0

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
      deleteTransaction(id)
    }
  }

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction)
    setIsEditModalOpen(true)
  }

  const handleAccountChange = (e) => {
    const selectedId = e.target.value
    console.log('Выбран ID счета:', selectedId)
    
    if (!selectedId) {
      console.log('Выбрано "Все счета"')
      setSelectedAccount(null)
      return
    }

    const account = accounts.find(a => String(a.id) === String(selectedId))
    console.log('Найденный счет:', account)
    setSelectedAccount(account || null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Выбор счета */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Выберите счет</label>
          <select
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

        {/* Общий баланс */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Общий баланс</h3>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              {totalBalance.toLocaleString()} ₸
            </div>
          </div>
        </div>

        {/* Баланс выбранного счета */}
        {selectedAccount && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Баланс счета {selectedAccount.name}
              </h3>
              <div className="mt-2 text-3xl font-semibold text-gray-900">
                {selectedAccountBalance.toLocaleString()} {selectedAccount.currency}
              </div>
            </div>
          </div>
        )}

        {/* Последние транзакции */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Последние транзакции</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Добавить транзакцию
              </button>
            </div>
            <div className="mt-4">
              {displayedTransactions.length > 0 ? (
                <div className="space-y-4">
                  {displayedTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: transaction.category?.color || '#E5E7EB' }}
                        >
                          <span className="text-lg">
                            {transaction.category?.icon || '📦'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.category?.name || 'Без категории'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.account?.name} - {transaction.comment || ''}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div
                            className={`text-sm font-medium ${
                              transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'INCOME' ? '+' : '-'}
                            {transaction.amount.toLocaleString()} {transaction.account?.currency || '₸'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredTransactions.length > 5 && (
                    <button
                      onClick={() => setShowAllTransactions(!showAllTransactions)}
                      className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
                    >
                      {showAllTransactions ? 'Показать меньше' : 'Показать все'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Нет транзакций
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

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