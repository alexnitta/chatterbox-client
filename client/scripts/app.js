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

// Display messages retrieved from the parse server.

// Use proper escaping on any user input. 
// Since you're displaying input that other users have typed, your app is vulnerable XSS attacks. 
// See the section about escaping below.

// Note: If you issue an XSS attack, you must make it innocuous enough to be educational, 
// rather than disruptive. Basically you should scope your attacks to be console.logs or minor style changes. 
// The following are not allowed:

// alerts
// adding or removing dom elements
// auto-posting
// DDOS attacks
// Setup a way to refresh the displayed messages (either automatically or with a button)

// Allow users to select a user name for themself and to be able to send messages

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
        // 

      $('#roomname').html('');  
      $('#roomname').append($('<option>', {  
        value: 'All Rooms', 
        text: 'All Rooms'
      }));

      for (var key in rooms) {
        $('#roomname').append($('<option>', {  
          value: key, 
          text: key
        }));
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

var message = {
  username: 'alex',
  text: 'sai',
  roomname: 'bob'
};


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
// have an input field to add new messageData 
  // uses POST 
  // displays message on


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
  userObj.text = $('input').val();
  app.send(userObj);

};



$( document ).ready(function() {
  $('#clearButton').click(app.init);
  $('#sendMessage').click(app.sendUserMessage);
  $('#roomname').on('change', function() {
    app.room = $(this).val();
    app.fetch();
  });
});

setInterval(app.fetch, 5000);





