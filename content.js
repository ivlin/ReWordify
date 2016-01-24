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
	findAllSynonyms(selection.toString(), 0);
    }
    else if(mode == "complicate"){
	findAllSynonyms(selection.toString(), 100);
    }
    $(document).ajaxStop(function(){
	if(!$.isEmptyObject(mapObj)){
	    parent.nodeValue = replaceAll(val);
	}
    });
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
//var api_key = "e4383d803d79b55ef72d1a68e85d075d";

var mapObj = {};

//API key for Big Huge Thesaurus
var api_key = "0d5eb6972f22a57bb1b4f4434c0f32a2";

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

/*
  @name: replaceAll
  @author: Ben McCormick of StackOverflow
*/
var replaceAll = function replaceAll(str){
    var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
    return str.replace(re, function(matched){
	return mapObj[matched];
    });
}

var handleText = function handleText(node, difficulty){
    findAllSynonyms(node.nodeValue, difficulty);
    $(document).ajaxStop(function(){
	if(!$.isEmptyObject(mapObj)){
	    node.nodeValue = replaceAll(node.nodeValue);
	}
    });
};
var diff;
var result;
var getSyn = function getSyn(word, p){
    /*takes a word and part of speech and returns a synonym corresponding to it*/
    str = word.toLowerCase();
    if(freq_list[str] == undefined){
        console.log(JSON.stringify(str));
        console.log(freq_list[str]);
        result = word;
    }
    else{
        $.getJSON("https://words.bighugelabs.com/api/2/" + api_key + "/" + word + "/json", function(data){
            if(data[p]==undefined){
                //console.log(p);
                result = word;
            }
            else{
                //console.log("works");
                var synonyms = data[p]["syn"];
                for(var syn in synonyms){
                    
                    //console.log(synonyms[0]);
                    var f = freq_list[synonyms[syn]];
                    console.log(synonyms[syn]);
                    console.log(f);
                    console.log(diff);
                    syn=synonyms[syn];
                    console.log(word);
                    if(f!=undefined){
                        if (diff == 0){
                            if(f>10000){
                                result = syn;
                                return;
                            }
                        }
                        else if (diff == 25){
                            if(f<=10000&&f>5000){
                                result = syn;
                                return;
                            }
                        }
                        else if (diff == 50){
                            console.log(f);
                            console.log(syn);
                            if(f<=5000&&f>1000){
                                result = syn;
                                return;
                            }
                        }
                        else if (diff == 75){
                            if(f<=1000&&f>100){
                                result = syn;
                                return;
                            }
                        }
                        else if (diff == 100){
                            if(f<=100){
                                result = syn;
                                return;
                            }
                        }
                    }
                } result = word;
            }
        });
    }

}

var findAllSynonyms = function findAllSynonyms(str, difficulty){
    //regex to look for words, which are one or zero capital letters followed by multiple lowercase letters
    //outputs an array of words
    words = str.match(/[A-Z]?[a-z]+/g);
    //if it finds none, no relacement is done
    if(words == null){
	return str;
    }

    for(i = 0; i < words.length; i++){
	if(words[i].length > 2){
	    findSynonym(words[i], difficulty);
	}
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

var replaceSelection = function replaceSelection(part){
    var selection = window.getSelection();
    var parent = selection.anchorNode;
    var val = parent.nodeValue;
    console.log(selection.toString());
    getSyn(selection.toString(),part);
    $(document).one("ajaxStop",function(){
        console.log(selection.toString());
        val = val.replace(selection.toString(),result);
        parent.nodeValue = val;
    });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    /*
      Listens for a message from popup.js
      Request is the message. It can be of any type.
      Currently, request is a JSON object where mode is a string containing simplify or complicate.
    */
    if (request.scale == "page"){
	replaceAll(request.part);
    }
    else if (request.scale == "selection"){
	replaceSelection(request.part);
    }
    if(request.mode != undefined)
        diff = request.mode;
    //console.log(diff);
    //console.log("running");
});
>>>>>>> ray
