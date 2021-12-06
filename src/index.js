const path = require('path')
const http = require('http')
const express = require('express')
const { Server } = require("socket.io");
const { generateMessageWithDate } = require('./utils/messages')
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

    socket.on('join', ({ username, room }) => {
        // Join specific Room
        socket.join(room)

        socket.emit('printMessage', generateMessageWithDate('Welcome!'))
        socket.broadcast.to(room).emit('printMessage', generateMessageWithDate(`${username} has joined!`))

        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
    })
    socket.on('sendMessageToAllClients', (message) => {

        io.to('cairo').emit('printMessage', generateMessageWithDate(message))
    })

    socket.on('sendLocation', (coords, callback) => {
        io.to('cairo').emit('printLocationMessage', generateMessageWithDate(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', (message) => {
        io.to('cairo').emit('printMessage', generateMessageWithDate('one user disconnected'))
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})