const events = {
  "global": "global message",
  "updateOnline": "online",
  "chat": "chat",
  "dm": "dm",
  "system": "system"
}
if (typeof window === "undefined") {
  module.exports = events;
}
