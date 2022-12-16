let connected = false;

//@ts-ignore
const socket = io("http://localhost:8888");
//@ts-ignore
socket.emit("setup", userLoggedIn);
socket.on("connected", () => {
    connected = true;
})

//@ts-ignore
socket.on("message received", (newMessage) => { //RECEIVE NEW MESSAGE
    //@ts-ignore
    messageReceived(newMessage);
})

//@ts-ignore
socket.on("notification received", () => { //RECEIVE NEW MESSAGE
    //@ts-ignore

    $.get('/notifications/latest', (notificationData) => {
        showNotificationPopup(notificationData)
        refreshNotificationsBadge();
    });
})

//@ts-ignore
const emitNotification = (userID) => {
    //@ts-ignore
    if(userID == userLoggedIn._id) {
        return
    };

    socket.emit("notification received", userID);
}