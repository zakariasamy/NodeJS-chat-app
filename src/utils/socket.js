const { getNumberOfUsersInRoom } = require('./users')

function getActiveRoomsWithUserCount(io) {
    // Convert map into 2D list:
    // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
    const arr = Array.from(io.sockets.adapter.rooms);
    // Filter rooms whose name exist in set:
    // ==> [['room1', Set(2)], ['room2', Set(2)]]
    const filtered = arr.filter(room => !room[1].has(room[0]))
        // Return only the room name: 
        // ==> ['room1', 'room2']
    const rooms = filtered.map(i => i[0]);

    const roomsWithUsers = []
    rooms.forEach((room) => {
        roomsWithUsers.push({ room, users: getNumberOfUsersInRoom(room) })
    })
    return roomsWithUsers;
}


module.exports = { getActiveRoomsWithUserCount }