import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});




app.use(cors());

// app.get('/', (req, res) => {
//     res.send("server live");
// });

//add object for custom IDs
const users = {};
//

io.on('connection', (socket) => {
    socket.emit("id", socket.id);

    socket.on('userCustomId', (id) => {
        users[id] = socket.id;
        // console.log('users: ', users);
    })

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        // console.log('calluser',from, users[from]);
        // console.log('calluser usertocall', userToCall, users[userToCall])
		io.to(users[userToCall]).emit("callUser", { signal: signalData, from: users[from], name });
	});

	socket.on("answerCall", (data) => {
        // console.log("answercall",data.to)
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(3001, ()=> console.log("running on port 3001"));
