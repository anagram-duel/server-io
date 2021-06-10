const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

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
});

const router = require("express").Router();
router.get("/", (req, res) => {
	res.status(200).json("hello");
});
app.use(router);

http.listen(port, () => {
	console.log(`Applikasi jalan di port ${port}`);
});
