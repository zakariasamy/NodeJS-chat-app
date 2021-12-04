const socket = io()

socket.on('printMessage', (message) => {
    console.log(message)
})



document.querySelector('#message').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessageToAllClients', message)

})