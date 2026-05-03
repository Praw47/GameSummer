import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/tournament', label: 'Tournament' },
  { to: '/live', label: 'Live Stream' },
]

const adminLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/revenue', label: 'Revenue' },
  { to: '/users', label: 'Users' },
  { to: '/history', label: 'History' },
]

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = user?.role === 'admin'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060912]/80 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.15)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <div className="rounded-2xl border border-cyan-500/30 bg-[#07101f]/80 px-4 py-2 text-sm font-semibold text-cyan-200 shadow-neon">
            GAME SUMMER 2026
          </div>

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 md:hidden"
            aria-label="Toggle navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <nav className={`${mobileOpen ? 'flex' : 'hidden'} w-full flex-col gap-3 rounded-3xl border border-white/10 bg-[#07101f]/95 px-4 py-4 text-center shadow-neon md:static md:w-auto md:flex md:flex-row md:flex-wrap md:items-center md:gap-4 md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none`}>
            {links.map((link) => (
              <motion.div whileHover={{ y: -2 }} key={link.to}>
                <Link className="block text-sm text-slate-300 hover:text-cyan-200 md:inline" to={link.to} onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
            {isAdmin && adminLinks.map((link) => (
              <motion.div whileHover={{ y: -2 }} key={link.to}>
                <Link className="block text-sm text-fuchsia-300 hover:text-fuchsia-200 md:inline" to={link.to} onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-sm text-slate-300">
                {user.username}
                {isAdmin && <span className="ml-2 text-xs bg-fuchsia-500/20 text-fuchsia-300 px-2 py-0.5 rounded-full">Admin</span>}
              </div>
              <button onClick={handleLogout} className="rounded-full bg-cyan-500/15 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-500/40">
                Logout
              </button>
            </>
          ) : (
            <Link className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400" to="/auth">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
