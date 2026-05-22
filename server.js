const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

app.get("/:room", (req, res) => {
  res.sendFile(__dirname+"/public/index.html");
});

io.on("connection", (socket) => {
  console.log("ユーザーが接続しました");
  
  // クライアントから部屋名を受け取る
  socket.on("joinRoom", (room) => {
    socket.join(room);
    socket.room = room;
    console.log(`ユーザーが部屋 ${room} に参加しました`);
  });

  socket.on("chat message", (msg) => {
    io.to(socket.room).emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("ユーザーが切断しました");
  });
});

http.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
