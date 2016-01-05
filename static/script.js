var api_key = "TNMlDYqLB3SteQle6a9U";

var getsyn = function(word){
    console.log("Input: " + word);
    $.ajax({	
	type: 'GET',
	url: "http://thesaurus.altervista.org/thesaurus/v1?word="+word +"&language=en_US&key="+ api_key +"&output=json",
	datatype:'json',
	success: function(data){
	    console.log(data);
	}
	
    });
};
