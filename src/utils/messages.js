const generateMessageWithDate = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessageWithDate
}