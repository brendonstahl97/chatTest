//Express server setup
const { Console } = require("console");
const express = require("express");
const app = express();

//socket.io setup
const http = require('http').createServer(app);
const io = require("socket.io")(http);

const path = require('path');

//default front-end folder
app.use(express.static('Assets'));


const PORT = 8080;

let roomNum = '9999';

//serve html on / request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Assets/html/landing.html'));
});

//On navigation to /host, generate a random room number and send chat page
app.get('/host', (req, res) => {
    res.sendFile(path.join(__dirname, './Assets/html/index.html'));
    roomNum = Math.floor(Math.random() * 9999).toString();
});

//on navigation to /join/roomNumber set the room number to the query parameter and then send the index.js file
app.get('/join/:roomNumber', (req, res) => {
    res.sendFile(path.join(__dirname, './Assets/html/index.html'));
    roomNum = req.params.roomNumber;
});

//socket events 
//When socket from front-end connects
io.on('connection', (socket) => {
    
    //join specified room
    socket.join(roomNum);
    console.log(`a user connected to room ${roomNum}`);

    //send room number info to every user in a room
    io.to(roomNum).emit('roomInfo', roomNum);

    //when socket disconnects
    socket.on('disconnect', () => {
        console.log("User Disconnected");
        
    });

    //listen for custom event 'chat' from front end socket
    socket.on('chat', msg => {
        console.log(`${msg.author}: ${msg.message}`);
        //send the message received from one user to all other users
        io.to(msg.room).emit('chat', msg);

    });

    socket.on('nextPhase', data => {
        const newPhase = nextPhase(parseInt(data.phase));
        console.log('Phase Advanced');
        io.to(data.room).emit('nextPhase', {newPhase: newPhase});
    })

    socket.on('cardClicked', cardData => {
        console.log('Card Clicked: ', cardData.text);
        io.to(cardData.room).emit('cardClicked', cardData);
    })
});


http.listen(PORT, () => {
    console.log("Listening on port 8080");
});




const nextPhase = (currentPhase) => {
    let newPhase;
    if(currentPhase === 3) {
        newPhase = 1;
    } else {
        newPhase = currentPhase + 1;
    }

    return newPhase;
}