var express = require("express");
const mongo = require("./utlis/mongo");
var PORT = process.env.PORT || 5000

var app = express();

var http = require("http");

var server = http.createServer(app);

var io = require("socket.io")(server);
mongo.connect();

io.on("connection", client =>{
    console.log("New client connected...", client.id);
    client.emit("acknowledge", {data : "Connected"});

    client.on("msgToServer", (chatterName, msg) => {
        console.log(chatterName + " says : " + msg);
        client.broadcast.emit("msgToClient", chatterName , msg);
        client.emit("msgToClient", 'Me', msg);
    })

    client.on("disconnect", (msg)=>{
        console.log("Client disconnected." + client.id);
        
        //Save data into DB
    })

})

app.get("/", (req, res)=>{
    res.sendFile(__dirname + '/public/socket-client.html');
})

server.listen(3000, ()=>{
    console.log("Socket server running on port 3000");
})