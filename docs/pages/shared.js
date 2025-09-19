'use strict';
// This is a helper script, used on every single iframe (unless they're non-compliant or something, which you should defenitely fix).

window.onmessage = function(e) { onParentSendingMessageToIframe(e.data); };

// Now for the global functions. I want to use imports, but this stuff will often be called by <script> tags so I cannot do that. And that maketh me sad. Make sure that all of these have 'sharedJS_global_' at the start. That way I'm less likely to accidentally overwrite them or something.
window.sharedJS_global_changeQueryString = changeQueryString;
window.sharedJS_global_getQueryStringValue = getQueryStringValue; 
window.sharedJS_global_sendMessageToParent = sendMessageToParent;



// GENERAL FUNCTIONS

function onParentSendingMessageToIframe(message) {
    // Always return an array; the first item's the original message, the second item is the thing they asked for.
    if (message == "sendHref") {
        sendMessageToParent(["sendHref", window.location.href]);
    } else if (message == "doesSharedExist") {
        sendMessageToParent(["doesSharedExist", true]);
    }
    
    // If it's not one of these, it's most likely meant for the actual site and not this script. As such, NO ERRORS!
}







// GLOBAL FUNCTIONS, SEE THE DECLARATIONS AT THE START OF THE FILE FOR MORE DETAILS

function changeQueryString(key, value) {
    // Give it a key and a value. If the key does not exist in the URL, a new key with that value is made. If it does exist, then the old value is overwritten with this one. If you give it null, the key and value will be removed from the URL
    // Had to say this in case you couldn't infer.
    sendMessageToParent(["changeQueryString", key, value]);
}

function getQueryStringValue(key) {
    // Gets a value from the query string. Simply feed it a key and, if it exists, it will retrun the corresponding value. If the key does not exist, it will return null.
    const url = top.location.href; 
    const searchParams = new URL(url).searchParams; 
    const urlSearchParams = new URLSearchParams(searchParams);
    const queryStringArray = Array.from(urlSearchParams.entries()); // Returns an array of arrays. Each array corresponds to one key/value pair, the key being [0] and value being [1].
    // We need to find an array (inside this one) whose [0]	is the key we seek.
    // Good thing I made a highly specific functon for that!
    return findValueofNthItemInArrayOfMultiItemArraysAssumingYouKnowWhatAndWhereTheRthItemIs(key, 0, queryStringArray, 1);
}

function sendMessageToParent(message, parentOrigin) { // If parentOrigin is empty, it will be sent, no matter who the parent is. 
    if (parentOrigin == null) { parentOrigin = "*"}
    parent.postMessage(message, parentOrigin);
}





// HELPERS

function findValueofNthItemInArrayOfMultiItemArraysAssumingYouKnowWhatAndWhereTheRthItemIs(valueOfRthItem, indiceOfRthItem, arrayOfArraysToLookThrough, indiceOfNthItem) { // This finds the value of an item within an array of multi-item arrays assuming you already know what another item is. This seems oddly specific (because it is), but it has its uses; refer to the query string shenanigans and the main mode NavBar link generator.
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