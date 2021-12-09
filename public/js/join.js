const socket = io()
const ul = document.querySelector('#ul-active-rooms')
const active_form_template = document.querySelector('#active_rooms_template').innerHTML
const join = document.querySelector('#active_join')

socket.emit('sendActiveRooms', (rooms) => {

    console.log(rooms)
    let html = ''
    rooms.forEach((room) => {
        html += Mustache.render(active_form_template, {
            roomName: room.room,
            users: room.users
        })

        console.log(room.room)

    })

    ul.insertAdjacentHTML('beforeend', html)

})

function addValueToRoomName(element) {
    let room = element.getAttribute('room')
    document.querySelector('input[name="room"]').value = room
}