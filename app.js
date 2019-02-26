const express = require('express')
const app = express()   //creates an express application

// const server = require('http').Server(app)  //je creeert zelf ee http server ipv dat express dat doet 

const port = process.env.PORT || 3000   //poort definieren


//middlewares
app.use(express.static('public'))   //roept de files aan uit de folder 'public'

//routes
app.get ('/', (req,res) => {
    res.sendFile('index')
})

//listening on port
server = app.listen( port, () => {
    console.log(`listening on port: ${port}`);
})

//socket io gebruiken
const io = require('socket.io')(server)

//lijst van usernames maken
const allUsernames = [] //lege array

//listen on every connection
io.on('connection', (socket) => {
    console.log(`New user connected`)

    //default username
    socket.username = "Anoniem"

    //listen on change_username
    socket.on('change_username', (data, callback) => {
        socket.username = data.username
        if(allUsernames.indexOf(socket.username != -1)) {
            callback(false)
        } else {
            callback(true)
            allUsernames.push(socket.username)
            updateAllUsernames()
        }
    })

    //function updateAllUsernames
    const updateAllUsernames = () => {
        io.sockets.emit('allUsernames', allUsernames)
    }
    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message => we call the sockets property of io = all sockets connected
        io.sockets.emit('new_message', {message : data.message, username : socket.username})
    })
    //listen on typing
    socket.on('typing', (data) => {
        //use broadcast to send to every socket except the one that started typing
        socket.broadcast.emit('typing', {username : socket.username})   
    })

    //listen on disconnect
    socket.on('disconnect', (data) => {
        // if(!socket.username) {
        //     console.log('disconnected')
        //     return
        // }
        allUsernames.splice(allUsernames.indexOf(socket.username), 1)
        updateAllUsernames()

    })

})