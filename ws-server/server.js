const http = require('http')
const WebSocket = require('ws')

const port = process.env.PORT || 1234

const server = http.createServer()
const wss = new WebSocket.Server({ server })

// Room tracking
const rooms = new Map()

function getOrCreateRoom(name) {
  if (!rooms.has(name)) {
    rooms.set(name, new Set())
  }
  return rooms.get(name)
}

function parseRoomName(message) {
  // y-websocket protocol: message[0] is messageType, then room name
  // Format: [messageType, ...varInt(roomNameLength), ...roomName, ...rest]
  if (message.length < 2) return null

  try {
    let offset = 1
    let length = 0
    let byte = 0
    let shift = 0

    // Read varInt encoded length
    do {
      byte = message[offset++]
      length |= (byte & 0x7f) << shift
      shift += 7
    } while (byte & 0x80)

    if (offset + length > message.length) return null

    const roomName = message.toString('utf8', offset, offset + length)
    return roomName
  } catch (e) {
    return null
  }
}

console.log(`WebSocket server listening on port ${port}`)

wss.on('connection', (ws) => {
  let room = null

  ws.on('message', (message) => {
    // First message - extract room name
    if (!room) {
      const roomName = parseRoomName(message)
      console.log(`Parsing room name: ${roomName}, message length: ${message.length}, first bytes: ${Array.from(message.slice(0, 10)).join(',')}`)
      if (roomName) {
        room = getOrCreateRoom(roomName)
        room.add(ws)
        console.log(`Client joined room: ${roomName} (total in room: ${room.size})`)
      } else {
        console.log('Failed to parse room name, broadcasting to all')
        // Fallback: broadcast to all if we can't parse room
        room = { broadcast: true, size: 1 }
      }
    }

    // Broadcast to all clients in this room
    if (room && room.broadcast) {
      // Broadcast to all
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    } else if (room) {
      room.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    }
  })

  ws.on('close', () => {
    if (room && room instanceof Set) {
      room.delete(ws)
      console.log('Client disconnected from room')
    }
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

server.listen(port)
