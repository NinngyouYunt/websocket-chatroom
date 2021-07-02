const express = require("express");
const http = require("http");
const {Server} = require("socket.io");

const connection = require("./connection");

/**
 * app.listen() returns the same http server object as http.createServer()
 *   and it calls server.listen internally
 * we want to reuse the server and put listen 
 *   at the back so we use createServer() instead
 */
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get("/events", (req, res) => {
  res.sendFile(`${__dirname}/events.js`);
});

const connectionCallback = connection(io);
// On an arbitrary connection
io.on("connection", connectionCallback);

server.listen(process.env.PORT || 3000, () => {
  console.log("Server Starting...");
});
