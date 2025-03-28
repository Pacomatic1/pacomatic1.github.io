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
    [0, "Home", "assets/navbar-icons/3ds-home-menu-icon.svg", 0, "./pages/home/index.html", "margin-bottom:-2px; height: auto; width: 16px; margin-right: 4px;"],
    [0, "Projects", "", 2, "https://pacomatic1.github.io"],
    [1, "Extra Pages", "1", true],
    [0, "Link in iframe!", "", 0, "https://pacomatic1.github.io/projects/clicking_palace/index.html"],
    [1, "", "", true],
    [0, "Thick of It Paradise!!", "", 1, "https://pacomatic1.github.io/projects/clicking_palace/index.html"]
];

const socialLinksItemLookupTable = [
    // This is an array of arrays. The contents of each array are as follows:
    // [0] is the type. This determines the values of everything afterwards.

    // If [0] is 0, it's a button.
        // [1] is the buttons's name. Note that there is no margin between the icon and the text, so you're gonna have to do it yourself using custom styling or a space before the text starts. 
        // [2] is the **relative path** to the button's icon, staring from this page. Keep in mind that this icon is done with the 'src' attribute of an <img> tag inside the button tag, so make surethat your icon is suppported by the <img>. If you don't want an icon, 
        // [3] and [4] control what the item does.
            // If [3] is 0, then it will be a button and [3] will be a link that gets opened inside the iframe.
            // If [2] is 1, then  it will be a button and [3] will be a link that replaces the current tab and will get rid of this whole single-page thing. I repeat, it will open in the current tab and get rid of this site.
            // If [3] is 2, then it will be a button and [3] will be a link that opens in a new tab.
        // [5] is the per-button styling applied to the image within the button. Just so you have a loose idea of what's what, the result will look like <img [other stuff] style="whatever you put inside 5">. As you may have guessed, this has no support for classes or anything so only use it for things that apply to one button and nobody else. If you have nothing to style with, then leave it as a blank string: ""
        // [6] is the title of the button. It's what appears when you hover over it.
        // [7] is the alt of the button. It's what you see when the image fails to load or if the user needs assistive technology.

        // If it wasn't immediately obvious, this is based onthe navBar system.
    [0, "", "assets/socialmedia-icons/youtube_icon.svg", 2, "https://www.youtube.com/user/AmmarZawar", "", "Pacomatic! That is my channel.", "YouTube", "margin-bottom: -2px;"],
    [0, "", "assets/socialmedia-icons/bsky_logo.svg", 2, "https://bsky.app/profile/pacomatic.bsky.social", "", "It took me an astoundingly long time to get an account for social media that isn't Reddit or YoiTube. Ain't that a thing?", "Bluesky"],
    [0, "", "assets/socialmedia-icons/github_logo.svg", 2, "https://github.com/pacomatic1/", "", "If I open-source code, it's usually here. ", "GitHub"],

];
// Unlike the navigation bar, this is a simple array: a list of paths to each background's HTML file.
const backgroundList = [
    "./backgrounds/ps3Xmb.html", "./backgrounds/random_stuff_outlook.html"
]

var pageMode = determinePageMode();// "main" or "accessible"

console.log("You're using " + pageMode + " mode.")

setBackgroundIframe(); 
if (pageMode == "main") {
    populateMainModeNavBar();
    populateMainModeSocialMediaList();
} else if (pageMode == "accessible") {
    populateAccessibleNavBar();
    document.getElementById('gotoPageButton').addEventListener("click", accessibleModeNavBarSelected);
}
openLinkInIframe('./pages/landing/index.html');




function determinePageMode() {
    if (document.getElementById("mainModeIdentifier") != null) {
        return "main";
    } else if (document.getElementById('accessibleModeIdentifier') != null) {
        return "accessible";
    }
}

function setBackgroundIframe() { // This is exclusive to main mode. If you're on accessible mode, nothing happens.
    if (pageMode == "main") {
        const backgroundIframe = document.getElementById("backgroundIframe");
        backgroundIframe.src = backgroundList[getRandomInt(0, backgroundList.length - 1)];
    } else { return; }
}

function populateMainModeSocialMediaList() {
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
            buttonToCreate.innerHTML += socialLinksItemLookupTable[i][1]; 
            
            anchorThatSurroundsTheButton.title = socialLinksItemLookupTable[i][6];
            imageWithinTheButton.alt = socialLinksItemLookupTable[i][7];


            // "What does the button do?"
            switch(socialLinksItemLookupTable[i][3]) {
                case 0:
                    anchorThatSurroundsTheButton.href = "javascript:openLinkInIframe('" + socialLinksItemLookupTable[i][4] + "')";
                    break;
                case 1:
                    anchorThatSurroundsTheButton.href = socialLinksItemLookupTable[i][4];
                    break;
                case 2:
                    anchorThatSurroundsTheButton.href = socialLinksItemLookupTable[i][4];
                    anchorThatSurroundsTheButton.target = "_blank";
                    break;
            }

            socialMediaContainer.appendChild(anchorThatSurroundsTheButton);
            anchorThatSurroundsTheButton.appendChild(buttonToCreate);
        }
    }
}

