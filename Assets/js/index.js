$(() => {

    //create socket connection from front end
    const socket = io();
    let currentRoom = '';
    let currentPhase = 1;

    $(".submitBtn").on('click', event => {
        event.preventDefault();

        //make sure socket connection exists
        if (socket) {
            const message = $('.messageInput');
            const author = $('.authorInput');

            if (message.val().length > 0) {
                const msg = {
                    author: author.val(),
                    message: message.val(),
                    room: currentRoom
                }

                //send socket message from the user to the server
                socket.emit('chat', msg);
                message.val('');
            }
        }
    })

    //handles emission of event when the phase button is clicked
    $(".phaseBtn").on('click', event => {
        event.preventDefault();

        const data = {
            room: currentRoom,
            phase: currentPhase
        }

        socket.emit('nextPhase', data);
    });

    //Sends card data to the server when clicked
    $(".card").on('click', event => {
        event.preventDefault();

        const cardData = {
            text: event.target.value,
            room: currentRoom
        }

        event.target.disabled = true;

        socket.emit('cardClicked', cardData);
    });



    //*************
    //Socket events 
    //*************


    //display room number when received from the server
    socket.on('roomInfo', (roomNum) => {
        $(".roomDisp").text(`Room Number: ${roomNum}`);
        currentRoom = roomNum;
    })

    //when a message is received from the server, print to screen
    socket.on('chat', msg => {
        $('.messages').append($('<li>').text(`${msg.author}: ${msg.message}`))
    })

    //when next phase event is received, update the on screen indicator
    socket.on('nextPhase', data => {
        currentPhase = data.newPhase;
        $('.phaseDisp').text(`Current Phase: ${currentPhase}`);
    })

    //When event card clicked is received, display the card data in the current card slot
    socket.on('cardClicked', cardData => {
        $('.currentCard').html(`<p>${cardData.text}</p>`);
    })

})



