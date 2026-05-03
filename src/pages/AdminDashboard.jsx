import { useEffect, useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ active_tournaments: 0, active_entries: 0 })
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/tournaments/admin/stats/').then((res) => setStats(res.data))
    api.get('/users/admin/users/').then((res) => setUsers(res.data))
  }, [])

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/users/admin/users/${id}/`)
      setUsers(users.filter((user) => user.id !== id))
      toast.success('User deleted successfully')
    } catch (err) {
      toast.error('Unable to delete user')
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glow-card rounded-[32px] border border-cyan-500/20 bg-[#08101d]/90 p-6 shadow-neon">
          <p className="text-sm text-slate-300 uppercase tracking-[0.3em]">Live Dashboard</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">{stats.active_tournaments}</h2>
          <p className="mt-2 text-slate-400">Active tournaments</p>
        </div>
        <div className="glow-card rounded-[32px] border border-cyan-500/20 bg-[#08101d]/90 p-6 shadow-neon">
          <p className="text-sm text-slate-300 uppercase tracking-[0.3em]">Participants</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">{stats.active_entries}</h2>
          <p className="mt-2 text-slate-400">Registered entries</p>
        </div>
        <div className="glow-card rounded-[32px] border border-cyan-500/20 bg-[#08101d]/90 p-6 shadow-neon">
          <p className="text-sm text-slate-300 uppercase tracking-[0.3em]">Users</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">{users.length}</h2>
          <p className="mt-2 text-slate-400">Total accounts managed</p>
        </div>
      </div>

      <section className="mt-10 glow-card rounded-[32px] border border-fuchsia-500/20 bg-[#08101d]/90 p-6 shadow-neon">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-white">User Management</h3>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-300">
            <thead>
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-4 text-white">{user.username}</td>
                  <td className="px-4 py-4">{user.email || '—'}</td>
                  <td className="px-4 py-4">{user.role}</td>
                  <td className="px-4 py-4">
                    <button className="rounded-full bg-red-500/15 px-3 py-1 text-sm text-red-200 transition hover:bg-red-500/30" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
