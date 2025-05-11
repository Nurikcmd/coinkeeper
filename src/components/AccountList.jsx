import { useState } from 'react'
import { useAccounts } from '../context/AccountContext'
import AccountModal from './AccountModal'

function AccountList() {
  const { accounts, deleteAccount } = useAccounts()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)

  const handleEdit = (account) => {
    setSelectedAccount(account)
    setIsModalOpen(true)
  }

  const handleDelete = async (accountId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот счет?')) {
      try {
        await deleteAccount(accountId)
      } catch (error) {
        console.error('Ошибка при удалении счета:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAccount(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Счета</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Добавить счет
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white overflow-hidden shadow rounded-lg"
            style={{ borderLeft: `4px solid ${account.color}` }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{account.icon}</span>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-500">{account.currency}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(account)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              {account.description && (
                <p className="mt-2 text-sm text-gray-500">{account.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <AccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        account={selectedAccount}
      />
    </div>
  )
}

export default AccountList 