
const users = [
  { username: "admin", password: "admin" },
  { username: "user1", password: "123" },
  { username: "user2", password: "321" }
];

const User = {
  findOne: (username) => {
    const user = users.find((item) => username === item.username);
    if (user) delete user.password
    return user;
  },
  validate: (username, password) => {
    return !(!!users.find((item) => username === item.username && password == item.password));
  }
}

module.exports = User;
