var api_key = "e4383d803d79b55ef72d1a68e85d075d";

var getsyn = function(word){
    var Http = new XMLHttpRequest();
    var word = "brolic";
    var url = "http://words.bighugelabs.com/api/{2}/{" +api key+"/{"+word+"}/{json}";
    Http.open("GET",url,true);
    Http.send();
    return Http.responseText;
};
