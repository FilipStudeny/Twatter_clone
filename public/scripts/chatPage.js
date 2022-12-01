//@ts-ignore
$(document).ready(() => {
    //@ts-ignore
    $.get(`/messages/chats/${chatID}`, (data) => {
        $("#chatName").text(getChatName(data));
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

    if(event.which === 13 ){
        messageSubmited();
        return false
    }
});

const messageSubmited = () => {
    //@ts-ignore
    const message = $('.inputTextBox').val().trim();
    
    if(message != ""){
        sendMessage(message);
        $('.inputTextBox').val("");
    }
}

//@ts-ignore
const sendMessage = (message) => {
    //@ts-ignore
    $.post("/messages/chat/newMessage", {'content': message, 'chatID': chatID}, (data, status, xhr) => {
        console.log(data);
    })
}
