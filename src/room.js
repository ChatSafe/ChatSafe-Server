class Room {
  constructor(name) {
    this.name = name;
    this.clients = [];
  }

  emitAll(command, data, exclude = null) {
    for(let client of this.clients) {
      if(exclude && client.identifier === exclude)
        continue;

      client.socket.emit(command, data);
    }
  }

  /**
   * Adds a client to the room and sends the necessary messages
   * @param client
   */
  addClient(client) {
    this.clients.push(client);

    // Map all current clients
    const clients = this.clients.map((c, i) => {
      return {
        identifier: c.identifier,
        publicKey: c.publicKey
      }
    });

    // Send the clients to the new client
    client.socket.emit('connected', {
      clients: clients
    });

    // Let all other clients know about the connection
    this.emitAll('newClient', {
      identifier: client.identifier,
      publicKey: client.publicKey
    }, client.identifier);
  }

  /**
   * Sends the specified message to all clients in the room
   * @param identifier
   * @param messages
   */
  sendAll(identifier, messages) {
    console.log(identifier);

    for(let client of this.clients) {
      const messageText = messages.find(x => x.identifier === client.identifier).message;
      const message = {
        identifier: identifier,
        message: messageText
      };

      client.sendMessage(message);
    }
  }

  /**
   * Removes a client from the room and let's all other clients know of the lost client
   * @param client
   */
  disconnect(client) {
    this.emitAll('lostClient', client.identifier, client.identifier);

    console.log(client);

    this.clients.splice(this.clients.findIndex(x => x.identifier === client.identifier), 1);
  }
}

module.exports = Room;
