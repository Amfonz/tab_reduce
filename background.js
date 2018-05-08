function displayPage(){
    var properties = {
        active : true,
        url : "main_page/tab_reduce.html"
    }
    browser.tabs.create(properties);
}
browser.browserAction.onClicked.addListener(displayPage);