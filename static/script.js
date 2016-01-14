var api_key = "e4383d803d79b55ef72d1a68e85d075d";
var synonyms = new Array(50);
var adjective = new Array(50);
var noun = new Array(50);
var verb = new Array(50);

var getsyn = function(word){
    console.log("Input: " + word);
    $.getJSON("http://words.bighugelabs.com/api/2/" + api_key+"/" + word + "/json", function(data){
	synonyms = data;
	if(checkdefined(synonyms.adjective)){
	    adjective = synonyms.adjective.syn;
	}
	if(checkdefined(synonyms.noun)){
	    noun = synonyms.noun.syn;
	}
	if(checkdefined(synonyms.verb)){
	    verb = synonyms.verb.syn;
	}
    });
};

var checkdefined = function(array){
    return array != undefined;
};
