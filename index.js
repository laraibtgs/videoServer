const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
})

io.on("connection", (socket) => {
	console.log("Connection")
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		console.log("Call Ended")

		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		console.log("Call Uer")

		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		console.log("Answered Call")
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

server.listen(5000, () => console.log("server is running on port 5000"))