import { motion } from 'framer-motion'

const featuredGames = ['Free Fire', 'PUBG', 'BGMI', 'DLS 2026', 'Call of Duty']

export default function Home() {
  return (
    <main className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,255,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(138,43,226,0.16),_transparent_20%)] pointer-events-none" />
      <section className="relative mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex flex-col gap-8 rounded-[32px] border border-cyan-500/20 bg-[#08101d]/80 p-8 shadow-neon backdrop-blur-xl">
            <div className="space-y-4 text-center">
              <p className="text-cyan-300 uppercase tracking-[0.3em]">Welcome to the future of esports</p>
              <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl neon-text">
                Game Summer 2026
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-slate-300 sm:text-xl">
                Join live tournaments, track revenue, manage players, and stay connected with fast real-time notifications.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="glow-card rounded-3xl p-6">
                <h2 className="text-xl font-semibold text-cyan-200">Live Streams</h2>
                <div className="mt-4 grid gap-4">
                  <div className="h-24 rounded-3xl bg-[#02050b]/80 p-3 text-sm text-slate-300">YouTube Embed coming soon</div>
                  <div className="h-24 rounded-3xl bg-[#02050b]/80 p-3 text-sm text-slate-300">Facebook Channel</div>
                  <div className="h-24 rounded-3xl bg-[#02050b]/80 p-3 text-sm text-slate-300">Discord Live Room</div>
                </div>
              </div>

              <div className="glow-card rounded-3xl p-6">
                <h2 className="text-xl font-semibold text-cyan-200">Followers</h2>
                <p className="mt-4 text-5xl font-bold text-white">1.2M</p>
                <p className="mt-2 text-slate-300">Subscribers across platforms</p>
              </div>

              <div className="glow-card rounded-3xl p-6">
                <h2 className="text-xl font-semibold text-cyan-200">Supported Games</h2>
                <ul className="mt-4 space-y-2 text-slate-300">
                  {featuredGames.map((game) => (
                    <li key={game} className="rounded-2xl border border-white/10 bg-[#020817]/80 px-4 py-2">{game}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a href="/tournament" className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-7 py-3 text-sm font-semibold text-slate-950 shadow-neon transition hover:bg-cyan-400">
                Join Tournament
              </a>
              <a href="#" className="inline-flex items-center justify-center rounded-full border border-cyan-500/30 px-7 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/10">
                Watch Live
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
