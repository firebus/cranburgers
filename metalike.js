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
 * Once libs are loaded, open a socket and do something trivial
 */
function initializeMetalike() {
  attachMetalikeButtons();
  
  if (typeof io == 'undefined') {
	  // set to check every 100 milliseconds if the libary has loaded
	  window.setTimeout(initializeMetalike, 100);
	}
	else {
	  var socket = io.connect('http://localhost:7777');
    socket.on('news', function (data) {
      //console.log(data);
      //alert("Hello, " + data['hello']);
    });
  }
}

/**
 * A test function that edits the innerHTML of the existing like button
 */
function insultLikers() {
	var likes = $$('.like_link span.default_message, .cmnt_like_link span.default_message');
	if (typeof likes != 'undefined') {
    for (var like in likes) { 
      if (likes[like].firstChild) {
        likes[like].firstChild.nodeValue = "Like it, you big fat ape!"; 
      }
    }
  }
}

/**
 * Create a metalike button
 */
function createMetalikeButton() {
  var metaButton = document.createElement('BUTTON');
  metaButton.innerHTML = '<span>Like</span>';
  metaButton.setAttribute('class', 'as_link');
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
      count++;
      likes[like].appendChild(createSeparator());
      likes[like].appendChild(createMetalikeButton());
    }
    //alert(count + ' likes');
  }
}

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
