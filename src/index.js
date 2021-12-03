const path = require('path')
const http = require('http')
const express = require('express')
const { Server } = require("socket.io");

const app = express()

// we uses http to pass what it return to socket.io because express dosen't return that
const server = http.createServer(app)
const io = new Server(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// when the client connect, this achieved by calling js function in html page
io.on('connection', () => {
    console.log('New WebSocket connection')
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})