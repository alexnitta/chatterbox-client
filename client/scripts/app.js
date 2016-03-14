var escapeMessage = function(messageObj) {

  var defaults = {
    username: 'default',
    text: 'default',
    roomname: 'default'
  };

  var messageObj = messageObj || defaults;

  var escapeInput = function (userInput) {
    var results = '';
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
var messages = {};

var message = {
  username: 'shawndrost',
  text: 'trololo',
  roomname: '4chan'
};
// wrap this jQuery call in a function that we can invoke with setInterval

app.init = function() {};

app.retrieve = function () {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message recieved');
      // if success then check if messages are dangerous 
      
      messages = data;
    },

    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });
};

app.send = function(messageObject) {

  var defaults = {
    username: 'default',
    text: 'default',
    roomname: 'default'
  };

  var messageObject = messageObject || defaults;

  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(escapeMessage(messageObject)),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });

};
app.init();

console.log (messages);  



