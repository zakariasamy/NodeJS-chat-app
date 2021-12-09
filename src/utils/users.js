let users = []

const addUser = ({ id, username, room }) => {

    // Clean the data
    // NOTE : Lowercase is useful to avoid user with name ZIKO and other with name ziko
    username = username.toLowerCase().trim()
    room = room.toLowerCase().trim()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    const ExistingUser = users.find((user) => {
        return user.username == username && user.room == room
    })

    if (ExistingUser) {
        return {
            'error': 'the username already exists'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

const getNumberOfUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room).length
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getNumberOfUsersInRoom
}