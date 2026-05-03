import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoaded(true)
  }, [])

  const login = async (username, password) => {
    const response = await api.post('/users/login/', { username, password })
    const { access, refresh } = response.data
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    const userResponse = await api.get('/users/me/')
    localStorage.setItem('user', JSON.stringify(userResponse.data))
    setUser(userResponse.data)
    return userResponse.data
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const register = async (payload) => {
    const response = await api.post('/users/register/', payload)
    return response.data
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loaded }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
