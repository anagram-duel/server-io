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
	});

	// User Load Rooms
	socket.on("roomsFetch", () => {
		socket.emit("roomsRefresh", rooms);
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
