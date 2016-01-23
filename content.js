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

var checkhard = function(word){
    return freq_list[word] < 1000;	
};

var checkeasy = function(word){    
};

var replaceAll = function replaceAll(mode){
    var ref;
    console.log(mode);
    if (mode == "simplify"){
	document.getElementsByTagName("title")[0].innerHTML = "SIMPLE";
	ref = hardToSimple();
    }
    else if (mode == "complicate"){   
	document.getElementsByTagName("title")[0].innerHTML = "HARD";
	ref = simpleToHard();
    }
    walk(document.body,ref);
};

//credit to http://is.gd/mwZp7E
//TJ Crowder at StackOverflow

var walk = function walk(node, reference) {
    var child, next;
    
    switch ( node.nodeType ) {
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
    var ref = hardToSimple();	
    n = replaceMap(n, ref);
    node.nodeValue = n;
};

/*
  @name: replaceAll
  @author: Ben McCormick of StackOverflow
*/
var replaceMap = function replaceMap(str, mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"g");

    return str.replace(re, function(matched){
        return mapObj[matched];
    });
};

var reverseDictionary = function reverseDictionary(dict){
    dict = hardToSimple();
    var reverse = {};
    for (var prop in dict){
	reverse[dict[prop]] = prop;
    }
    console.log(reverse);
    return reverse;
};

var hardToSimple = function hardToSimple(){
    /* This will generate a dictionary where keys are the words to be replaced
       The value of each key is the word that will replace it*/
    return {"properties":"HAAAAAAAAAAAAAAAAAAA","Just":"well"};
};

var simpleToHard = function simpleToHard(){
    /* This will generate a dictionary where keys are the words to be replaced
       The value of each key is the word that will replace it*/
    return {"GUI":"well"};
};

var replaceSelection = function replaceSelection(mode){
    var selection = window.getSelection();
    var parent = selection.anchorNode;
    var val = parent.nodeValue;
    if (mode == "simplify"){
	val = val.replace(selection,"THIS IS FOR SIMPLETONS");
    }
    else if(mode == "complicate"){
	val = val.replace(selection,"THIS IS FOR INTEMELLECTUAL PPL");
    }
    parent.nodeValue = val;
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    /*
      Listens for a message from popup.js
      Request is the message. It can be of any type.
      Currently, request is a JSON object where mode is a string containing simplify or complicate.
    */
    if (request.scale == "page"){
	replaceAll(request.mode);
    }
    else if (request.scale == "selection"){
	replaceSelection(request.mode);
    }
});
