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

//listen on every connection
io.on('connection', (socket) => {
    console.log(`New user connected`)
})