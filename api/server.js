const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const postsRouter = require("../posts/postRouter");

const server = express();

server.use("/api/posts", postsRouter);
server.use(helmet(), cors(), morgan("dev"), express.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "you connected to the server successfully" });
});

module.exports = server;
