(function() {
  var varScript = document.createElement('SCRIPT');
  varScript.type = 'text/javascript';
  varScript.innerHTML = 'var hostname = \'HOSTNAME\';';
  document.getElementsByTagName('head')[0].appendChild(varScript); 
  var metaScript = document.createElement('SCRIPT'); 
  metaScript.type = 'text/javascript'; 
  metaScript.src = 'http://HOSTNAME/metalike.js';
  document.getElementsByTagName('head')[0].appendChild(metaScript); 
})();
