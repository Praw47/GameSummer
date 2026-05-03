import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../services/api'
import { createSocket } from '../utils/socket'

export default function TournamentPage() {
  const [tournaments, setTournaments] = useState([])
  const [entries, setEntries] = useState([])
  const [form, setForm] = useState({ tournament_id: '', username: '', entry_amount: '' })
  const [socketMessage, setSocketMessage] = useState('Connecting...')
  const [paymentSettings, setPaymentSettings] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [pendingEntry, setPendingEntry] = useState(null)

  useEffect(() => {
    api.get('/tournaments/').then((res) => setTournaments(res.data))
    api.get('/tournaments/me/').then((res) => setEntries(res.data))
    
    // Get payment settings with QR code
    api.get('/payments/public/payment/')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setPaymentSettings(res.data[0])
        }
      })
      .catch(() => {})
    
    const socket = createSocket((data) => {
      if (data?.message) setSocketMessage(data.message)
    })
    return () => socket.close()
  }, [])

  // Update entry amount when tournament is selected
  useEffect(() => {
    if (form.tournament_id) {
      const tournament = tournaments.find(t => t.id === parseInt(form.tournament_id))
      if (tournament) {
        setForm(prev => ({ ...prev, entry_amount: tournament.entry_fee }))
      }
    }
  }, [form.tournament_id, tournaments])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Store pending entry and show payment modal
      setPendingEntry(form)
      setShowPaymentModal(true)
    } catch (err) {
      toast.error('Failed to register. Check your inputs.')
    }
  }

  const confirmPayment = async () => {
    try {
      await api.post('/tournaments/register/', pendingEntry)
      toast.success('Tournament registration request submitted! Waiting for payment confirmation.')
      setForm({ tournament_id: '', username: '', entry_amount: '' })
      setShowPaymentModal(false)
      setPendingEntry(null)
      const response = await api.get('/tournaments/me/')
      setEntries(response.data)
    } catch (err) {
      toast.error('Failed to submit registration. Check your inputs.')
      setShowPaymentModal(false)
    }
  }

  const selectedTournament = tournaments.find(t => t.id === parseInt(form.tournament_id))

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="glow-card rounded-[32px] border border-cyan-500/20 bg-[#08101d]/90 p-8 shadow-neon">
          <h1 className="text-3xl font-semibold text-white">Tournament Registration</h1>
          <p className="mt-2 text-slate-300">Register now and receive your unique ticket instantly.</p>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-slate-300">Select Game</label>
              <select
                name="tournament_id"
                value={form.tournament_id}
                onChange={(e) => setForm({ ...form, tournament_id: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-[#020917] px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
                <option value="">Choose a tournament</option>
                {tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>
                    {tournament.title} — {tournament.game?.name || 'Game'} (${tournament.entry_fee})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300">Player Name</label>
              <input
                name="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-[#020917] px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Entry Amount (Admin Controlled)</label>
              <input
                name="entry_amount"
                type="number"
                value={form.entry_amount}
                readOnly
                className="mt-2 w-full rounded-3xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-cyan-400 outline-none cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-slate-500">Entry fee is set by admin</p>
            </div>
            <button className="w-full rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              Proceed to Payment
            </button>
          </form>
        </section>

        <aside className="glow-card rounded-[32px] border border-fuchsia-500/10 bg-[#08101d]/90 p-8 shadow-neon">
          <h2 className="text-2xl font-semibold text-white">Live Notifications</h2>
          <p className="mt-3 text-slate-300">{socketMessage}</p>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl bg-[#020817]/80 p-5">
              <h3 className="text-sm uppercase tracking-[0.16em] text-cyan-300">My Registrations</h3>
              {entries.length ? (
                <ul className="mt-3 space-y-3 text-slate-300">
                  {entries.map((entry) => (
                    <li key={entry.id} className="rounded-3xl border border-white/10 bg-[#02050b]/90 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-white">
                            {entry.ticket_number ? `Ticket: ${entry.ticket_number}` : 'Ticket: Pending Payment'}
                          </div>
                          <div className="text-sm">{entry.username} • Amount: ${entry.entry_amount}</div>
                          <div className="text-sm">{entry.tournament?.title}</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          entry.payment_status === 'confirmed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : entry.payment_status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {entry.payment_status === 'confirmed' ? 'Confirmed' : 
                           entry.payment_status === 'pending' ? 'Payment Pending' : 'Cancelled'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-400">No tournament registrations yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Payment Modal with QR Code */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glow-card w-full max-w-md rounded-[32px] border border-cyan-500/20 bg-[#08101d]/95 p-8 shadow-neon">
            <h2 className="text-2xl font-semibold text-white mb-6">Complete Payment</h2>
            
            <div className="space-y-4">
              <div className="bg-[#020917] rounded-2xl p-4">
                <div className="text-slate-400 text-sm">Tournament</div>
                <div className="text-white font-medium">{selectedTournament?.title}</div>
              </div>
              
              <div className="bg-[#020917] rounded-2xl p-4">
                <div className="text-slate-400 text-sm">Entry Fee</div>
                <div className="text-2xl font-bold text-cyan-400">${form.entry_amount}</div>
              </div>

              {/* QR Code Display */}
              {paymentSettings?.qr_code_image_url && (
                <div className="bg-white rounded-2xl p-4 text-center">
                  <img 
                    src={paymentSettings.qr_code_image_url} 
                    alt="Payment QR Code" 
                    className="w-48 h-48 mx-auto object-contain"
                  />
                  <p className="mt-2 text-xs text-gray-600">Scan to pay</p>
                </div>
              )}

              {/* Payment Instructions */}
              {paymentSettings?.payment_instructions && (
                <div className="bg-[#020917] rounded-2xl p-4">
                  <div className="text-slate-400 text-sm mb-2">Payment Instructions</div>
                  <p className="text-white text-sm">{paymentSettings.payment_instructions}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmPayment}
                  className="flex-1 rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
