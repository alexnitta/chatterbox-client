// YOUR CODE HERE:
var escaping = function (userInput) {
  // create new variable 
 // loop through userInput to check for special harmful characters
   // if characters are safe then add to result
 
 //return result outside loop 
 

  var results = '';
  var maliciousTypes = /[^a-zA-Z0-9\s\\.\\!\\,\\?]/gi;
  for (var i = 0; i < userInput.length; i++) {
    if (!userInput[i].match(maliciousTypes)) {
      results += userInput[i];
    }
  }
  return results;

};


