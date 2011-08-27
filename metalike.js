/**
 * @file
 * 
 * Client-side js for Metalike
 * 
 * @author: Russell Uman <russ@firebus.com>
 */

/**
 * Once libs are loaded, open a socket and do something trivial
 */
function openSocket() {
  if (typeof io == 'undefined') {
	  // set to check every 100 milliseconds if the libary has loaded
	  window.setTimeout(openSocket, 100);
	}
	else {
    var socket = io.connect();
    socket.on('news', function (data) {
      //console.log(data);
      alert("Hello, " + data['hello']);
    });
  }
}	
 
/**
 * Dynamically create script tags to load external libraries
 * - socket.io.js
 */
function loadSocketIo() {
  var proto = document.createElement('script');
  proto.type = 'text/javascript';
  proto.src = '/socket.io/socket.io.js';
  var dhead = document.getElementsByTagName('head')[0] || document.documentElement;
  dhead.insertBefore(proto, dhead.firstChild);
  openSocket();
}
window.addEventListener("load", loadSocketIo());

