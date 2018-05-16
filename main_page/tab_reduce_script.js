//todo
/*

*/


//function to add to all reduce buttons
function reduceAndAddToBottom(e){
    //divToMove is the div containing the link and title and button to be put into the bottom list
    var divToMove = e.target.parentNode;
   document.getElementById("reduced-tabs-list").appendChild(divToMove);
    browser.tabs.remove(parseInt(divToMove.getAttribute("id")));
    e.target.remove();
}
function expandAndRemoveFromBottom(e){
    var pNode = e.target.parentNode.parentNode;
    pNode.removeChild(e.target.parentNode);
}

function reduceAll(){
    //loop through all tabs less the active tab and close and add to bottom
    let tabsInList = document.getElementById("tab-select-list");
    //check if it has any chilrend if not return
    if(tabsInList.childElementCount === 0){
        return;
    }
    let destination = document.getElementById("reduced-tabs-list");
    while(tabsInList.firstChild){
        tabsInList.firstChild.lastChild.remove();
        browser.tabs.remove(parseInt(tabsInList.firstChild.getAttribute("id")));
        destination.append(tabsInList.firstChild);  
    }  
}





function getCurrentWindowTabs(){
    //return a list of tabs in the current window
    return browser.tabs.query({currentWindow:true});
}
function genTabList(){
    //run this function everytime we click on the tab for this page
    getCurrentWindowTabs().then((tabs)=>{
        //tab-select-list is where the open tabs list is put
        let tabsList = document.getElementById("tab-select-list");
        //clear the current list (if there is one) and make a new one
        while(tabsList.firstChild){
            tabsList.removeChild(tabsList.firstChild);
        }
        let currentItem = document.createDocumentFragment();
        //loop through tabs if not active tab add to list
        for(let tab of tabs){
            if(!tab.active){
                /**
                structure of a list element
                <div>
                    <p><tab.title></p>
                    <a href="<tab.url">tab.url</a>
                    <button id="<tab.id>"onClick="reduce">reduce</button>
                
                </div>
                **/
                //create a div and put inside a url, tab title button and id
                //id for closing tab when reducing it
                let tabData = document.createElement('div');
                let tabLink = document.createElement('a');
                let tabTitle = document.createElement('p');
                let reduceButton = document.createElement('button');
                tabData.setAttribute("id",tab.id);
                tabData.classList.add("link-div");
                
                reduceButton.setAttribute("id","button"+tab.id);
                reduceButton.classList.add("reduce-button");
                reduceButton.textContent = "reduce";
                reduceButton.addEventListener("click",function(event){
                   reduceAndAddToBottom(event); 
                });
                
                tabTitle.textContent = tab.title;
                tabTitle.classList.add("tab-titles");
                
                tabLink.setAttribute("href",tab.url);
                tabLink.setAttribute("target","_blank");
                tabLink.textContent=tab.url;
                tabLink.addEventListener("click",function(event){
                   expandAndRemoveFromBottom(event); 
                });
                
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
document.getElementById("reduce-all-button").addEventListener("click",reduceAll);
browser.tabs.onActivated.addListener((tabInfo)=>{
    browser.tabs.get(tabInfo.tabId).then((tab)=>{
       if(tab.title === "Tab Reduce"){
           genTabList();
       }
    });
});
