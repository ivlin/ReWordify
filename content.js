//The content script is injected into every page and is used to interact with the DOM.

(function() {
    //Prevents the content script from being injected multiple times
    if(window.injected){
	return;
    }
    window.injected = true;

    //Thesaurus API stuff
    var api_key = "e4383d803d79b55ef72d1a68e85d075d";

    //ajax call to frequency table
    var freq_list;
    $.ajax({
	datatype: 'json',
	url: chrome.extension.getURL("data.json"),
	type: 'GET',
	success: function(data){
	    freq_list = JSON.parse(data);
	    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		/*
		  Listens for a message from popup.js
		  Request is the message. It can be of any type.
		  Currently, request is a JSON object where mode is a string containing simplify or complicate.
		*/
		switch (request.mode){
		case "simplify":
		    walk(document.body, true);
		    break;
		case "complicate":
		    walk(document.body, false);
		    break;
		}
	    });
	}
    });

    var mapObj = {};
    
    //credit to http://is.gd/mwZp7E
    //TJ Crowder at StackOverflow
    var walk = function walk(node, simplify) {
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
	    handleText(node, simplify);
	    break;
	}
    };
    
    var handleText = function handleText(node, simplify){
	findAllSynonyms(node.nodeValue, simplify);
	$(document).ajaxStop(function(){
	    if(!$.isEmptyObject(mapObj)){
		console.log(mapObj);
		var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
		node.nodeValue = node.nodeValue.replace(re, function(matched){
		    return mapObj[matched];
		});
	    }
	});
    };

    /*
      @name: replaceAll
      @author: Ben McCormick of StackOverflow
    */
    var findAllSynonyms = function findAllSynonyms(str, simplify){
	words = str.match(/[A-Z]?[a-z]+/g);
	if(words == null){
	    return str;
	}
	mapObj = {};
	
	for(i = 0; i < words.length; i++){
	    findSynonym(words[i], simplify);
	}
    };

    var findSynonym = function findSynonym(str, simplify){
	word = str.toLowerCase();
	var found = false;
	var data;
	if(freq_list[word] == undefined || freq_list[word] < 1000){
	    $.getJSON("https://words.bighugelabs.com/api/2/" + api_key + "/" + word + "/json", function(data){
		for(var key in data){
		    var synonyms = data[key]["syn"];
		    for(var syn in synonyms){
			if(freq_list[synonyms[syn]] != undefined && freq_list[synonyms[syn]] > 0 && !found){
			    mapObj[str] = synonyms[syn];
			    found = true;
			}
		    }
		}
	    })
	}
    };
})();
