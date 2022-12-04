let typing = false;
//@ts-ignore
let lastTypingTime;

//@ts-ignore
$(document).ready(() => {

    //SOCKET IO 
    //@ts-ignore
    socket.emit("join room", chatID);
    socket.on("typing", () => {
        $('.typingDots').show();
    })

    socket.on("stop typing", () => {
        $('.typingDots').hide();
    })

    //@ts-ignore
    $.get(`/messages/chats/${chatID}`, (data) => {
        $("#chatName").text(getChatName(data));
    })

    // *** AJAX *** //
    //@ts-ignore
    $.get(`/messages/chats/${chatID}/messages`, (data) => {

        //@ts-ignore
        let messages = [];
        let lastSenderID = "";

        //@ts-ignore
        data.forEach((message, index) => {
            const html = createMessageHtml(message, data[index + 1], lastSenderID);
            messages.push(html);
            lastSenderID = message.sender._id;
        });

        //@ts-ignore
        const messagesHtml = messages.join("");
        addMessageHTMLtoPage(messagesHtml);
        scrollToBottom(false);

        $(".loadingSpinnerContainer").remove();
        $(".chatContainer").css("visibility", "visible");
    })
})


//@ts-ignore
$('#chatNameButton').click( () => {
    //@ts-ignore
    const name = $('#chatNameTextBox').val().trim();

    //@ts-ignore
    $.ajax({
        //@ts-ignore
        url: `/messages/chat/${chatID}`,
        type: 'PUT',
        data: { 'chatName': name },
        success: (data, status, xhr) => {
            if(xhr.status != 204){
                alert("Could not update chat name");
            }else{
                location.reload();
            }
        }
    })
});

$(".sendMessageButton").click( () => {
    messageSubmited();
});

$(".inputTextBox").keydown( (event) => {

    updateTyping();

    if(event.which === 13 ){
        messageSubmited();
        return false
    }
});

const updateTyping = () => {

    if(!connected){
        return;
    }

    if(!typing){
        typing = true;

        //@ts-ignore
        socket.emit("typing", chatID);
    }

    lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
        const timeNow = new Date().getTime();
        //@ts-ignore
        const timeDifferenece = timeNow - lastTypingTime;
        if(timeDifferenece >= timerLength && typing){
            //@ts-ignore
            socket.emit("stop typing", chatID);
            typing = false;
        }
    }, timerLength);


};

const messageSubmited = () => {
    //@ts-ignore
    const message = $('.inputTextBox').val().trim();
    
    if(message != ""){
        sendMessage(message);
        $('.inputTextBox').val("");
        //@ts-ignore
        socket.emit("stop typing", chatID);
        typing = false;
    }
}

//@ts-ignore
const sendMessage = (message) => {
    //@ts-ignore
    $.post("/messages/chat/newMessage", {'content': message, 'chatID': chatID}, (data, status, xhr) => {
        //@ts-ignore
        if(xhr.status != 201){
            alert("Could not send message");
            $('.inputTextBox').val(message);
            return;

        }
        addChatMessage(data);

        if(connected){
            socket.emit("new message", data);
        }
    })
}

//@ts-ignore
const addMessageHTMLtoPage = (html) => {
    $(".chatMessages").append(html);

}
//@ts-ignore
const addChatMessage = (message) => {

    if(!message || !message._id){
        alert("Message is not valid");
        return;
    }

    const messageDiv = createMessageHtml(message, null, "");
    addMessageHTMLtoPage(messageDiv);
    scrollToBottom(true);

}

//@ts-ignore
const createMessageHtml = (message, nextMessage, lastSenderID) => {
    const sender = message.sender;
    const senderName = sender.firstName + " " + sender.lastName;
    const currentSenderID = sender._id;
    const nextSenderID = nextMessage != null ? nextMessage.sender._id : "";

    const isFirst = lastSenderID !== currentSenderID;
    const isLast = nextSenderID !== currentSenderID;

    //@ts-ignore
    const isMyMessage = message.sender._id == userLoggedIn._id;
    let liClassName = isMyMessage ? "mine" : "theirs";
    let nameElement = "";

    if(isFirst){
        liClassName += " first";
        
        if(!isMyMessage){
            nameElement = `<span class='senderName'>${senderName}</span>`
        }
    }


    let profileImage = "";
    if(isLast){
        liClassName += " last";
        profileImage = `<img src='${sender.profilePicture}'>`
    }

    let imageContainer = "";
    if(!isMyMessage){
        imageContainer = `
        <div class='imageContainer'>
           ${profileImage}
        </div>`

    }


    const html =`   
        <li class='message ${liClassName}'>
            ${imageContainer}
            <div class='messageContainer'>
                ${nameElement}
                <span class='messageBody'>
                    ${message.content}
                </span>
            </div> 
        </li>
    `

    return html;

}

//@ts-ignore
const scrollToBottom = (animated) => {
    const container = $('.chatMessages');
    const scrollHeight = container[0].scrollHeight;

    if(animated){
        container.animate({ scrollTop: scrollHeight}, "slow");
    }else{
        container.scrollTop(scrollHeight);

    }
}
