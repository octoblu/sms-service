require('coffee-script/register');
var Command = require('./command.coffee');
var command = new Command(process.argv);
command.run();
