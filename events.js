const events = {
  "global": "global message",
  "updateOnline": "online",
  "chat": "chat",
  "dm": "dm",
  "error": "error"
}
if (typeof window === "undefined") {
  module.exports = events;
}
