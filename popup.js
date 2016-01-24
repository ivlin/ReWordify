/*
  This is the javascript attached to the popup box that appears when the extension is clicked
  */

  var sendInstructions = function sendInstructions(){
    var slider = document.getElementById("slider");
    getActiveTab().then(function(tab){
     //   console.log("works2");
        chrome.tabs.sendMessage(tab[0].id, {scale:"page",mode:slider.value});
    });
};

var getActiveTab = function getActiveTab(){
    return new Promise(function(resolve,reject){
       chrome.tabs.query({active:true,currentWindow:true},function(tab){
           resolve(tab);
       });
   });
};

var slider = document.getElementById("slider");

var UDL = function updateLabel(val) {//changes label on slider
    var label = document.getElementById("sliderLabel");
    if(val==0)
       label.innerHTML = "Very Easy";
   if(val==25)
       label.innerHTML = "Easy";
   if(val==50)
       label.innerHTML = "Regular";
   if(val==75)
       label.innerHTML = "Hard";
   if(val==100)
       label.innerHTML = "Very Hard";
}

//various event listeners to change the label on the slider and send messages
slider.addEventListener('mouseup', function(){
    UDL(slider.value);
//    sendInstructions();
})
slider.addEventListener('mousedown', function(){
    UDL(slider.value);
//    sendInstructions();
});
slider.addEventListener('mousemove', function(){
    UDL(slider.value);
//    sendInstructions();
});
UDL(slider.value);
//sendInstructions();
document.getElementById("submit").addEventListener("click",sendInstructions);
