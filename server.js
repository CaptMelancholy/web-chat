const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const rooms = new Map();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/rooms/:id', (req, res) => {
    const { id: roomID } = req.params;
    const obj = rooms.has(roomID) ? {
        users: [...rooms.get(roomID).get('users').values()],
        messages: [...rooms.get(roomID).get('messages').values()],
    }
        :
        {
            users: [],
            messages: []
        }
    res.json(obj);
});

app.post('/rooms', (req, res) => {
    const { roomID, userName } = req.body;
    if (!rooms.has(roomID)) {
        rooms.set(
            roomID,
            new Map([
                ['users', new Map()],
                ['messages', []],
            ]),
        );
    }
    res.send();
});


io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({ roomID, userName }) => {
        socket.join(roomID);
        if(rooms.get(roomID).get('users').size === 0)
        {
            rooms.get(roomID).get('messages').length = 0;
        }
        rooms.get(roomID).get('users').set(socket.id, userName);
        const users = [...rooms.get(roomID).get('users').values()];
        socket.broadcast.to(roomID).emit('ROOM:SET_USERS', users);
    });


    socket.on('ROOM:NEW_MESSAGE', ({ roomID, userName, text, time, type, mineType, fileName }) => {
        let obj;
        if(type === "text")
        {
            obj = {
                userName,
                text,
                time,
                type
            };
        } else {
            obj = {
                userName,
                text,
                time,
                type,
                mineType,
                fileName
            };
        }
        
        rooms.get(roomID).get('messages').push(obj);
        socket.broadcast.to(roomID).emit('ROOM:NEW_MESSAGE', obj);
    });

    socket.on('disconnect', () => {
        rooms.forEach((value, roomID) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()];
                socket.broadcast.to(roomID).emit('ROOM:SET_USERS', users);
            }
        });
    });

    console.log('connection - ', socket.id);
});

server.listen(9999, (err) => {
    if (err) {
        throw Error(err);
    }
    console.log('Server started');
});