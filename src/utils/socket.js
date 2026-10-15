const apiUrl = new URL(
  import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV
      ? import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'
      : ''),
)
apiUrl.protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:'
apiUrl.pathname = '/ws/notifications/'
apiUrl.search = ''
apiUrl.hash = ''
const SOCKET_URL = apiUrl.toString()

export function createSocket(onMessage, onOpen) {
  const socket = new WebSocket(SOCKET_URL)
  socket.onopen = () => {
    if (onOpen) onOpen()
  }
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (onMessage) onMessage(data)
    } catch (error) {
      console.error(error)
    }
  }
  return socket
}
