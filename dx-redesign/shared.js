// Lookup tables forever!
const navBarItemLookupTable = [
    // This is an array of arrays. The contents of each array are as follows:
    // [0] is the type. This determines the values of everything afterwards.

    // If [0] is 0, it's a button.
        // [1] is the buttons's name. Note that there is no margin between the icon and the text, so you're gonna have to do it yourself using custom styling. Accessible mode has no margins, so don't add a space before the item's name.  
        // [2] is exclusive to main mode and is the **relative path** to the button's icon, staring from this page. Keep in mind that this icon is done with the 'src' attribute of an <img> tag inside the button tag, so make sure that your icon is suppported by the <img>. If you don't want an icon, leave it blank. 
        // [3] and [4] control what the item does.
            // If [3] is 0, then it will be a button and [4] will be a link that gets opened inside the iframe.
            // If [3] is 1, then it will be a button and [4] will be a link that replaces the current tab and will get rid of this whole single-page thing. I repeat, it will open in the current tab and get rid of this site.
            // If [3] is 2, then it will be a button and [4] will be a link that opens in a new tab.
        // [5] is exclusive to main mode and is the per-button styling applied to the image within the button. Just so you have a loose idea of what's what, the result will look like <img [other stuff] style="whatever you put inside 5">. As you may have guessed, this has no support for classes or anything so only use it for things that apply to one button and nobody else.
        
    // If [0] is 1, it's text and maybe a horizontal rule.
        // [1] is the text to be displayed. If you want to have no text, make it a blank string: ""
        // [2] is the text's styling. "1" makes it a navBar section. If it's left as a blank string while [1] contains text, it won't have any sizing attached. If [1] is blank, this will be irrelevant. Exclusive to main mode.
        // [3] is whether or not we should append a horizontal rule, using true or false. If you just want a horizontal rule, leave everything else blank.
        // Note that in accessible mode, just text or text and a horizontal rule will create a new option group. Breaking out of that option group is done by just creating a horizontal rule. 
    [0, "Landing Page", " ", 0, "./pages/landing/index.html", ""],
    [0, "Home", "assets/navbar-icons/3ds-home-menu-icon.svg", 0, "./pages/home/index.html", "margin-bottom:-2px; height: auto; width: 16px; margin-right: 4px;"],
    [0, "Sites I Like", "", 0, "./pages/sites_i_like/index.html", ""],
];

const socialLinksItemLookupTable = [
    // This is an array of arrays. The contents of each array are as follows:
    // [0] is the type. This determines the values of everything afterwards.

    // If [0] is 0, it's a button.
        // [1] is the buttons's name. Note that while this doesn't appear on main mode, this does appear on accessible mode. 
        // [2] is the **relative path** to the button's icon, staring from this page. Keep in mind that this icon is done with the 'src' attribute of an <img> tag inside the button tag, so make sure that your icon is suppported by the <img>. If you don't want an icon, leave it as a blank string. This does nothing in accessiblity. 
        // [3] and [4] control what the item does.
            // If [3] is 0, then it will be a button and [3] will be a link that gets opened inside the iframe.
            // If [2] is 1, then  it will be a button and [3] will be a link that replaces the current tab and will get rid of this whole single-page thing. I repeat, it will open in the current tab and get rid of this site.
            // If [3] is 2, then it will be a button and [3] will be a link that opens in a new tab.
        // [5] is the per-button styling applied to the image within the button. Just so you have a loose idea of what's what, the result will look like <img [other stuff] style="whatever you put inside 5">. As you may have guessed, this has no support for classes or anything so only use it for things that apply to one button and nobody else. If you have nothing to style with, then leave it as a blank string: ""
        // [6] is the title of the button. It's what appears when you hover over it.
        // [7] is the alt of the button. It's what you see when the image fails to load or if the user needs assistive technology.

        // If it wasn't immediately obvious, this is based on the navBar system.
    [0, "YouTube", "assets/socialmedia-icons/youtube_icon.svg", 2, "https://www.youtube.com/user/AmmarZawar", "", "Pacomatic! That is my channel.", "YouTube", "margin-bottom: -2px;"],
    [0, "Bluesky", "assets/socialmedia-icons/bsky_logo.svg", 2, "https://bsky.app/profile/pacomatic.bsky.social", "", "It took me an astoundingly long time to get an account for social media that isn't Reddit or YouTube. Ain't that a thing?", "Bluesky"],
    [0, "GitHub", "assets/socialmedia-icons/github_logo.svg", 2, "https://github.com/pacomatic1/", "", "If I open-source code, it's usually here. ", "GitHub"],

];
const backgroundList = [
    // Unlike the navigation bar(s), this is a simple array: a list of paths to each background's HTML file. Exclusive to main mode.
    "./backgrounds/ps3Xmb.html", "./backgrounds/random_stuff_outlook.html", "./backgrounds/mode7/mariokart_snes_bowser3.html"
];
const absoluteToRelativePathLookupTable = [
    // So you know the query string, right? Well, the query string has to display the realtive path to the pages, and when we're trying to get the iframe's source, we don't have that. We only have the absolute path.
    // The only solution I could come up with was do a really stupid find and replace system, finding a string and, if it exists, replacing it with a new string.
    // If there was a better way of doing this that doesn't involve this stupid error-prone lookup table, then I would love it. But for now, this will have to do.

    // This is an array of arrays. Within each array:
    // [0] is mode.
        // If set to 0, find the first instance of [1], delete everything that precedes it, and replace it with [2]. 

    // Note that order matters. The first array here is the first one that we do stuff with, then the second, then the third.
    [0, "/pages/", "./pages/"],
];


