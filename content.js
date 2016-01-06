//The content script is injected into every page and is used to interact with the DOM.

(function() {
    //Prevents the content script from being injected multiple times
    if(window.injected){
	return;
    }
    window.injected = true;
    
    var simplify = function simplify(){
	document.getElementsByTagName("title")[0].innerHTML = "SIMPLE";
    };

    var complicate = function complicate(){
	document.getElementsByTagName("title")[0].innerHTML = "HARD";
    };

    var parseHTML = function parseHTML(){
	var keywords;
	var paragraphs = document.getElementsByTagName("p");
	for (paragraph in paragraphs){
	    
	}
    };

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	/*
	  Listens for a message from popup.js
	  Request is the message. It can be of any type.
	  Currently, request is a JSON object where mode is a string containing simplify or complicate.
	*/
	switch (request.mode){
	case "simplify":
	    simplify();
	    break;
	case "complicate":
	    complicate();
	    break;
	default:
	    break;
	}
    });
})();
