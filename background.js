function displayPage(){
    browser.tabs.query({currentWindow:true}).then((tabs)=>{
        //if there is a tab reduce already open just make it active otherwise open a fresh one
        let present = false;
        for (let tab of tabs){
            if(tab.title === "Tab Reduce"){ present = true;}
        }
        if(!present){
            var properties = {
                active : true,
                url : "main_page/tab_reduce.html",
                index : 0
            }
            browser.tabs.create(properties);
        }
    });
}
browser.browserAction.onClicked.addListener(displayPage);