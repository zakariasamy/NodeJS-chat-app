const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const { getActiveRoomsWithUserCount } = require('./utils/socket')
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

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error)
            return callback(error)

        // Join specific Room
        socket.join(user.room)

        socket.emit('printMessage', generateMessageWithDate('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('printMessage', generateMessageWithDate(`${user.username} has joined!`))

        // Send ROOM Data to show Rooms and users in FrontEnd on join and disconnect
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
            // socket.emit, io.emit, socket.broadcast.emit
            // io.to.emit, socket.broadcast.to.emit
    })
    socket.on('sendMessageToAllClients', (message) => {

        const user = getUser(socket.id)
        io.to(user.room).emit('printMessage', generateMessageWithDate(user.username, message))
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('printLocationMessage', generateMessageWithDate(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', (message) => {
        const removedUser = removeUser(socket.id)
            // the user may not be in the array if it like joined without write username
        if (removedUser) {
            io.to(removedUser.room).emit('printMessage', generateMessageWithDate(`${removedUser.username} has left`))

            // Send ROOM Data to show Rooms and users in FrontEnd on join and disconnect
            io.to(removedUser.room).emit('roomData', {
                room: removedUser.room,
                users: getUsersInRoom(removedUser.room)
            })
        }
    })

    socket.on('sendActiveRooms', (callback) => {
        let rooms = getActiveRoomsWithUserCount(io)
        callback(rooms)
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})