const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { generateWord } = require("./game");

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
		socket.emit("roomCreated", roomNumber);
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
		}
		io.emit("roomsRefresh");
	});

	//Get Room Data
	socket.on("getRoom", (room) => {
		const currentRoomIndex = rooms.findIndex((r) =>
			r.number === room ? true : false
		);
		console.log(rooms[currentRoomIndex]);
		socket.to(room).emit("roomDetailRefresh", rooms[currentRoomIndex]);
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
