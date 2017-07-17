var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + ""));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  
    socket.on('drawClick', function(data) {
      socket.broadcast.emit('draw', {
        x: data.x,
        y: data.y,
        type: data.type
      });
    });

    socket.on('clearData', function() {
      socket.broadcast.emit('clearBoard');
    });

    socket.on('colorRED', function() {
      socket.broadcast.emit('changeColorRed');
    });
});

http.listen(4000);
console.log("Server is listening to 4000");


