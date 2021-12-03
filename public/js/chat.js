const socket = io()

socket.on('printCount', (count) => {
    console.log(`The count is ${count}`)
})

document.querySelector('#increment').addEventListener('click', () => {
    socket.emit('increment')

})