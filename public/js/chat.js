const socket = io()

socket.on('printMessage', (message) => {
    console.log(message)
})

document.querySelector('#message').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessageToAllClients', message)

})

// Sharing location based on the consent of the user if the user click button and allow sharing
document.querySelector('#send-location').addEventListener('click', () => {
    // if the browser dosen't support sharing location
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})