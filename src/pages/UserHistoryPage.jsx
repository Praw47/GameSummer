import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function UserHistoryPage() {
  const [userHistory, setUserHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetail, setUserDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    api.get('/users/admin/history/')
      .then((res) => {
        setUserHistory(res.data)
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load user history')
        setLoading(false)
      })
  }, [])

  const viewUserDetail = async (userId) => {
    setSelectedUser(userId)
    setDetailLoading(true)
    try {
      const res = await api.get(`/users/admin/history/${userId}/`)
      setUserDetail(res.data)
    } catch (err) {
      toast.error('Failed to load user details')
    }
    setDetailLoading(false)
  }

  const closeDetail = () => {
    setSelectedUser(null)
    setUserDetail(null)
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-cyan-400">Loading...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="glow-card rounded-[32px] border border-fuchsia-500/20 bg-[#08101d]/90 p-8 shadow-neon">
        <h1 className="text-3xl font-semibold text-white">User History</h1>
        <p className="mt-2 text-slate-400">View all user registration and payment history</p>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-300">
            <thead>
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Total Tournaments</th>
                <th className="px-4 py-3">Total Spent</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {userHistory.map((user) => (
                <tr key={user.user_id}>
                  <td className="px-4 py-4 text-white font-medium">{user.username}</td>
                  <td className="px-4 py-4">{user.email || '—'}</td>
                  <td className="px-4 py-4">{user.registrations.length}</td>
                  <td className="px-4 py-4 text-cyan-400">${user.total_spent.toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <button 
                      onClick={() => viewUserDetail(user.user_id)}
                      className="rounded-full bg-cyan-500/15 px-3 py-1 text-sm text-cyan-100 transition hover:bg-cyan-500/30"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {userHistory.length === 0 && (
            <p className="mt-8 text-center text-slate-400">No user history found.</p>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glow-card w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-[32px] border border-cyan-500/20 bg-[#08101d]/95 p-8 shadow-neon">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">
                {userDetail?.user?.username}'s History
              </h2>
              <button 
                onClick={closeDetail}
                className="text-slate-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="text-cyan-400">Loading...</div>
              </div>
            ) : userDetail && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#020917] rounded-2xl p-4">
                    <div className="text-slate-400 text-sm">Total Tournaments</div>
                    <div className="text-2xl font-bold text-cyan-400">{userDetail.total_tournaments}</div>
                  </div>
                  <div className="bg-[#020917] rounded-2xl p-4">
                    <div className="text-slate-400 text-sm">Total Spent</div>
                    <div className="text-2xl font-bold text-cyan-400">${userDetail.total_spent.toFixed(2)}</div>
                  </div>
                </div>

                {/* Tournament Registrations */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Tournament Registrations</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {userDetail.tournament_registrations.map((reg) => (
                      <div key={reg.id} className="bg-[#020917] rounded-2xl p-4 border border-white/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-white font-medium">{reg.tournament?.title}</div>
                            <div className="text-slate-400 text-sm">{reg.tournament?.game?.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-cyan-400">${reg.entry_amount}</div>
                            <div className="text-slate-500 text-xs">{new Date(reg.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          Ticket: {reg.ticket_id}
                        </div>
                      </div>
                    ))}
                    {userDetail.tournament_registrations.length === 0 && (
                      <p className="text-slate-400">No tournament registrations</p>
                    )}
                  </div>
                </div>

                {/* Payment Transactions */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Transactions</h3>
                  <div className="space-y-3">
                    {userDetail.payment_transactions.map((payment) => (
                      <div key={payment.id} className="bg-[#020917] rounded-2xl p-4 border border-white/5 flex justify-between">
                        <div>
                          <div className="text-white">${payment.amount}</div>
                          <div className="text-slate-500 text-xs">{new Date(payment.created_at).toLocaleDateString()}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    ))}
                    {userDetail.payment_transactions.length === 0 && (
                      <p className="text-slate-400">No payment transactions</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}