// Set up the important stuff ASAP, and set up 'stuff that the user won't notice until they interact with it' last.

const mainIframe = document.getElementById("mainIframe");
initializeIframePage('./pages/landing/index.html');

var pageMode = determinePageMode(); // "main" or "accessible"
// console.log("You're using " + pageMode + " mode."); This got really annoying, really fast. I disabled it.

if ( window.location.href.includes("file:") ) { console.log("Some stuff on the site, like three.js, doesn't like being run locally. If you want to see the site in all its glory, get Node.js + http-server."); } // This also has the funny side effect that, because you're still going from PC to router to PC and not just loading from the hard drive, you get to see a glimpse into the network performance of the site. Perfect for network optimization; epic wins all around!

setBackgroundIframe(); 

populateMainModeNavBar(); // This only does something if you're in main mode.
populateMainModeSocialMediaList(); // This only does something if you're in main mode.
if (pageMode == "accessible") {
    populateAccessibleNavBar();
    document.getElementById('gotoPageButton').addEventListener("click", accessibleModeNavBarSelected);
}


window.addEventListener("popstate", onUserSwappingPageHistory);
document.getElementById("swapModesButton").addEventListener("click", swapPageMode);







// IFRAMES AND PAGE HANDLING
// Remember: Every single page (should) have a link to '/pages/shared.js'. If you want to do something that applies to all pages no matter what, this is where you go.

// Melonking, you're awesome! This link was used for a ton of things, namely handling the browser history: https://forum.melonland.net/index.php?topic=115.0

function initializeIframePage(relativePathToDefaultPage) {
    mainIframe.addEventListener("load", onIframePageSwap);
    var currentPage = findValueOfKeyFromQueryStringInUrl('page');

    if (currentPage == null) { loadNewPageInIframe(relativePathToDefaultPage); }
    else {loadNewPageInIframe(currentPage);}
}

function handleIframeExternalities() { // Currently, it handles query strings. This is to happen AFTER the iframe has loaded.
    
    // Handling of the Iframe's link. Does things like this because we have to wait for the response before we can do anything.
    var IframePagePath;
    var windowURL = window.location.href;
    window.onmessage = null;

    window.addEventListener('message', function(event) { 
        IframePagePath = event.data; 
        IframePagePath = convertAbsoluteIframePagePathToRelativePath(IframePagePath);    
        windowURL = replaceValueInKeyValuePairInUrlQueryStringBasedOnKey('page', IframePagePath, windowURL);
        history.replaceState({}, "Paco's Place", windowURL);
    }, {once : true});
    mainIframe.contentWindow.postMessage('sendHref', '*');

}

function onUserSwappingPageHistory() {
    window.location.reload();
}

function onIframePageSwap() {
    handleIframeExternalities();
}

function loadNewPageInIframe(linkToLoad) {
    mainIframe.src = linkToLoad;
    // I won't handle externalities as this is already done by the load event listener. Don't worry about it.
}

function openPageInIframeFromNavbar(linkToLoad) { // This is called when the user clicks on a navbar button. It loads the page in the iframe and sets the query string to the page that was loaded.
    loadNewPageInIframe(linkToLoad);
}

