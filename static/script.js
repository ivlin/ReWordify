var api_key = "e4383d803d79b55ef72d1a68e85d075d";
var synonyms = new Array(50);


var getsyn = function(word){
    console.log("Input: " + word);
    $.getJSON("http://words.bighugelabs.com/api/2/" + api_key+"/" + word + "/json", function(data){
	return data;
    });
};

