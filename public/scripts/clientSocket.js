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