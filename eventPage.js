//chrome.tabs.executeScript(null, {file:"content.js"});
//sends messages containing part and scale
chrome.contextMenus.create({id:"noun",title:"Noun",contexts:["selection"]});
chrome.contextMenus.create({id:"verb",title:"Verb",contexts:["selection"]});
chrome.contextMenus.create({id:"adjective",title:"Adjective",contexts:["selection"]});
chrome.contextMenus.create({id:"adverb",title:"Adverb",contexts:["selection"]});

chrome.contextMenus.onClicked.addListener(function(info, tab){
    chrome.tabs.sendMessage(tab.id,{part:info.menuItemId,scale:"selection"});
});
