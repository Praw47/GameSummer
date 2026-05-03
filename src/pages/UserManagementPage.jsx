import { useEffect, useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'

export default function UserManagementPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/users/admin/users/').then((res) => setUsers(res.data))
  }, [])

  const updateRole = async (id, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin'
      await api.patch(`/users/admin/users/${id}/`, { role: newRole })
      setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)))
      toast.success('User role updated.')
    } catch (err) {
      toast.error('Unable to update role.')
    }
  }

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/admin/users/${id}/`)
      setUsers(users.filter((user) => user.id !== id))
      toast.success('User removed.')
    } catch (err) {
      toast.error('Unable to delete user.')
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="glow-card rounded-[32px] border border-fuchsia-500/20 bg-[#08101d]/90 p-8 shadow-neon">
        <h1 className="text-3xl font-semibold text-white">User Management</h1>
        <p className="mt-2 text-slate-400">Create, edit roles, and remove tournament users.</p>
        <div className="mt-8 overflow-x-auto">
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
                  <td className="px-4 py-4 flex gap-2">
                    <button className="rounded-full bg-cyan-500/15 px-3 py-1 text-sm text-cyan-100 transition hover:bg-cyan-500/30" onClick={() => updateRole(user.id, user.role)}>
                      {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </button>
                    <button className="rounded-full bg-red-500/15 px-3 py-1 text-sm text-red-200 transition hover:bg-red-500/30" onClick={() => deleteUser(user.id)}>
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
