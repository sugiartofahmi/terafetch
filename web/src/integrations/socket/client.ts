import { io } from 'socket.io-client'

// autoConnect is off until a real backend exists to connect to.
// Call `socket.connect()` once a socket server is available.
export const socket = io(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3100',
  { autoConnect: false },
)
