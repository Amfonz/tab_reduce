

function getCurrentWindowTabs(){
    //return a list of tabs in the current window
    return browser.tabs.query({currentWindow:true});
}
function genTabList(){
    getCurrentWindowTabs().then((tabs)=>{
        //get the area that we are dumping the tabs to
        //we are putting them in a element containing the tabs title, url and a checkbox
        //also include a hidden span that has the id of the tab
        let tabsList = document.getElementById("tab-select-list");
        let currentItem = document.createDocumentFragment();
        //loop through tabs if not active tab add to list
        for(let tab of tabs){
            if(!tab.active){
                //create a div and put inside a url, tab title and checkbox
                let tabData = document.createElement('div');
                let tabLink = document.createElement('a');
                let tabTitle = document.createElement('p');
                let reduceButton = document.createElement('button');
                reduceButton.textContent = "reduce";
                tabTitle.textContent = tab.title;
                tabLink.setAttribute("href",tab.url);
                tabLink.textContent=tab.url;
                tabData.appendChild(tabTitle);
                tabData.appendChild(tabLink);
                tabData.appendChild(reduceButton);
                currentItem.appendChild(tabData);
            }
        }
        
        tabsList.appendChild(currentItem);
    });
}
document.addEventListener("DOMContentLoaded",genTabList);
