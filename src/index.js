const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const twitter = require('./lib/twitter')
const EventEmitter = require('events')

// Create emitter for twitter stream
class TwitterEmitter extends EventEmitter {}
const tweetStream = new TwitterEmitter()

const PORT = process.env.PORT || 8080
const CLIENT_PATH = path.resolve(__dirname, '../client')

// Start twitter stream
twitter.stream({
  filters: [
    'emojis',
    'hashtags',
    'urls'
  ],
  // Flip to `true` to see stream in console
  debug: false
}).on('data', (data) => {
  tweetStream.emit('data', data)
})

// Listen on PORT
server.listen(PORT)

// Serve static (client app)
app.use(express.static(CLIENT_PATH))

// Establish socket connections
io.on('connection', (socket) => {
  // On twitter events, emit data
  tweetStream.on('data', (data) => {
    socket.emit('twitter', data)
  })
})

// Log out to indicate server start
console.log(`Service running over ${PORT}`)
