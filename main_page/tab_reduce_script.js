
//store tab info in a global map we use this map to generate list of tabs that are not reduced
//if the element is in the map add it, if reduced remove it
//should get a message from the background script listening for new tabs and adding them to the list
//if a tab is deleted same deal
//

//function to add to all reduce buttons
function reduce_and_add_to_bottom(e){
    //divToMove is the div containing the link and title and button to be put into the bottom list
    var divToMove = document.getElementById(e.target.getAttribute("tabid"));
   document.getElementById("reduced-tabs-list").appendChild(divToMove);
    browser.tabs.remove(parseInt(e.target.getAttribute("tabid")));
    e.target.remove();
}

function reduce_all(){
    //loop through all tabs less the active tab and close and add to bottom
    let tabsInList = document.getElementById("tab-select-list");
    //check if it has any chilrend if not return
    if(tabsInList.childElementCount === 0){
        return;
    }
    let destination = document.getElementById("reduced-tabs-list");
    let divsToReduce = Array.from(document.getElementsByClassName("link-div"));
    for(var i = 0; i < divsToReduce.length;i++){
        var cur = divsToReduce[i];
        destination.appendChild(cur);
        divsToReduce[i].lastChild.remove();
        browser.tabs.remove(parseInt(cur.getAttribute("id")));
    }
    document.getElementById("reduce-all-button").innerHTML = "Expand All";
    
    
}
function expand_all(){
    
}
function context_all(e){
    e.target.innerHTML === "Expand All" ? expand_all() : reduce_all();
}




//what is below should become an init function
var allTabs = {};
function getCurrentWindowTabs(){
    //return a list of tabs in the current window
    return browser.tabs.query({currentWindow:true});
}
function genTabList(){
    //run this function everytime we click on the tab for this page
    getCurrentWindowTabs().then((tabs)=>{
        //get the area that we are dumping the tabs to
        //we are putting them in a element containing the tabs title, url and a checkbox
        //also include a hidden span that has the id of the tab
        let tabsList = document.getElementById("tab-select-list");
        let currentItem = document.createDocumentFragment();
        //loop through tabs if not active tab add to list
        for(let tab of tabs){
            if(!tab.active){
                /**
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
                
                reduceButton.setAttribute("tabid",tab.id);
                reduceButton.setAttribute("id","button"+tab.id);
                reduceButton.classList.add("reduce-button");
                reduceButton.textContent = "reduce";
                reduceButton.addEventListener("click",function(event){
                   reduce_and_add_to_bottom(event); 
                });
                
                tabTitle.textContent = tab.title;
                
                tabLink.setAttribute("href",tab.url);
                tabLink.setAttribute("target","_blank");
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
document.getElementById("reduce-all-button").addEventListener("click",context_all);
