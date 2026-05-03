import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import TournamentPage from './pages/TournamentPage'
import AdminDashboard from './pages/AdminDashboard'
import RevenuePage from './pages/RevenuePage'
import UserManagementPage from './pages/UserManagementPage'
import UserHistoryPage from './pages/UserHistoryPage'
import LiveStreamPage from './pages/LiveStreamPage'
import Navbar from './components/Navbar'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-[#050914] text-white">
      <Navbar />
      <ToastContainer position="top-right" theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/tournament" element={user ? <TournamentPage /> : <Navigate replace to="/auth" />} />
        <Route path="/live" element={<LiveStreamPage />} />
        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate replace to="/" />} />
        <Route path="/revenue" element={isAdmin ? <RevenuePage /> : <Navigate replace to="/" />} />
        <Route path="/users" element={isAdmin ? <UserManagementPage /> : <Navigate replace to="/" />} />
        <Route path="/history" element={isAdmin ? <UserHistoryPage /> : <Navigate replace to="/" />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  )
}

export default App
