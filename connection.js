const Events = require("./config/events");
let users = {};
let totalOnline = 0;

const onJoin = function (socket, io) {
  const user = socket.request.user;
  console.log(`${user} connected with socket id: ${socket.id}`);  
  const session = socket.request.session;
  session.socketId = socket.id;
  session.save();

  socket.on("whoami", (cb) => {
    cb(socket.request.user ? socket.request.user.username : '');
  });
  io.emit(Events.system, `${user.username} joined`);
  io.emit(Events.updateOnline, ++totalOnline);
  return user;
}

const connection = function (io) {
  return (socket) => {
    // On Join
    const user = onJoin(socket, io).username;
    // On Leave
    socket.on("disconnect", () => {
      console.log(`${user} left`);
      delete users[user];
      io.emit(Events.system, `${user} left the chat`);
      io.emit(Events.updateOnline, --totalOnline)
    });
    // same Events as the client
    socket.on("chat", (msg) => {
      console.log(`Message from ${user}\n\t${msg}`);
      const mentionMatch = msg.match(/^(@[0-9]+ )/g);
      if (mentionMatch) {
        const mention = mentionMatch[0].slice(1, -1);
        console.log(mention);
        if (users[mention]) {
          msg = msg.slice(msg.indexOf(mention) + mention.length);
          users[mention].emit(Events.dm, `${user} whispered: ${msg}`)
        } else {
          socket.emit(Events.system, `Error: ${mention} does not exist`);
        }
      } else {
        io.emit("chat", `${user}: ${msg}`);
      }
    })
  }
}

module.exports = connection;
