import React, { useState, useEffect } from 'react'
import { io } from "socket.io-client"
import { Container, TextField, Typography, Button, Box, Stack } from '@mui/material'
import { useMemo } from 'react'

const App = () => {

  const [message, setMessage] = useState("")
  const [room, setRoom] = useState("")
  const [socketId, setSocketId] = useState("")
  const [messages, setMessages] = useState([])
  const [roomName, setRoomName] = useState("")

  console.log(messages)

  //we created a socket that connects to our server/ circuit using the url
  
  //PROBLEM
  //every time message state changes it rerenders the component and thus socket is initiated every time we send a message
  // const socket = io("http://localhost:3000")


  //SOLUTION -> useMemo
  const socket = useMemo(() => io("http://localhost:3000"),[])



  const handleSubmit = (e) => {
    e.preventDefault()
    // emitting the message event by sending the message variable containing the Text
    socket.emit("message", {message, room})
    setMessage("")
  }

  const joinRoomHandler = (e) => {
    e.preventDefault()
    socket.emit("join-room", roomName)
    setRoomName("")
  }

  // managing events
  useEffect(() => {

    // handling the connection event
    socket.on("connect", () => {
      // client side console once this component app connects to the circuit / socket.io server successfully.
      setSocketId(socket.id)
      console.log("Connected", socket.id) 
    })



    // handling our custom event named "Welcome"
    // s is the data emitted
    //the emitted message is recieved, the event Welcome is handled and by logic we print s which is nothing but the emitted message

    // socket.on("Welcome", (s) => {
    //   console.log(s)
    // })


    //handling welcome emit
    //this is abroadcast emit, so it is ahndled only for the sockets other than the current socket, what is the current socket -> add two client and reload any one , its id changes and it reconnects and hence all the sockets other than the reloaded socket handles this event and the get a message -> `id (of the relaoded socket) joined the server`

    // socket.on("welcome", (s) => {
    //   console.log(s)
    // })


    //received msg event
    //we handle it as = when io emits the event and data we listen it here and receive the data and print it

    //effect -> when we type a msg and press send -> it gets received by io as the event message gets triggered which is being handled on server side, it prints the sent msg in server console.

    //Further more upon receiving the msg (typed) and printing the io (server) emits the same message under another event and emit the data (typed message) itself which is handled in the clietn side below. 


    //note-> the recieved msg event handler changes as per the app.js emit type
    // currently it handles third type (private msg)
    socket.on("received-msg", (msg) => {
      console.log(msg)
      setMessages((messages) => [...messages, msg]) //the source recieving private msg is added to messages array
    })


    // handling disconnect event
    return () => {
      socket.disconnect();
    }

  }, [])

  return (
    <Container maxWidth="sm">
      <Box sx={{height: 300}}/>
      <Typography variant='h4' component="div" gutterBottom>
        Welcome to socket.io
      </Typography>

    
        <Typography variant='h6' component="div" gutterBottom>
          {socketId}
        </Typography>

        <form onSubmit={joinRoomHandler}>
          <h5>Join Room</h5>
          <TextField 
          value={roomName} 
          onChange={(e) => setRoomName(e.target.value)} // Fixed this line
          id="outlined-basic" 
          label="Room Name" 
          variant="outlined" 
        />

        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
        </form>
      

      <form onSubmit={handleSubmit}>
        <TextField 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} // Fixed this line
          id="outlined-basic" 
          label="message" 
          variant="outlined" 
        />

        <TextField 
          value={room} 
          onChange={(e) => setRoom(e.target.value)} // Fixed this line
          id="outlined-basic" 
          label="room" 
          variant="outlined" 
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>
        {
          messages.map((m,i) => (
            <Typography key={i} variant="h7" component="div" gutterBottom>
              {m}
            </Typography>
          ))
        }
      </Stack>
    </Container>
  )
}

export default App