function convertAbsoluteIframePagePathToRelativePath(absolutePath) { // Bro trying not to use a lookup table: 
    var newPath; // The final result should be written into here.
    for (let i = 0; i < absoluteToRelativePathLookupTable.length; i++) { // For every array in the top array,
        switch (absoluteToRelativePathLookupTable[i][0]) { // Find the type, and handle the next steps based on a switch statement.
            case 0:
                var stringToFind = absoluteToRelativePathLookupTable[i][1];
                var stringToReplaceItWith = absoluteToRelativePathLookupTable[i][2];
                if (absolutePath.indexOf(stringToFind) == -1) { break; } // Need to make sure that the thing we're finding exists before changing it. Otherwise, the path we want may have already been chosen and we would be overwriting it.
                newPath = absolutePath.substring(absolutePath.indexOf(stringToFind));
                newPath = newPath.replace(stringToFind, stringToReplaceItWith); 
                break;
            default:
                console.log("Error: The lookup table for absolute to relative paths has an unimplemented type! Either the lookup table is wrong or you need to implement it. Get to work!");
                break;
        }
    };
    return newPath;

}





// MATH AND MISCELLANEOUS

function findValueofNthItemInArrayOfMultiItemArraysAssumingYouKnowWhatAndWhereTheRthItemIs(valueOfRthItem, indiceOfRthItem, arrayOfArraysToLookThrough, indiceOfNthItem) { // This finds the value of an item within an array of multi-item arrays assuming you already know what another item is. This seems oddly specific (because it is), but it has its uses; refer to the query string shenanigans.
    var foundValue = null;
    for (let i = 0; i < arrayOfArraysToLookThrough.length; i++) { // For every array in the top array,
        for (let j = 0; j <= arrayOfArraysToLookThrough[i].length; j++) { // see if the rth value is what you seek.
            if (arrayOfArraysToLookThrough[i][indiceOfRthItem] == valueOfRthItem) { // If it is, iterate to find nth item and, if found, set foundValue to it.
                foundValue = arrayOfArraysToLookThrough[i][indiceOfNthItem];
            };
        };
    };
    return foundValue;
    // You know, the code for this used to make multiple arrays and sort through them. It sucked. This is faster. And with far less bugs.
    // I'm glad I refactored this.
}

