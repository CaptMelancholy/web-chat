const express = require('express');
const port = 9999;
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
});

const rooms = new Map([

]);

app.get('/rooms', (req, res) => {
    res.json(rooms);
});

io.on('connection', (stream) =>
{
    console.log('Someone connected - ', stream.id);
});

server.listen(port, (err) => {
    if(err)
    {
        throw Error(err);
    }
    console.log(`Server started on port ${port}`)
});