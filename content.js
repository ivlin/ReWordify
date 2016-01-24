//The content script is injected into every page and is used to interact with the DOM.

var freq_list;

$.ajax({
    async: false,
    datatype: 'json',
    url: chrome.extension.getURL("data.json"),
    type: 'GET',
    success: function(data){
	freq_list = JSON.parse(data);
    }
});

var reverseDictionary = function reverseDictionary(dict){
    dict = hardToSimple();
    var reverse = {};
    for (var prop in dict){
	reverse[dict[prop]] = prop;
    }
    return reverse;
};

var replaceSelection = function replaceSelection(mode){
    var selection = window.getSelection();
    var parent = selection.anchorNode;
    var val = parent.nodeValue;
    if (mode == "simplify"){
	findAllSynonyms(val, 0);
	$(document).ajaxStop(function(){
	    var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
	    val = val.replace(re, function(matched){
		return mapObj[matched];
	    });
	});
    }
    else if(mode == "complicate"){
	findAllSynonyms(val, 100);
	$(document).ajaxStop(function(){
	    var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
	    val = val.replace(re, function(matched){
		return mapObj[matched];
	    });
	});
    }
    parent.nodeValue = val;
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    /*
      Listens for a message from popup.js
      Request is the message. It can be of any type.
      Currently, request is a JSON object where mode is a string containing simplify or complicate.
    */
    if(request.scale == "page"){
	walk(document.body, parseInt(request.mode));
    }
    else if(request.scale == "selection"){
	replaceSelection(request.mode);
    }
});

//Thesaurus API stuff
var api_key = "e4383d803d79b55ef72d1a68e85d075d";

var mapObj = {};

//credit to http://is.gd/mwZp7E
//TJ Crowder at StackOverflow
var walk = function walk(node, difficulty) {
    var child, next;
    
    switch (node.nodeType){
    case 1:  // Element
    case 9:  // Document
    case 11: // Document fragment
	child = node.firstChild;
	while(child){
	    next = child.nextSibling;
	    walk(child);
	    child = next;
	}
	break;
	
    case 3: // Text node
	handleText(node, difficulty);
	break;
    }
};

var handleText = function handleText(node, difficulty){
    findAllSynonyms(node.nodeValue, difficulty);
    $(document).ajaxStop(function(){
	if(!$.isEmptyObject(mapObj)){
	    /*
	      @author: Ben McCormick of StackOverflow
	    */
	    var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
	    node.nodeValue = node.nodeValue.replace(re, function(matched){
		return mapObj[matched];
	    });
	}
    });
};

var findAllSynonyms = function findAllSynonyms(str, difficulty){
    //regex to look for words, which are one or zero capital letters followed by multiple lowercase letters
    //outputs an array of words
    words = str.match(/[A-Z]?[a-z]+/g);
    //if it finds none, no relacement is done
    if(words == null){
	return str;
    }

    for(i = 0; i < words.length; i++){
	findSynonym(words[i], difficulty);
    }
};

var findSynonym = function findSynonym(str, difficulty){
    word = str.toLowerCase();
    var found = false;
    var data;
    if(freq_list[word] == undefined || freq_list[word] < 1000){
	//ajax call to Big Huge Thesaurus
	///The JSON object is divided into parts of speech, which each has an array of synonyms
	$.getJSON("https://words.bighugelabs.com/api/2/" + api_key + "/" + word + "/json", function(data){
	    for(var key in data){
		var synonyms = data[key]["syn"];
		for(var syn in synonyms){
		    //checks if the word is suitable for replacement and has not been found
		    if(freq_list[synonyms[syn]] != undefined && freq_list[synonyms[syn]] > 1000 && !found){
			mapObj[str] = synonyms[syn];
			found = true;
		    }
		}
	    }
	})
    }
};
