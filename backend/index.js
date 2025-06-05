const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);

const {Server}=require('socket.io');
const io= new Server(server ,{
    cors:{
        origin:"*"
    }
});

const cors=require('cors');

app.use(cors());

io.on('connection',(socket)=>{
  console.log(`User connected: ${socket.id}`)
})
server.listen(3000,()=>{
    console.log("server is listening at port 3000")
})
