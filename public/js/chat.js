const socket = io()

const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
    // Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

socket.on('printMessage', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('printLocationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locationMessageTemplate, {
        url
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


document.querySelector('#message').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessageToAllClients', message)

})

// Sharing location based on the consent of the user if the user click button and allow sharing
$sendLocationButton.addEventListener('click', () => {
    // if the browser dosen't support sharing location
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            // Executed after callback is called in index.js
            $sendLocationButton.removeAttribute('disabled')

        })
    })
})