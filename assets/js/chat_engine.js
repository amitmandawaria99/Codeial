// chat_engine.js is the file that is communication from client side i.e. you on browser(frontend)
class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;

    //go and connect, Requesting for connection with chat server
    this.socket = io.connect('http://localhost:5000');

    if (this.userEmail) {
      this.connectionHandler();
    }
  }
  //sends a request for connection
  connectionHandler() {
    let self = this;

    //Requesting for connecting socket to the chat server
    this.socket.on('connect', function () {
      console.log('connection established using sockets...!');

      //Emitting function for joining the chat room
      self.socket.emit('join_room', {
        user_email: self.userEmail,
        chatroom: 'codeial'
      });

      //Giving messages to all in that chat room that new user joined
      self.socket.on('user_joined', function (data) {
        console.log('a user joined!', data);
      })
    });

    //CHANGE :: send a message on clicking the send message button
    //Sending message on click event
    $('#send-message').click(function () {
      let msg = $('#chat-message-input').val();

      if (msg != '') {
        self.socket.emit('send_message', {
          message: msg,
          user_email: self.userEmail,
          chatroom: 'codeial'
        });
      }
    });

    this.socket.on('receive_message', function (data) {
      console.log('message received', data.message);

      let newMessage = $('<li>');
      let messageType = 'other-message';
      if (data.user_email == self.userEmail) {
        messageType = 'self-message';
      }

      newMessage.append($('<span>', {
        'html': data.message
      }));

      newMessage.append($('<sub>', {
        'html': data.user_email
      }));

      newMessage.addClass(messageType);

      $('#chat-messages-list').append(newMessage);
    })

  }
}