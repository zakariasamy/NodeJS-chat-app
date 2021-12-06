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
io.on('connection', (socket) => {
    console.log('New WebSocket connection')
        // send message to all clients except that one
    socket.broadcast.emit('printMessage', 'one user has joined')


    socket.on('sendMessageToAllClients', (message) => {

        io.emit('printMessage', message)
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('printLocationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on('disconnect', (message) => {
        io.emit('printMessage', 'one user disconnected')
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})