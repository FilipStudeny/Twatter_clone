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

//@ts-ignore
const outputChatList = (chatList, container) => {
    
    if(chatList.length == 0){
        container.append("<span class='noResults'>Nothing to show</span>")
        return;
    }

    //@ts-ignore
    chatList.forEach(chat => {
        const html = createChatHTML(chat);
        container.append(html);
    });
}
//@ts-ignore
const createChatHTML = (chatData) => {
    let chatName = getChatName(chatData);
    const img = getChatImageElement(chatData);
    const latestMessage = getLatestMessage(chatData.latestMessage);
    const html = 
    `
        <a href='/messages/chat/${chatData._id}' class='resultListItem'>
            ${img}
            <div class='resultsDetailsContainer elipsis'>
                <span class='heading elipsis'>${chatName}</span>
                <span class='subText elipsis'>${latestMessage}</span>
            </div>
        </a>
    `

    return html;
}

//@ts-ignore
const getLatestMessage = (message) => {
    if(message != null){
        const sender = message.sender;
        return `${sender.firstName} ${sender.lastName}: ${message.content}`;
    }

    return "New chat";
}

//@ts-ignore
const getChatImageElement = (chatData) => {
    const otherChatUsers = getOtherChatUsers(chatData.users);
    let groupChatClass = '';
    let chatImage = getUserChatImageElements(otherChatUsers[0]);

    if(otherChatUsers.length > 1) {
        groupChatClass = "groupChatImage";
        //@ts-ignore
        chatImage += getUserChatImageElements(otherChatUsers[1]);
    }

    const html = `
        <div class='resultsImageContainer ${groupChatClass}'>
            ${chatImage}
        </div>
    `
    return html;
}

    //@ts-ignore
const getUserChatImageElements = (user) => {
    if(!user || !user.profilePicture){
        return alert("User passed into function is invalid");
    }

    const html = `<img src='${user.profilePicture}' alt='User profile picture'>`;
    return html;
}