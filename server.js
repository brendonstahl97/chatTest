//Express server setup
const express = require("express");
const app = express();

//socket.io setup
const http = require('http').createServer(app);
const io = require("socket.io")(http);

const path = require('path');

//default front-end folder
app.use(express.static('Assets'));

const PORT = 8080;

//serve html on / request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Assets/html/index.html'));
});


//socket events 
//When socket from front-end connects
io.on('connection', (socket) => {
    console.log('a user connected');

    //when socket disconnects
    socket.on('disconnect', () => {
        console.log("User Disconnected");
    })

    //listen for custom event 'chat' from front end socket
    socket.on('chat', (msg) => {
        console.log(`${msg.author}: ${msg.message}`);
        //send the message received from one user to all other users
        io.emit('chat', msg);

    })

});




http.listen(PORT, () => {
    console.log("Listening on port 8080");
})