function populateMainModeNavBar() {
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
                    anchorThatSurroundsTheButton.href = "javascript:openLinkInIframe('" + navBarItemLookupTable[i][4] + "')";
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

function populateAccessibleNavBar() {
    const navBarSelector = document.getElementById("navBarDropDown");
    var currentOptionGroup = null;
    for (let i = 0; i < navBarItemLookupTable.length; i++) {
        // In order to understand this, you need to understand navBarItemLookupTable.
        // Since everything depends on the type, I'll at least tell you this: navBarItemLookupTable[i][0] is the item's type.
        
        // Doing it in accessible mode is especially fun because having a divider with text creates an option group. As such, currentOptionGroup keeps track of where we are, and where we are is updated every time we create text and maybe a horizontal rule. It's a system that frankly shouldn't work as well as it does.

        if (navBarItemLookupTable[i][0] == 0) {
            var optionToAdd = document.createElement("option");
            optionToAdd.innerHTML = navBarItemLookupTable[i][1];
            optionToAdd.id = "navBarSelectableOption" + i;
            if (currentOptionGroup != null) {
                currentOptionGroup.appendChild(optionToAdd);
            } else {
                navBarSelector.appendChild(optionToAdd);
            }
            document.getElementById(optionToAdd.id).addEventListener("change", accessibleModeNavBarSelected);
        } else if (navBarItemLookupTable[i][0] == 1) {
            var optionGroupToMake = document.createElement('optgroup');
            var horizontalRuleToMake = document.createElement('hr');
            var isJustAHorizontalRule                

            if ( (navBarItemLookupTable[i][1] == "") && (navBarItemLookupTable[i][3] == true) ) { isJustAHorizontalRule = true; }
            else { isJustAHorizontalRule = false; }

            if (isJustAHorizontalRule == true) {
                currentOptionGroup = null;
                navBarSelector.appendChild(horizontalRuleToMake);
            } else {
                // todo: give custom id then getById and set currentOptGroup to that
                optionGroupToMake.label = navBarItemLookupTable[i][1];
                optionGroupToMake.id = "navBarDividngOption"+ i;
                if (navBarItemLookupTable[i][3] == true) {
                    optionGroupToMake.appendChild(horizontalRuleToMake);
                }
                navBarSelector.appendChild(optionGroupToMake);
                currentOptionGroup = document.getElementById(optionGroupToMake.id);
            }

        }
    }
    
}

function accessibleModeNavBarSelected() { // This is called when the user presses the "Go to Page" button in accessible mode.
    const navBarSelector = document.getElementById("navBarDropDown");
    var optionActionType = findValueofNthItemInArrayOfMultiItemArraysAssumingYouKnowWhatAndWhereTheRthItemIs(navBarSelector.value, 1, navBarItemLookupTable, 3);
    var optionActionValue = findValueofNthItemInArrayOfMultiItemArraysAssumingYouKnowWhatAndWhereTheRthItemIs(navBarSelector.value, 1, navBarItemLookupTable, 4);
    
    switch (optionActionType) {
        case 0:
            openLinkInIframe(optionActionValue);
            break;
        case 1:
            window.open(optionActionValue, '_self').focus();
            break;
        case 2:
            window.open(optionActionValue, '_blank').focus();
            break;
    
    }

}

function openLinkInIframe(linkAsString) {
    const mainIframe = document.getElementById("mainIframe");
    mainIframe.src = linkAsString + "?autoplay=1";

}

function getRandomInt(min, max) { // Thanks, MDN! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}
    
function findValueOfKeyFromQueryStringInUrl(keyToFindValueOf) { // Gets the URL, looks at the query strings, and finds the corresponding the value for the key you want. If the key doesn't exist, it returns null.
        const url = window.location.href; 
        const searchParams = new URL(url).searchParams; 
        const urlSearchParams = new URLSearchParams(searchParams);
        const queryStringArray = Array.from(urlSearchParams.entries()); // Returns an array of arrays. Each array corresponds to one key/value pair, the key being [0] and value being [1].
        // We need to find an array (inside this one) whose [0]	is the key we seek.
        // Good thing I made a highly specific functon for that!
        return findValueofNthItemInArrayOfMultiItemArraysAssumingYouKnowWhatTheFirstItemIs(keyToFindValueOf, queryStringArray, 1);
}

function findValueofNthItemInArrayOfMultiItemArraysAssumingYouKnowWhatAndWhereTheRthItemIs(valueOfRthItem, indiceOfRthItem, arrayOfArraysToLookThrough, indiceOfNthItem) { // This finds the value of an item within an array of multi-item arrays assuming you already know what the first item is. This seems oddly specific (because it is), but it has its uses; refer to the lookup table and the query string shenanigans.
    var foundValue;
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
};
