const socket = io()

const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
    // Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
    // Rooms
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    /*
        Summary:
        * i can just write the last line but i want if i manually scrolled up
        * i should not auto scrolled down
    */


    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (scrollOffset >= containerHeight - newMessageHeight) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

// trigger event to Join specific room
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('printMessage', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a'),
        username: message.username,
    })
    $messages.insertAdjacentHTML('beforeend', html)

    autoScroll()
})

socket.on('printLocationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locationMessageTemplate, {
        url: url.text,
        createdAt: moment(url.createdAt).format('h:mm a'),
        username: message.username,
    })
    $messages.insertAdjacentHTML('beforeend', html)

    autoScroll()
})


document.querySelector('#message').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value

    e.target.elements.message.value = ''
    socket.emit('sendMessageToAllClients', message)

})

// Sharing location based on the consent of the user if the user click button and allow sharing
$sendLocationButton.addEventListener('click', () => {

    // if the browser dosen't support sharing location
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

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


socket.on('roomData', ({ room, users }) => {

    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html
})