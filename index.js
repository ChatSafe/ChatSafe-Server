const fs = require('fs');
const colors = require('colors');
const commandExists = require('command-exists');

// if(!fs.existsSync('./config.json')) {
//   console.log('ERROR: Please create a config.json before launching the server.'.red);
//   console.log('ERROR: You can use config.json.default as an example.'.red);
//
//   return;
// }

const Server = require('./src/server');
const server = new Server();