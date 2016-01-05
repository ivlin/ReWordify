var api_key = "TNMlDYqLB3SteQle6a9U";

var getsyn = function(word){
    console.log("Input: " + word);
    $.ajax({	
	type: 'GET',
	url: "http://thesaurus.altervista.org/thesaurus/v1?word="+word +"&language=en_US&key="+ api_key +"&output=json",
	datatype:'jsonp',
	success: function(data){
	    console.log(data);
	}
	
    });
};

/*
var api_key = "e4383d803d79b55ef72d1a68e85d075d";
var getsyn = function(word){
    console.log("Input: " + word);
    $.ajax({
	type= 'GET',
	url: "http://words.bighugelabs.com/api/2/" + api_key+"/" + word + "/json?callback=?",
	datatype:'json',
	type: 'GET',
	url: "http://words.bighugelabs.com/api/2/" + api_key+"/" + word + "/json?callback=?",
	datatype:'json',
	success: function(data){
	    console.log(data);
	}
    });
};*/
