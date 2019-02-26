// document ready
$(() => {
    //make connection
    const socket = io.connect('http://localhost:3000')

    //buttons and inputs
	const message = $("#message")
	const username = $("#username")
	const send_message = $("#send_message") //button
	const send_username = $("#send_username")   //button
	const chatroom = $("#chatroom")
    const feedback = $("#feedback")

    //Emit message
	send_message.click(() => {
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
    send_username.click(() => {
        console.log(username.val())
        socket.emit('change_username', {username : username.val()})
    })
    
    //Emit typing
    message.on('keypress', () => {
        socket.emit('typing')
    })

    //Listen on typing
    socket.on('typing', (data) => {
        feedback.html(`<p><i>${data.username} is typing a message...</i></p>`)

    })

})