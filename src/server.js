const HttpServer = require('http');
const IOServer = require('socket.io');
const colors = require('colors');
const fs = require('fs');

const Client = require('./client');
const Room = require('./room');

class Server {
  constructor() {
    this.httpServer = HttpServer.createServer((req, res) => {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('<h1>ChatSafe Server</h1>');
    });

    this.httpServer.listen(4080);

    this.io = new IOServer({
      pingInterval: 10000,
      pingTimeout: 5000,
    });

    this.io.listen(this.httpServer);
    this.io.set('transports', ['websocket']);

    this.onConnection();

    this.clients = [];
    this.rooms = [];
    this.connectingClients = [];

    console.log('Server setup and listening.'.green);
  }

  onConnection() {
    this.io.on('connection', (socket) => {
      socket.on('identify', (data) => {
        if(this.checkIdentifierInUse(data.identifier)) {
          socket.emit('identifierInUse');
          socket.disconnect();
          return;
        }

        // Create a new client
        const newClient = new Client(socket, data.identifier, data.publicKey);

        // Make sure that the room is created
        this.maybeCreateRoom(data.room);

        const room = this.rooms.find(x => x.name === data.room);

        // Have the client join the room.
        newClient.joinRoom(room);

        // Push the new client to the clients array
        this.clients.push(newClient);

        socket.c = newClient;
      });

      socket.on('send', (data) => {
        socket.c.room.sendAll(socket.c.identifier, data);
      });

      socket.on('disconnect', () => {
        socket.c.room.disconnect(socket.c);

        this.clients.splice(this.clients.findIndex(x => x.identifier === socket.c.identifier), 1);
        socket.disconnect();

        console.log('Client disconnected.');
      });
    });
  }

  maybeCreateRoom(room) {
    console.log('The room name is', room);

    const index = this.rooms.findIndex(x => x.name === room);

    console.log('The room\'s index is', index);

    if(index < 0) {
      const newRoom = new Room(room);

      this.rooms.push(newRoom);

      console.log(this.rooms);
    }
  }

  checkIdentifierInUse(identifier) {
    const index = this.clients.findIndex(x => x.identifier === identifier);

    return index > -1;
  }
}

module.exports = Server;
