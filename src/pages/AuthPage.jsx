import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'

function getAuthErrorMessage(error) {
  const responseData = error.response?.data

  if (typeof responseData?.detail === 'string') {
    return responseData.detail
  }

  if (responseData && typeof responseData === 'object') {
    const messages = Object.entries(responseData).flatMap(([field, value]) =>
      (Array.isArray(value) ? value : [value]).map((message) => `${field}: ${message}`)
    )
    if (messages.length) return messages.join(' ')
  }

  if (error.request && !error.response) {
    return 'Could not reach the server. Check that the backend is running and try again.'
  }

  return error.message || 'Unable to authenticate. Please try again.'
}

export default function AuthPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'login') {
        await login(form.username, form.password)
        toast.success('Welcome back!')
        navigate('/tournament')
      } else {
        await register({ ...form, role: 'user' })
        toast.success('Registration successful! Please log in.')
        setMode('login')
      }
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="glow-card rounded-[32px] border border-cyan-500/20 bg-[#08101d]/90 p-8 shadow-neon">
        <h1 className="text-3xl font-bold text-white">{mode === 'login' ? 'Login' : 'Register'}</h1>
        <p className="mt-2 text-slate-400">Secure access to tournaments and live dashboards.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-300">Username</label>
            <input
              name="username"
              autoComplete="username"
              required
              value={form.username}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-[#020917] px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>
          {mode === 'register' && (
            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-[#020917] px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>
          )}
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-white/10 bg-[#020917] px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>
          <button className="w-full rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <button className="mt-4 text-sm text-cyan-300 underline" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Create a new account' : 'Back to login'}
        </button>
      </div>
    </main>
  )
}
