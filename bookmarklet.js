(function() {
  var varScript = document.createElement('SCRIPT');
  varScript.type = 'text/javascript';
  varScript.innerHTML = 'var hostname = \'localhost\'; var port = 7777;';
  document.getElementsByTagName('head')[0].appendChild(varScript); 
  var metaScript = document.createElement('SCRIPT'); 
  metaScript.type = 'text/javascript'; 
  metaScript.src = 'http://localhost:7777/metalike.js';
  document.getElementsByTagName('head')[0].appendChild(metaScript); 
})();
