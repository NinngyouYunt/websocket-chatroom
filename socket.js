const connection = require("./connection");
module.exports = (io) => {
  // SocketIO routing
  // const nsp = io.of("/live");
  const connectionCallback = connection(io);
  io.on("connection", connectionCallback);

  // return nsp;
};
