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

var checkeasy = function(word){    
};

var checkhard = function(word){
    return freq_list[word] < 1000;	
}

//API key for Big Huge Thesaurus
var api_key = "e4383d803d79b55ef72d1a68e85d075d";

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

var diff;

var getSyn = function getSyn(word, p){
    /*takes a word and part of speech and returns a synonym corresponding to it*/
    str = word.toLowerCase();
    if(freq_list[str] == undefined){
        console.log(JSON.stringify(str));
        console.log(freq_list[str]);
        return word;
    }
    else{
        console.log("works");
        $.getJSON("https://words.bighugelabs.com/api/2/" + api_key + "/" + word + "/json", function(data){
            if(data[p]==undefined)
                return word;
            else{
                var synonyms = data[p]["syn"];
                for(var syn in synonyms){
                    var f = freq_list[syn];
                    console.log(f);
                    if (diff == 0){
                        if(f>10000)
                            return syn;
                    }
                    else if (diff == 25){
                        if(f<=10000&&f>5000)
                            return syn;
                    }
                    else if (diff == 50){
                        if(f<=5000&&f>1000)
                            return syn;
                    }
                    else if (diff == 75){
                        if(f<=1000&&f>100)
                            return syn;
                    }
                    else if (diff == 100){
                        if(f<=100)
                            return syn;
                    }
                    return word;
                }
            }
        });
    }

}

var replaceSelection = function replaceSelection(mode){
    var selection = window.getSelection();
    var parent = selection.anchorNode;
    var val = parent.nodeValue;
    console.log(val);
    if (getSyn(val,mode)!=val){
        val = val.replace(selection,getSyn(val,mode));
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

    diff = request.mode;

});
