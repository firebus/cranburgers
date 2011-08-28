/**
 * @file
 * 
 * Client-side js for Metalike
 * 
 * @author: Russell Uman <russ@firebus.com>
 */

window.metaLikeLoaded = false;
 
/**
 * Why am I doing this and not using jQuery?
 */
var $$ = function () {
  return document.querySelectorAll.apply(document, arguments)
};

/**
 * Dynamically create script tags to load external libraries
 * - socket.io.js
 */
function setupMetaLike() {
    console.log('setupMetaLike');

    var proto = document.createElement('script');
    proto.type = 'text/javascript';
    proto.src = 'http://' + hostname + '/socket.io/socket.io.js';
    var dhead = document.getElementsByTagName('head')[0] || document.documentElement;
    dhead.insertBefore(proto, dhead.firstChild);

    initializeMetalike();
}
window.addEventListener("load", setupMetaLike());

/**
 * Once libs are loaded, open a socket and do something trivial
 */
function initializeMetalike() {
  if (typeof io == 'undefined') {
	  // set to check every 100 milliseconds if the libary has loaded
	  window.setTimeout(initializeMetalike, 100);
	}
	else {
	  console.log('initializeMetalike');
	  window.socket = io.connect(hostname);
    socket.on('client', function (data) {
        console.log(data['message']);
      socket.emit('server', { message: 'server message' });
    });
	  attachMetalikeButtons();
  }
}

/**
 * Create a metalike button
 */
function createMetalikeButton() {
  var metaButton = document.createElement('A');
  metaButton.innerHTML = '<span>Meta-like</span>';
  //metaButton.setAttribute('class', 'as_link');
  metaButton.setAttribute('onclick', "sendMetalike('metalike');");
  return metaButton;
}

function createSeparator() {
  return document.createTextNode(' · ');
}

/**
 * Attach metalike button to all likes
 */
function attachMetalikeButtons() {
  console.log('attachMetalikeButtons');
  var likes = $$('li.uiUfiLike div.UIImageBlock_Content');
  var count = 0;
  if (typeof likes != 'undefined') {
    for (var like in likes) {
      if (typeof likes[like].appendChild == 'function') {
        likeAnchors = likes[like].querySelectorAll("div div a");
        if (onePersonLikes(likeAnchors)) {
          count++;
          likes[like].appendChild(createSeparator());
          likes[like].appendChild(createMetalikeButton());
        }
      }
    }
    console.log(count + ' likes');
  }
}

/**
 * Test a list of a tags
 */
function onePersonLikes(likeAnchors) {
  console.log('onePersonLikes');
  console.log('  ' + likeAnchors.length);
  var onlyOnePerson = true;
  for (var anchor in likeAnchors) {
    if (typeof likeAnchors[anchor] == 'object'
      && likeAnchors[anchor].getAttribute('title') == 'See people who like this item') {
      onlyOnePerson = false;
    }
  }
  return onlyOnePerson;
}

/**
 * Communicate with the server socket
 */
function sendMetalike(data) {
  console.log('sendMetalike');
  socket.emit('server', { message: 'metalike' });
}
