chrome.runtime.onMessage.addListener(function(){
    chrome.contextMenus.create({id:"simplify",title:"simplify"});
    chrome.contextMenus.create({id:"complicate",title:"complicate"});
});

chrome.contextMenus.onClicked.addListener(function(info, tab){
    chrome.tabs.sendMessage(tab.id, {mode:info.menuItemId,scale:"selection"});
});
