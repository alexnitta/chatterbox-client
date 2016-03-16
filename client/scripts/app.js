// Objectives

// Display messages retrieved from the parse server.
// Use proper escaping on any user input. 
// Allow users to select a user name for themself and to be able to send messages

var escapeMessage = function(messageObj) {

  var defaults = {
    username: 'default',
    text: 'default',
    roomname: 'default'
  };

  if (messageObj.text === undefined) {
    messageObj = defaults;
  }

  var escapeInput = function (userInput) {
    var results = '';
    if (userInput === undefined) {
      return results;
    }
    var maliciousTypes = /[^a-zA-Z0-9\s\\.\\!\\,\\?]/gi;

    for (var i = 0; i < userInput.length; i++) {
      if (!userInput[i].match(maliciousTypes)) {
        results += userInput[i];
      }
    }
    return results;
  };

  messageObj.username = escapeInput(messageObj.username);
  messageObj.text = escapeInput(messageObj.text);
  messageObj.roomname = escapeInput(messageObj.roomname);

  return messageObj;

};


var app = {};
app.server = 'https://api.parse.com/1/classes/messages';


app.fetch = function() {
  var messages = {};
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received');
      app.clearMessages();
      messages = data;
      var rooms = {};
      for (var i = 99; i > 0; i--) {
        var safeMessage = escapeMessage(messages.results[i]);
        rooms[safeMessage.roomname] = safeMessage.roomname; 
        if (app.room === 'All Rooms') {
          console.log('matched All Rooms');
          $('#chats').prepend('<div class="username">' + safeMessage.username + ':</div><div class="chat">' + safeMessage.text + '</div>');  
        } 
        if (safeMessage.roomname === app.room) {
          console.log('matched: ' + app.room);
          $('#chats').prepend('<div class="username">' + safeMessage.username + ':</div><div class="chat">' + safeMessage.text + '</div>');
        }
      }

      //adding roomname 

      $('#roomname').html('');  
      $('#roomname').append($('<option>', {  
        value: 'All Rooms', 
        text: 'All Rooms'
      }, '</option>'));

      for (var key in rooms) {
        if (key !== undefined && key !== '') {
          if (key === app.room) {
            $('#roomname').append($('<option>', {  
              selected: 'selected',
              value: key, 
              text: key
            }, '</option>'));
          } else {
            $('#roomname').append($('<option>', {  
              value: key, 
              text: key
            }, '</option>'));
          }
        }
      }
    },

    error: function (data) {
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });
  return messages;
}; 



app.send = function(messageObject) {

  var defaults = {
    username: 'default',
    text: 'default',
    roomname: 'lobby'
  };

  var messageObject = messageObject || defaults;

  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(escapeMessage(messageObject)),
    contentType: 'application/json',
    success: function (data) {
      app.fetch();
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });

};

// have an input field to add new messageData 
  // uses POST 
  // displays message on
app.addMessage = function(userInput) {
  var safeInput = escapeMessage(userInput);
  console.log(safeInput);
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(safeInput),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received');
      app.fetch();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });

}; 


app.clearMessages = function() {
  $('#chats').html('');
};

app.init = function() {
  app.clearMessages();
  app.room = 'All Rooms';
};  

app.sendUserMessage = function() {

  var userObj = {};
  userObj.username = window.location.search.substring(10);
  userObj.text = $('#saySomething input').val();
  app.send(userObj);

};

app.addRoom = function() {
  var someObj = {};
  someObj.roomname = $('#addRoom input').val();
  console.log('add room: ' + someObj.roomname);
  $('#roomname').append($('<option>', {  
    value: someObj.roomname, 
    text: someObj.roomname
  }, '</option>'));
};

$( document ).ready(function() {
  $('#clearButton').click(app.init);
  $('#sendMessage').click(app.sendUserMessage);

  // start somewhere on roomname

  // updates the room when the list selection changes
  $('#roomname').on('change', function() {
    app.room = $(this).val();
    app.fetch();
  });

  $('#addingRoom').click(app.addRoom);
});

setInterval(app.fetch, 5000);





