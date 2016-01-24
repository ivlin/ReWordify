//chrome.tabs.executeScript(null, {file:"content.js"});
chrome.contextMenus.create({id:"simplify",title:"simplify",contexts:["selection"]});
chrome.contextMenus.create({id:"complicate",title:"complicate",contexts:["selection"]});

chrome.contextMenus.onClicked.addListener(function(info, tab){
    chrome.tabs.sendMessage(tab.id,{mode:info.menuItemId,scale:"selection"});
});
