// chat_sockets.js is the observer/server(server side)
//receiving a connection
module.exports.chatSockets = function (socketServer) {

  //Requiring socket.io for chat engine
  var io = require('socket.io')(socketServer);

  //Receiving request for connecting socket and acknowledging the connection
  io.sockets.on('connection', function (socket) {
    console.log('new connection received', socket.id);

    socket.on('disconnect', function () {
      console.log('socket disconnected');
    });

    //Receiving request for joining
    socket.on('join_room', function (data) {
      console.log('joining request received', data);

      //Joined the user to the chat room
      socket.join(data.chatroom);

      //acknowledging all members in that chat room that new user joined
      io.in(data.chatroom).emit('user_joined', data);
    })

    //CHANGE :: detect send_message and broadcast to everyone in the room
    //Emitting receive message event when handled send message
    socket.on('send_message', function (data) {
      console.log("send message request received");
      io.in(data.chatroom).emit('receive_message', data);
    });



  });
}