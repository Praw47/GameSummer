import { useEffect, useState } from 'react'
import api from '../services/api'

export default function LiveStreamPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/payments/public/settings/')
      .then((res) => {
        setSettings(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-cyan-400">Loading...</div>
        </div>
      </main>
    )
  }

  const isLiveEnabled = settings?.youtube_live_enabled
  const youtubeUrl = settings?.youtube_live_url
  const viewersCount = settings?.live_viewers_count || 0

  // Convert regular YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}?autoplay=1&mute=1` : null
  }

  const embedUrl = getEmbedUrl(youtubeUrl)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="glow-card rounded-[32px] border border-cyan-500/20 bg-[#08101d]/90 p-8 shadow-neon">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-white">Live Stream</h1>
            <p className="mt-2 text-slate-300">Watch live tournaments and events</p>
          </div>
          {isLiveEnabled && (
            <div className="flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-red-400 text-sm font-medium">LIVE</span>
            </div>
          )}
        </div>

        {isLiveEnabled && embedUrl ? (
          <div className="space-y-6">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe
                src={embedUrl}
                title="Live Stream"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <div className="flex items-center justify-between bg-[#020917] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-slate-300">Live Viewers</span>
              </div>
              <span className="text-2xl font-bold text-cyan-400">{viewersCount.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-20 h-20 mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Live Stream Available</h2>
            <p className="text-slate-400 max-w-md">
              There is no live stream currently active. Check back later for live tournament broadcasts.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}