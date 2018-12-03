class Client {
  constructor(socket, identifier, publicKey) {
    this.socket = socket;
    this.identifier = identifier;
    this.room = null;
    this.publicKey = publicKey;
  }

  joinRoom(room) {
    this.room = room;

    this.room.addClient(this);
  }

  sendMessage(message) {
    this.socket.emit('newMessage', message);
  }
}

module.exports = Client;
