class Client {
  constructor(socket, identifier, publicKey) {
    this.socket = socket;
    this.identifier = identifier;
    this.room = null;
    this.publicKey = publicKey;
  }

  /**
   * Adds the current client to the specified room
   * @param room
   */
  joinRoom(room) {
    this.room = room;

    this.room.addClient(this);
  }

  /**
   * Sends the specified message to the client
   * @param message
   */
  sendMessage(message) {
    this.socket.emit('newMessage', message);
  }
}

module.exports = Client;
