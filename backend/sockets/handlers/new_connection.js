import * as queue_options from './queue_options.js'
/*
      This is the handler for a new connection.
      It will be called when a new connection is made to the server.

      We can use this to log the connection and disconnect events.
*/
const newConnection = (socket, io) => {
    console.log(`[Backend ⚡️]: New Connection: ${socket.id}`)
    socket.on('disconnect', () => {
        console.log(`[Backend ⚡️]: Disconnected!`)
    })

    socket.on('join', (data) => {
        console.log(`[Backend ⚡️]: ${data.username} joined.`)
        socket.emit('join', data)
    })

    socket.on("sdp", (data) => {
        socket.broadcast.emit("sdp", data)
    })

    socket.on("candidate", (data) => {
        socket.broadcast.emit("candidate", data)
    })



    // Add the queue options handler
    queue_options.default(socket, io)
}

export default newConnection