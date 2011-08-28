/**
 * @file
 * 
 * Client-side js for Metalike
 * 
 * @author: Russell Uman <russ@firebus.com>
 */

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
function loadSocketIo() {
  var proto = document.createElement('script');
  proto.type = 'text/javascript';
  proto.src = 'http://' + hostname + '/socket.io/socket.io.js';
  var dhead = document.getElementsByTagName('head')[0] || document.documentElement;
  dhead.insertBefore(proto, dhead.firstChild);
  initializeMetalike();
}
window.addEventListener("load", loadSocketIo());


/**
 * Once libs are loaded, open a socket and do something trivial
 */
function initializeMetalike() {
  attachMetalikeButtons();
  
  if (typeof io == 'undefined') {
	  // set to check every 100 milliseconds if the libary has loaded
	  window.setTimeout(initializeMetalike, 100);
	}
	else {
	  var socket = io.connect(hostname);
    socket.on('news', function (data) {
      console.log(data);
      alert("Hello, " + data['hello']);
      socket.emit('my other event', { my: 'data' });
    });
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
  var likes = $$('li.uiUfiLike div.UIImageBlock_Content');
  var count = 0;
  if (typeof likes != 'undefined') {
    for (var like in likes) {
      if (typeof likes[like].appendChild == 'function') {
        count++;
        likes[like].appendChild(createSeparator());
        likes[like].appendChild(createMetalikeButton());
      }
    }
    //alert(count + ' likes');
  }
}

function sendMetalike(data) {
  alert('sendMetalike');
  socket.emit('metalike', { my: data });
}
