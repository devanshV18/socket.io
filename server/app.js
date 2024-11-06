import express from "express"
import { Server } from "socket.io" //importing a socket server
import {createServer} from "http"
import cors from "cors"

const port = 3000

const app = express() //creating a express app

const server = createServer(app) //creating a server/circuit using http for app

// io is made the new instance of socket.io server by using Server fxn from socket.io to convert the http server into and socket.io server/circuit and also we enable CORS for our socket.io server

const io = new Server(server, {
    cors: {
        origin:"*",
        methods: ["GET", "POST"],
        credentials: true
    }
}) 

//the below line creates a server and has the access to sockets connected to it which we can use inside callback function



//initialising cors package before accessing any route.
app.use(cors) 

app.get("/", (req,res) => {
    res.send("Hello World")
})


//connection is the event -> 
io.on("connection", (socket) => { 

    //1. we want to print the id of the socket when connection event is handled in server side ,  a connection must have been originiating is client side
    console.log("User Connected", socket.id) // a console log line


    


    //both events were for basic understanding


    //2. every connected client would emmit this event and data, this event is handled in client side in each socket and it prints the message on console
    socket.emit("Welcome", `Welcome to the server.`)

    //3. in this case at a time only one socket will broadcast (the socket that is refreshed) while all other socket will handle this event
    // in this case a socket is emitting the message that it has joined the server along with its id, so in the console of all other clients this broadcast will be handleded or say the even t will be handled except for the socket who is emitting it.
    socket.broadcast.emit("welcome", `${socket.id} joined the server`)



    //4.This is also a event being handled in the server side as the event message is triggered in the client side
    socket.on("message", ({room, message}) => {
        //once a message is triggerd or sent from client side we recieve it as data and print it on console
        console.log(room, message)

        //only either of a,b,c works at a given time.

        // a. one step ahead
        //we emit the received message from server 
        //inorder to see what it does we must listen it in the client side

        //io.emit emits the recieve message and event to all clients or sockets which handles it under the event name received-msg
        // io.emit("received-msg", message)


        //b. what if socket.broadcast.emit.
        //whatever socket triggers the message event by typing the message and sending it will end up sendin it to all sockets connected which will handle the message under received-msg event.
        //triggering and handling sockets ae same.
        // socket.broadcast.emit("received-msg", message)


        //c. sending it to a specific receiver from the source socket -> private text
        //to takes a room or an rray of rooms to which we want to send.
        // to gets the room from data and message being originated from source socket once the message event is triggered.
        //socket.to().emit("received-msg", message) will also work exactly same.

        

        io.to(room).emit("received-msg", message )
    })


    //join room 
    //CLient side emit a event as join-room as per socket.emit, which simply meams the individual socket has emitted an event where the socket wants to join the room, so the event is handled in the backend by invoking the join function for the particular socket which emitter join-room event.

    socket.on("join-room", (room) => {
        socket.join(room)
        console.log(`${socket.id} joined ${room}`)
    })






    //Disconnect event -> handled in server side when a socket disconnects from the client side

    socket.on("disconnect", () => {
        console.log("User Disconnected". socket?.id)
    })
})


server.listen(port, () => {
    console.log(`Server is running at port ${port}`)
})