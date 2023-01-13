//@ts-ignore
$(document).ready( () => {
    //@ts-ignore
    $.get('/messages/chat',  (data, status, xhr)  => {
        //@ts-ignore
        if(xhr.status == 404){
            alert("Could not get chat list");
        }else{
            outputChatList(data, $(".resultsContainer"));
        }
    });
});
