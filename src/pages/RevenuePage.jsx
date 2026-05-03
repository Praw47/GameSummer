import { useEffect, useState } from 'react'
import { AreaChart, Area, BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../services/api'

export default function RevenuePage() {
  const [metrics, setMetrics] = useState({ hourly: [], daily: 0, monthly: 0, yearly: 0 })

  useEffect(() => {
    api.get('/analytics/revenue/').then((res) => setMetrics(res.data))
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="glow-card rounded-[32px] border border-cyan-500/20 bg-[#08101d]/90 p-8 shadow-neon">
        <h1 className="text-3xl font-semibold text-white">Revenue Dashboard</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-[#020817]/90 p-5">
            <p className="text-sm text-slate-400">Hourly</p>
            <p className="mt-3 text-3xl font-semibold text-white">${metrics.hourly.reduce((sum, item) => sum + Number(item.amount || 0), 0).toFixed(2)}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#020817]/90 p-5">
            <p className="text-sm text-slate-400">Daily</p>
            <p className="mt-3 text-3xl font-semibold text-white">${metrics.daily}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#020817]/90 p-5">
            <p className="text-sm text-slate-400">Monthly</p>
            <p className="mt-3 text-3xl font-semibold text-white">${metrics.monthly}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#020817]/90 p-5">
            <p className="text-sm text-slate-400">Yearly</p>
            <p className="mt-3 text-3xl font-semibold text-white">${metrics.yearly}</p>
          </div>
        </div>
        <div className="mt-10 h-[360px] rounded-3xl border border-white/10 bg-[#020817]/90 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.hourly} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1f2937" />
              <XAxis dataKey="hour" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#020817', border: '1px solid #334155' }} />
              <Area type="monotone" dataKey="amount" stroke="#22d3ee" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  )
}
