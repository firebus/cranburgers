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
	  window.socket = io.connect(hostname);
    socket.on('metalike', function (data) {
        displayMetalike(data);
    });
	  attachMetalikeButtons();
  }
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
        if (onePersonLikes(likes[like])) {
          var storyId = getStoryId(likes[like]);
          var userId = getUserId(likes[like]);
          likes[like].appendChild(createSeparator());
          likes[like].appendChild(createMetalikeButton(storyId, userId)); count++;
        }
      }
    }
  }
}

/**
 * Get the name, edit URL of the current user)
 */
function getFbUser() {
  var userElement = $$('a.fbxWelcomeBoxName')[0];
  var fbUser = {
    userId: userElement.getAttribute('href'),
    userName: userElement.innerHTML,
  }
  return fbUser;
}

/**
 * Get the username for a like
 */
function getUserName(like) {
  var likeAnchor = like.querySelector('div div a');
  var userName = likeAnchor.innerHTML;
  return userName;
}
  
/**
 * Get the user id for a like
 */
function getUserId(like) {
  var likeAnchor = like.querySelector('div div a');
  var dataHovercard = likeAnchor.getAttribute('data-hovercard');
  var userId = dataHovercard.match(/\?id=(.*)/)[1];
  return userId;
}  

/**
 * Calculate the story id for a like
 */
function getStoryId(like) {
  // the form elemen is 4 hops up
  // form -> ui -> li -> div -> div (like) -> a
  // this is terrible of course - we should be iterating over the forms in the
  // first place :)
  var parentForm = like.parentNode.parentNode.parentNode.parentNode;
  var idClasses = parentForm.getAttribute('class').split(' ');
  var storyId = idClasses[0].split('_')[1];
  return storyId;
}

/**
 * Test a list of a tags
 */
function onePersonLikes(like) {
  var onlyOnePerson = true;
  likeAnchors = like.querySelectorAll('div div a');
  for (var anchor in likeAnchors) {
    if (typeof likeAnchors[anchor] == 'object'
      && likeAnchors[anchor].getAttribute('title') == 'See people who like this item') {
      onlyOnePerson = false;
    }
  }
  return onlyOnePerson;
}

/**
 * Create a metalike button
 */
function createMetalikeButton(storyId, userId, userName) {
  var metaButton = document.createElement('A');
  metaButton.innerHTML = '<span>Meta-like</span>';
  metaButton.setAttribute('onclick', "sendMetalike('" + storyId + "', '" + userId + "');");
  metaButton.setAttribute('id', 'mid-' + storyId + '-' + userId);
  socket.emit('lookup', { storyId: storyId });
  return metaButton;
}

/**
 * Create a separator
 */
function createSeparator() {
  return document.createTextNode(' · ');
}

/**
 * Communicate with the server socket
 */
function sendMetalike(storyId, userId) {
  var fbUser = getFbUser();
  socket.emit('metalike', { storyId: storyId, userId: userId, userName: fbUser.userName });
  displayMetalike({ storyId: storyId, userId: userId, metaUserName: fbUser.userName }); 
}

/**
 * If there's a metalike on an item, attach a div to that item
 */
function displayMetalike(data) {
  var metalikeSelector = 'a#mid-' + data.storyId + '-' + data.userId;
  var metalikes = $$(metalikeSelector);
  for (metalike in metalikes) {
    if (typeof metalikes[metalike] == 'object') {
      var metalikeDiv = createMetalikeDiv(data.userId, data.metaUserName);
      metalikes[metalike].appendChild(metalikeDiv);
    }
  }
}

function createMetalikeDiv(userId, userName) {
  var metalikeDiv = document.createElement('DIV');
  metalikeDiv.innerHTML = userName + ' metalikes this';
  return metalikeDiv;
}
