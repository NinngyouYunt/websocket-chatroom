
const users = [
  { username: "admin", password: "admin" },
  { username: "dk", password: "nah" }
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
