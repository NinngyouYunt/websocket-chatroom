const Events = require("./config/events");
let users = [];
let totalOnline = 0;

const log = (msg) => { console.log(`Socket Log:\n\t${msg}`); };

const onJoin = function (socket, io) {
  const session = socket.request.session;
  session.socketId = socket.id;
  session.save();
  socket.on("whoami", (cb) => {
    cb(socket.request.user ? socket.request.user.username : '');
  });

  const user = socket.request.user.username;
  if (!users[user]) users[user] = [];
  if (users[user].length === 0){
    io.emit(Events.system, `${user} joined`);
    io.emit(Events.updateOnline, ++totalOnline);
  }
  users[user].push({ user: socket.request.user, socket: socket });
  log(`${user} connected with socket id: ${socket.id} and session id ${session.id}, currently ${users[user].length} sessions`);

  return socket.request.user;
}
const onLeave = (socket, io) => {
  socket.on("disconnect", () => {
    const user = socket.request.user.username;
    const index = users[user].findIndex((item) => item.socket.id === socket.id);
    if (index >= 0) {
      users[user].splice(index, 1);
      log(`${user} left socket ${socket.id}, currently ${users[user].length} sessions`);
    }
    if (users[user].length === 0) {
      log(`${user} left`);
      delete users[user];
      io.emit(Events.system, `${user} left the chat`);
      io.emit(Events.updateOnline, --totalOnline)
    }
  });
}

const connection = function (io) {
  return (socket) => {
    // On Join
    const user = onJoin(socket, io).username;
    // On Leave
    onLeave(socket, io);
    // same Events as the client
    socket.on("chat", (msg) => {
      log(`${user}: ${msg}`);
      const mentionMatch = msg.match(/^(@[0-9]+ )/g);
      if (mentionMatch) {
        const mention = mentionMatch[0].slice(1, -1);
        log(mention);
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
