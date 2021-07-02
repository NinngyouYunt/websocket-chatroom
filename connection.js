const Events = require("./events");
let users = {};
let totalOnline = 0;

const connection = function (io) {
  return (socket) => {
    // On Join
    const user = Date.now();
    console.log(`${user} joined`);
    users[user] = socket;
    io.emit(Events.updateOnline, ++totalOnline)
    io.emit(Events.global, `${user} joined the chat`);
    // On Leave
    socket.on("disconnect", () => {
      console.log(`${user} left`);
      delete users[user];
      io.emit(Events.global, `${user} left the chat`);
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
          socket.emit("error", `Error: ${mention} does not exist`);
        }
      } else {
        io.emit("chat", `${user}: ${msg}`);
      }
    })
  }
}

module.exports = connection;
