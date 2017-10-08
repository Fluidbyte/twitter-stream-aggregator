const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const twitter = require('./lib/twitter')
const EventEmitter = require('events')
const esWriter = require('./lib/esWriter')

let twitterStream

// dev: hot module reloader
require('./webpack_hmr')(app)

// Create emitter for twitter stream
class TwitterEmitter extends EventEmitter {}
const tweetStreamEvents = new TwitterEmitter()

const PORT = process.env.PORT || 8080
const CLIENT_PATH = path.resolve(__dirname, '../client')

/**
 * Starts twitter stream
 * @returns {Object} stream
 */
const startTwitterStream = () => {
  twitterStream = twitter.stream({
    // Apply filters
    filters: [
      'emojis',
      'hashtags',
      'urls',
      'photos'
    ],
    // Flip to `true` to see stream in console
    debug: false
  })
}

// Start Twitter Stream
startTwitterStream()

// Handle data from stream
twitterStream.on('data', (data) => {
  tweetStreamEvents.emit('data', data)
})

// Handle errors from stream
twitterStream.on('error', (err) => {
  console.log('--- ERROR ---')
  console.log(err)
  console.log('--- RESTART ---')
  twitterStream.destroy()
  startTwitterStream()
})

// Listen on PORT
server.listen(PORT)

// Serve static (client app)
app.use(express.static(CLIENT_PATH))

// Establish socket connections
io.on('connection', (socket) => {
  // On twitter events, emit data
  tweetStreamEvents.on('data', (data) => {
    socket.emit('twitter', data)
  })
})

// Stream to Elasticsearch
esWriter(twitterStream)
