'use strict'

const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const port = process.env.PORT || 3000

let rooms = {
  global: true
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', (req, res) => {
  res.write('Add a <script src="/socket.io/socket.io.js"></script> \n ' +
            'and a <script src="/bitscouts.js"></script> to your page')
  res.end()
})

app.get('/bitscouts.js', (req, res) => {
  res.sendFile(__dirname + '/bitscouts.js')
})

app.get('/__test__', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
  let room = 'global'
  socket.join(room)

  socket.on('join', data => {
    if (data.room && data.room !== room) {
      if (!rooms[data.room]) {
        rooms[data.room] = true
      }

      room = data.room
      socket.join(room)
    }
  })

  socket.on('post', data => {
    if (data.message && data.message !== '') {
      io.to(room).emit('message', data.message)
    }
  })
})

http.listen(port, _  => {
  console.log('Listening on *:3000')
})