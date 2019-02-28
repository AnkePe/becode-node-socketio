// document ready
$(() => {
    //make connection
    const socket = io.connect('http://localhost:3000')

    //make namespaces
    const chat01 = io.connect('http://localhost:3000/chat01')
    const chat02 = io.connect('http://localhost:3000/chat02')

    //buttons and inputs
	const message = $("#message")
	const username = $("#username")
	const send_message = $("#send_message") //form
	const send_username = $("#send_username")   //form
	const chatroom = $("#chatroom")
    const feedback = $("#feedback")

    //Emit message
	send_message.submit((e) => {
        e.preventDefault()      // verhinderen dat gegevens weggestuurd worden
		socket.emit('new_message', {message : message.val()})
    })
    
    //Listen on new_message
    socket.on('new_message', (data) => {
        console.log(data)
        feedback.html('')   //... is typing leegmaken
        message.val('') //het invoerveld voor messages leegmaken
        chatroom.append(`<p class='message'>${data.username}: ${data.message}</p>`)
    })

    //Emit username
    send_username.submit((e) => {
        e.preventDefault()
        console.log(username.val())
        socket.emit('change_username', {username : username.val()}, data => {
            console.log(data)
            if (data) {
                console.log('new username accepted')
                $("#error").html(`Welcome ${username.val()}`)
            } else {
                console.log('username already taken')
                $("#error").html(`This name is already taken, try another one.`)

            }
        })
    })

    //listen on allUsernames
    socket.on('allUsernames', (data) => {   //data is allUsernames uit app.js
        let html = ''
        for(let elem of data) {     //loop door elke username van de array allUsernames
            html += elem + '<br>'   //voeg elke username toe aan html
        }
        console.log(html)
        $("#all_users").html(html) 

    })
    
    //Emit typing
    message.on('keypress', () => {
        socket.emit('typing')
    })

    //Listen on typing
    socket.on('typing', (data) => {
        feedback.html(`<p><i>${data.username} is typing a message...</i></p>`)

    })

    //Chat 1 sockets
    chat01.on('connectionMessage', message => {
        $("h2").html(message)
    })

})