function getRandomInt(min, max) { // Thanks, MDN! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}
    
function setBackgroundIframe() { // This is exclusive to main mode. If you're on accessible mode, nothing happens.
   if (pageMode != 'main') {return;} 
    const backgroundIframe = document.getElementById("backgroundIframe");
    backgroundIframe.src = backgroundList[getRandomInt(0, backgroundList.length - 1)];
}

function determinePageMode() {
    if (document.getElementById("mainModeIdentifier") != null) {
        return "main";
    } else if (document.getElementById('accessibleModeIdentifier') != null) {
        return "accessible";
    }
}

function swapPageMode() {
    // All urls are relative to the current page. So long as both pages are in the same folder (which they should be), there will be no isses. 
    var urlOfMainMode = "./main.html";
    var urlOfAccessibleMode = "./accessible.html";
    
    var everythingAfterTheUrl = window.location.href.substring(window.location.href.indexOf(".html") + 5); // Depends on the .html at the end of the url (but before query strings and all that). As of now they all share this part of the url, but be careful in case things change.
    var newUrl;
    var urlOfModeToUse;
    switch(pageMode) { // Don't forget you're SWAPPING modes. If it's main mode, it has to swap to **anything that isn't main mode.**
        case "main":
            urlOfModeToUse = urlOfAccessibleMode;    
            break;
        case "accessible":
            urlOfModeToUse = urlOfMainMode;    
            break;
        default:
            console.log("Error: Tried to swap to unrecognized page mode! Either the page mode is invalid or you've yet to implement it. Get to work!");
            break;
    }
    newUrl = urlOfModeToUse + everythingAfterTheUrl;
    window.location.assign(newUrl); // This is the url that will be used for the new page. It will be the same as the current page, but with the mode changed.
}

// NAVIGATION BAR(S)

function populateMainModeSocialMediaList() {
    if (pageMode != "main") { return; } // Exit function if you're not in main mode so as to avoid issues. return seemed better than putting everything in yet another if statement so I'm keeping it this way.
    const socialMediaContainer = document.getElementById("socialMediaButtonContianer");
    for (let i = 0; i < socialLinksItemLookupTable.length; i++) {
        // In order to understand this, you need to understand socialLinksItemLookupTable.
        // Since everything depends on the type, I'll at least tell you this: socialLinksItemLookupTable[i][0] is the item's type.
        
        if (socialLinksItemLookupTable[i][0] == 0) {
            var anchorThatSurroundsTheButton = document.createElement("a"); // This <a> tag is crucial for adding interactivity. No interactivity = useless buttons, so use this.

            var buttonToCreate = document.createElement("button");
            buttonToCreate.className = "socialMediaButton";
            buttonToCreate.type = "button";

            // For the contents of the button, I want to add the text after the image and its custom styling, and that's best done via appending. As such, I'm doing all the complicated image stuff and THEN doing the text stuff.
            var imageWithinTheButton = document.createElement("img");
            imageWithinTheButton.src = socialLinksItemLookupTable[i][2];
            imageWithinTheButton.style = socialLinksItemLookupTable[i][5];
            imageWithinTheButton.className = "socialMediaButtonImage";
            buttonToCreate.appendChild(imageWithinTheButton);
            // buttonToCreate.innerHTML += socialLinksItemLookupTable[i][1]; This value is irrelevant for main mode, but in the event it does become relevant, this'll make it a smidge easier to re-implement it.
            
            anchorThatSurroundsTheButton.title = socialLinksItemLookupTable[i][6];
            imageWithinTheButton.alt = socialLinksItemLookupTable[i][7];


            // "What does the button do?"
            switch(socialLinksItemLookupTable[i][3]) {
                case 0:
                    anchorThatSurroundsTheButton.href = "javascript:openPageInIframeFromNavbar('" + socialLinksItemLookupTable[i][4] + "')";
                    break;
                case 1:
                    anchorThatSurroundsTheButton.href = socialLinksItemLookupTable[i][4];
                    break;
                case 2:
                    anchorThatSurroundsTheButton.href = socialLinksItemLookupTable[i][4];
                    anchorThatSurroundsTheButton.target = "_blank";
                    break;
                default:
                    console.log("Main mode's social media list has an broken item! Either the lookup table's wrong or the item is unimplemented. Either way, go fix it.");
                    break;
            }

            socialMediaContainer.appendChild(anchorThatSurroundsTheButton);
            anchorThatSurroundsTheButton.appendChild(buttonToCreate);
        }
    }
}

function populateMainModeNavBar() {
    if (pageMode != "main") { return; } // Exit function if you're not in main mode so as to avoid issues. return seemed better than putting everything in yet another if statement so I'm keeping it this way.
    const navBarItemContainer = document.getElementById("navBarItemContainer");
    for (let i = 0; i < navBarItemLookupTable.length; i++) {
        // In order to understand this, you need to understand navBarItemLookupTable.
        // Since everything depends on the type, I'll at least tell you this: navBarItemLookupTable[i][0] is the item's type.
        
        if (navBarItemLookupTable[i][0] == 0) {
            var anchorThatSurroundsTheButton = document.createElement("a"); // This <a> tag is crucial for adding interactivity. No interactivity = useless buttons, so use this.

            var buttonToCreate = document.createElement("button");
            buttonToCreate.className = "navBarButton";
            buttonToCreate.type = "button";

            // For the contents of the button, I want to add the text after the image and its custom styling, and that's best done via appending. As such, I'm doing all the complicated image stuff and THEN doing the text stuff.
            var imageWithinTheButton = document.createElement("img");
            imageWithinTheButton.src = navBarItemLookupTable[i][2];
            imageWithinTheButton.style = navBarItemLookupTable[i][5];
            buttonToCreate.appendChild(imageWithinTheButton);
            buttonToCreate.innerHTML += navBarItemLookupTable[i][1]; 
            


            // "What does the button do?"
            switch(navBarItemLookupTable[i][3]) {
                case 0:
                    anchorThatSurroundsTheButton.href = "javascript:openPageInIframeFromNavbar('" + navBarItemLookupTable[i][4] + "')";
                    break;
                case 1:
                    anchorThatSurroundsTheButton.href = navBarItemLookupTable[i][4];
                    break;
                case 2:
                    anchorThatSurroundsTheButton.href = navBarItemLookupTable[i][4];
                    anchorThatSurroundsTheButton.target = "_blank";
                    break;
            }

            navBarItemContainer.appendChild(anchorThatSurroundsTheButton);
            anchorThatSurroundsTheButton.appendChild(buttonToCreate);
        }
        if (navBarItemLookupTable[i][0] == 1) {
            var textToCreate = document.createElement("p");
            // When and where and if I add the text depends on the styling. You know what that means!!!
            if (navBarItemLookupTable[i][2] == '1') {
                textToCreate.innerHTML = navBarItemLookupTable[i][1];
                textToCreate.className = "navBarSection";
                navBarItemContainer.appendChild(textToCreate);
            }
            if (navBarItemLookupTable[i][3] == true) {
                var horizontalRule = document.createElement("hr");
                navBarItemContainer.appendChild(horizontalRule);
            }
        }
    }
}

function populateAccessibleNavBar() { // This also handles the social media links since they're in the same spot and using 2 functions seems awfully useless.
    if (pageMode != "accessible") { return; } // Exit function if you're not in main mode so as to avoid issues. return seemed better than putting everything in yet another if statement so I'm keeping it this way.
    const navBarSelector = document.getElementById("navBarDropDown");
    var currentOptionGroup = null;
    var newNavBarItemLookupTable = navBarItemLookupTable;

    // The social media links are in a separate lookup table, but appear in the same spot as the usual page links. To me, the simplest way of doing this is to convert the stuff from the social media lookup table into the same format as the navigation bar lookup table, and then add those BEFORE everything in the navigation bar.
    
    var socialMediaItemsArray = [
        [1, 'Social Media',"", true] // This is going to happen anyways, why even do this first thing through code? I'd just be wasting time.
    ];
    for (let i = 0; i < socialLinksItemLookupTable.length; i++) {
        // We're gonna make a brand new button and push() that into the social media table.
        var newOptionArray = [];

        switch (socialLinksItemLookupTable[i][0]) {
            case 0: // Type: Button
            newOptionArray.push(0); // Why read from the var, it's already guaranteed to be 0
            newOptionArray.push(socialLinksItemLookupTable[i][1]);
            newOptionArray.push("") // This value is irrelevant
            switch (socialLinksItemLookupTable[i][3]) { // Handles [3] and [4], after this switch statement we move to [5]
                case 0:
                    newOptionArray.push(0);
                    newOptionArray.push(socialLinksItemLookupTable[i][4]);
                    break;
                case 1:
                    newOptionArray.push(1);
                    newOptionArray.push(socialLinksItemLookupTable[i][4]);
                    break;
                case 2:
                    newOptionArray.push(2);
                    newOptionArray.push(socialLinksItemLookupTable[i][4]);
                    break;     
                default:
                    console.log("Error: The Social Media lookup table has a button that uses unimplemented funtionality in accessibility mode! Either the table is wrong or accessibility mode needs updating.");
            }
            newOptionArray.push(""); // This value is irrelevant
            // There are other values in the social media lookup table but they're irrelevant.
            break;
        }
        socialMediaItemsArray.push(newOptionArray);
    }
    socialMediaItemsArray.push( [1, "", "", true] ); // This breaks out of the option group.
    
    // I'd love to unshift, but right now the social media lookup table is an array of arrays. This means that the items we want would be 2 layers deep, which isn't suppoorted. As such, I'm going to unshift each array within socialMediaItemsArray one by one so as to make sure it's not nested.
    // Because we're unshifting, we have to go backwards.
    for (let i = socialMediaItemsArray.length - 1; i > -1; i--) {
        newNavBarItemLookupTable.unshift(socialMediaItemsArray[i]);
    }




    for (let i = 0; i < newNavBarItemLookupTable.length; i++) {
        // In order to understand this, you need to understand navBarItemLookupTable.
        // Since everything depends on the type, I'll at least tell you this: newNavBarItemLookupTable[i][0] is the item's type.

        // Also keep in mind that we have to use newNavBarItemLookupTable because we modify navBarItemLookupTable before we do anything.
        
        // Doing it in accessible mode is especially fun because having a divider with text creates an option group. As such, currentOptionGroup keeps track of where we are, and where we are is updated every time we create text and maybe a horizontal rule. It's a system that frankly shouldn't work as well as it does.

        if (newNavBarItemLookupTable[i][0] == 0) {
            var optionToAdd = document.createElement("option");
            optionToAdd.innerHTML = newNavBarItemLookupTable[i][1];
            optionToAdd.id = "navBarSelectableOption" + i;
            if (currentOptionGroup != null) {
                currentOptionGroup.appendChild(optionToAdd);
            } else {
                navBarSelector.appendChild(optionToAdd);
            }
            document.getElementById(optionToAdd.id).addEventListener("change", accessibleModeNavBarSelected);
        } else if (newNavBarItemLookupTable[i][0] == 1) {
            var optionGroupToMake = document.createElement('optgroup');
            var horizontalRuleToMake = document.createElement('hr');
            var isJustAHorizontalRule;

            if ( (newNavBarItemLookupTable[i][1] == "") && (newNavBarItemLookupTable[i][3] == true) ) { isJustAHorizontalRule = true; }
            else { isJustAHorizontalRule = false; }

            if (isJustAHorizontalRule == true) {
                currentOptionGroup = null; // This breaks out of the current option group.
                navBarSelector.appendChild(horizontalRuleToMake);
            } else {
                // We give them an id so that we can swap currentOptionGroup to the correct object. After all, we're not appending them while they're still in a variable. We're appending them after they've already been added to the page.
                optionGroupToMake.label = newNavBarItemLookupTable[i][1];
                optionGroupToMake.id = "navBarDividngOption"+ i;
                if (newNavBarItemLookupTable[i][3] == true) {
                    optionGroupToMake.appendChild(horizontalRuleToMake);
                }
                navBarSelector.appendChild(optionGroupToMake);
                currentOptionGroup = document.getElementById(optionGroupToMake.id);
            }

        }
    }
    
}

function accessibleModeNavBarSelected() { // This is called when the user presses the "Go to Page" button in accessible mode. This is because using event handlers for every option seems difficult and makes the ever-annoying misclick easier. 
    const navBarSelector = document.getElementById("navBarDropDown");
    var optionActionType = findValueofNthItemInArrayOfMultiItemArraysAssumingYouKnowWhatAndWhereTheRthItemIs(navBarSelector.value, 1, navBarItemLookupTable, 3);
    var optionActionValue = findValueofNthItemInArrayOfMultiItemArraysAssumingYouKnowWhatAndWhereTheRthItemIs(navBarSelector.value, 1, navBarItemLookupTable, 4);
    
    // Find what you've selected, then find where it is in the lookup table so we can get their action type and value. Once we have those, we just implement their functionality right here.
    // We don't bother handling the text + horizontal rules because they can't be selected in the first place.

    switch (optionActionType) {
        case 0:
            openPageInIframeFromNavbar(optionActionValue);
            break;
        case 1:
            window.open(optionActionValue, '_self').focus();
            break;
        case 2:
            window.open(optionActionValue, '_blank').focus();
            break;
        default:
            console.log("You pressed the 'Go to page' button in accessible mode! Sadly, the page you're going to uses an unsupported action type. Either the lookup table is wrong, or your didn't implement it. Get to work!");
            break;
    }

}





// QUERY STRING SHENANIGANS

function findValueOfKeyFromQueryStringInUrl(keyToFindValueOf) { // Gets the URL, looks at the query strings, and finds the corresponding the value for the key you want. If the key doesn't exist, it returns null.
        const url = window.location.href; 
        const searchParams = new URL(url).searchParams; 
        const urlSearchParams = new URLSearchParams(searchParams);
        const queryStringArray = Array.from(urlSearchParams.entries()); // Returns an array of arrays. Each array corresponds to one key/value pair, the key being [0] and value being [1].
        // We need to find an array (inside this one) whose [0]	is the key we seek.
        // Good thing I made a highly specific functon for that!
        return findValueofNthItemInArrayOfMultiItemArraysAssumingYouKnowWhatAndWhereTheRthItemIs(keyToFindValueOf, 0, queryStringArray, 1);
}

function replaceValueInKeyValuePairInUrlQueryStringBasedOnKey(keyToSelect, newValue, url) {
    url = new URL(url);
    const params = new URLSearchParams(url.search);
    params.delete(keyToSelect);
    params.append(keyToSelect, newValue);
    // Add the params to url. I tried looking for a built-in method but I can't find one, so I'll do it myself.
    url.search = params.toString();
    
    // params.toString() converts everything to percent-based encoding, converting every slash into a %2F. This sucks!
    // As such, I'm going to convert these back to slashes, since having slashes in your query string has no issues.
    // One might immediately assume that I'm gonna use decodeURIComponent(). As much as I'd love to, this is a bad idea since it decodes things that aren't slashes, and that's bad. Time to do it myself!
    url = convertPercentEncodedQueryStringToFinalQueryString(url.toString());
    return url;
}

function convertPercentEncodedQueryStringToFinalQueryString(percentEncodedQueryString) { // Include the leading 
    var newText = percentEncodedQueryString;
    newText = newText.replaceAll("%2F", "/");
    return newText;
}

