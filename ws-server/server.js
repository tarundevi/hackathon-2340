import http from 'http'
import { WebSocketServer } from 'ws'

const port = process.env.PORT || 1234

// Simple echo server for now - will implement full y-websocket protocol
const server = http.createServer()
const wss = new WebSocketServer({ server })

const rooms = new Map()

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast to all clients in all rooms for now
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // OPEN
        client.send(message)
      }
    })
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })

  ws.on('close', () => {
    // cleanup
  })
})

server.listen(port, () => {
  console.log(`WebSocket server listening on port ${port}`)
})
