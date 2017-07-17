(function() {
  var App;
  App = {};
  /*
    Init 
  */
  App.init = function() {
    App.canvas = document.getElementById('can');
    App.ctx = App.canvas.getContext("2d");
    App.ctx.fillStyle = "solid";
    App.ctx.strokeStyle = "#000";
    App.ctx.lineWidth = 5;
    App.ctx.lineCap = "round";
    App.socket = io.connect('http://localhost:4000');
    App.socket.on('draw', function(data) {
      return App.draw(data.x, data.y, data.type);
    });
    App.draw = function(x, y, type) {
      if (type === "dragstart") {
        App.ctx.beginPath();
        return App.ctx.moveTo(x, y);
      } else if (type === "drag") {
        App.ctx.lineTo(x, y);
        return App.ctx.stroke();
      } else {
        return App.ctx.closePath();
      }
    };
    App.socket.on('clearBoard', function() {
      return App.clearBoard();
    });
    App.clearBoard = function(){
     App.ctx.strokeStyle = "#000";
     App.ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
    }

    // Changing the color
    App.changeColorRed = function(){
     App.ctx.strokeStyle = "#F00";
    }

    App.socket.on('changeColorRed', function() {
      return App.changeColorRed();
    });

  };
  /*
    Draw Events
  */
  $('canvas').on('drag dragstart dragend', function(e) {
    var offset, type, x, y;
    type = e.handleObj.type;
    offset = $(this).offset();
    e.offsetX = e.clientX - offset.left;
    e.offsetY = e.clientY - offset.top;
    x = e.offsetX;
    y = e.offsetY;
    App.draw(x, y, type);
    App.socket.emit('drawClick', {
      x: x,
      y: y,
      type: type
    });
  });
  $('#clearBoard').on('click', function() {
      App.clearBoard(); 
      App.socket.emit('clearData'); 
  });
  $('#colorRed').on('click', function() {
    App.changeColorRed();
    App.socket.emit('colorRED');       
  });

  $('canvas').on('mouseenter', function () {
    $('canvas').css('cursor','pointer');
  });
  $('canvas').on('mouseleave', function () {
    $('canvas').css('cursor','default');
  });
 
  $(function() {
    return App.init();
  });
}).call(this);