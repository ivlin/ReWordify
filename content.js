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

    //credit to http://is.gd/mwZp7E
	//TJ Crowder at StackOverflow

    var walk = function walk(node) {
	
	var child, next;

	switch ( node.nodeType )  
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) {
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

	    case 3: // Text node
	                handleText(node);
			break;
	}
    };



    var handleText = function handleText(node){
	var n = node.nodeValue;
	var ref = generateReplacementDict();
	n = replaceAll(n, ref);
    };

    /*
      @name: replaceAll
      @author: Ben McCormick of StackOverflow
    */
    function replaceAll(str,mapObj){
	var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

	return str.replace(re, function(matched){
            return mapObj[matched.toLowerCase()];
	});
    }

    var generateReplacementDict = function generateReplacementDict(){
	/* This will generate a dictionary where keys are the words to be replaced
	 The value of each key is the word that will replace it*/
	return {};
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
