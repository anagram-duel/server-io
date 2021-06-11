const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { generateWord, guess } = require("./game");

let rooms = [];

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
	cors: {
		origin: "*",
	},
});

const cors = require("cors");
app.use(cors());

io.on("connect", (socket) => {
	console.log(`Ada user connect, ID ${socket.id}`);
	// User Create Room
	socket.on("createRoom", (payload) => {
		const { word, scrambleWord } = generateWord();
		let roomNumber;
		if (rooms.length < 1) {
			roomNumber = 1;
			rooms.push({
				hostid: socket.id,
				hostname: payload,
				number: roomNumber,
				word,
				scrambleWord,
				available: true,
			});
		} else if (rooms.length > 0) {
			roomNumber = rooms[rooms.length - 1].number + 1;
			rooms.push({
				hostid: socket.id,
				hostname: payload,
				number: roomNumber,
				word,
				scrambleWord,
				available: true,
			});
		}
		io.emit("roomsRefresh", rooms);
		socket.join(roomNumber);

		const currentRoomIndex = rooms.findIndex((room) =>
			room.number === roomNumber ? true : false
		);
		console.log(rooms[currentRoomIndex]);
		io.sockets.in(roomNumber).emit("roomCreated", rooms[currentRoomIndex]);
	});

	// User Load Rooms
	socket.on("roomsFetch", () => {
		socket.emit("roomsRefresh", rooms);
	});

	// Join Room
	socket.on("joinRoom", (payload) => {
		console.log(`User ${socket.id} sudah join ke room ${payload.toJoin}`);
		if (payload.toLeave) socket.leave(payload.toLeave);
		const currentRoomIndex = rooms.findIndex((room) =>
			room.number === payload.toJoin ? true : false
		);
		if (
			!rooms[currentRoomIndex].challenger &&
			rooms[currentRoomIndex].hostid !== socket.id &&
			rooms[currentRoomIndex].available
		) {
			rooms[currentRoomIndex].challenger = payload.name;
			rooms[currentRoomIndex].challengerId = socket.id;
			rooms[currentRoomIndex].available = false;
			socket.join(payload.toJoin);
			io.sockets
				.in(rooms[currentRoomIndex].number)
				.emit("roomDetailRefresh", rooms[currentRoomIndex]);
		}
		io.emit("roomsRefresh", rooms);
	});

	//Submit Answer
	socket.on("submitAnswer", (payload) => {
		const currentRoomIndex = rooms.findIndex((room) =>
			room.number === payload.room ? true : false
		);
		const currentRoom = rooms[currentRoomIndex];
		const word = currentRoom.word;
		const result = guess(payload.answer, word);
		console.log(result);
		if (result) {
			if (socket.id === currentRoom.hostid) {
				io.sockets.in(currentRoom.number).emit("gameCheck", {
					message: `Host win ${currentRoom.hostname}`,
					gameEnd: true,
				});
			} else if (socket.id === currentRoom.challengerId) {
				io.sockets.in(currentRoom.number).emit("gameCheck", {
					message: `Challenger win ${currentRoom.challenger}`,
					gameEnd: true,
				});
			}
			socket.leave(currentRoom.number);
			rooms = rooms.filter((r) => {
				return r.number !== currentRoom.number;
			});
			io.emit("roomsRefresh", rooms);
		} else if (!result) {
			socket.emit("gameCheck", {
				message: `Wrong word`,
				gameEnd: false,
			});
		}
	});
});

const router = require("express").Router();

router.get("/", (req, res) => {
	res.status(200).json("hello");
});

app.use(router);

http.listen(port, () => {
	console.log(`Applikasi jalan di port ${port}`);
});
