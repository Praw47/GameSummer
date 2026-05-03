const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:8000/ws/notifications/'

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
