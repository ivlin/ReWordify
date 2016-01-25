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


//Thesaurus API stuff
var api_key = "e4383d803d79b55ef72d1a68e85d075d";
//var api_key = "0d5eb6972f22a57bb1b4f4434c0f32a2";


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

//Selection Function====================================================================================================
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
}


var diff; //difficulty of word, an int in increments of 25 from 0-100
var result; //final word selected to be a synonym, will be modified by ajax calls
var getSyn = function getSyn(word, p){
    /*takes a word and part of speech and sets result corresponding to it*/
    str = word.toLowerCase();
    result=word;//in case the search doesn't work
    $.getJSON("https://words.bighugelabs.com/api/2/" + api_key + "/" + word + "/json", function(data){
        //gets JSON in format: {"Part of Speech":{"Type of Word":[words,more words]}
        if(data[p]==undefined){//in case the part of speech selected is wrong
            result = word;
        }
        else{
            var synonyms = data[p];
                var sim = getSynHelper(synonyms,"sim");//similar words
                var rel = getSynHelper(synonyms,"rel");//related words
                var syn = getSynHelper(synonyms,"syn");//synonyms
                if(rel!=undefined){//if there actually are related words
                    result = rel;
                    return;
                }
                else if(sim!=undefined){//if there actually are similar words
                    result = sim;
                    return;
                }
                else if(syn!=undefined){//if there are synonyms
                    result = syn;
                    return;
                }
                else{//set result to original if nothing is found
                    result = word;
                    return;
                }
            }
        })
}

var getSynHelper = function getSynHelper(dict, type){
    //takes the dictionary containing word types as keys and returns a word based on matching difficulty
    var synonyms = dict[type];
    for(var syn in synonyms){
        var f = freq_list[synonyms[syn]];/*
        //console.log helps to see what words will work during testing
        console.log("Possible Word: "+synonyms[syn]);
        console.log("Frequency: "+f);*/
        syn=synonyms[syn];
        if(f!=undefined){//if the word is in the frequency list
            if (diff == 0){
                if(f>40000&&Math.random()*10<3){//definition of Very Easy
                    return syn;
                }
            }
            else if (diff == 25){
                if(f<=40000&&f>30000&&Math.random()*10<3){//definition of Easy
                    return syn;
                }
            }
            else if (diff == 50){
                if(f<=30000&&f>20000&&Math.random()*10<3){//definition of Regular
                    return syn;
                }
            }
            else if (diff == 75){
                if(f<=20000&&f>10000&&Math.random()*10<3){//definition of Hard
                    return syn;
                }
            }
            else if (diff == 100){
                if(f<=10000&&Math.random()*10<3){//definition of Very Hard
                    return syn;
                }
            }
        }
        else{
            if (Math.random()*10<2){//has a chance of word being used if not on freq list
                return syn;
            }
        }
    }
}

var replaceSelection = function replaceSelection(part){
    var selection = window.getSelection();//gets the part selected in the window
    var parent = selection.anchorNode;//gets the node of the selected part
    var val = parent.nodeValue;//gets the value of the entire node
    getSyn(selection.toString(),part);//set result to the synonym
    $(document).one("ajaxStop",function(){//once ajax to dictionary is done, replace text
        val = val.replace(selection.toString(),result);//change the selection part of value to the new word
        parent.nodeValue = val;//set the node value to the new value
    });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    /*
        Listens for a message from popup.js
        Request is the message. It can be of any type.
        Currently, request is a JSON object where:
        mode is an int from 0-100 and a multiple of 25
        scale is a string containing either "page" or "selection"
        part is a string containing either "Noun" "Verb" "Adjective" or "Adverb"
        */
    if (request.scale == "page")
	walk(document.body, parseInt(request.mode));
    else if (request.scale == "selection")//if a selection replacement is requested, perform the corresponding function
        replaceSelection(request.part);
    
    if(request.mode != undefined)//if the mode is defined, set difficulty
        diff = request.mode;
});
