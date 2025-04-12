// This is a helper script, used on every single iframe (unless they're non-compliant or something, which you should defenitely fix).
window.onmessage = function(e) { onParentSendingMessageToIframe(e.data); };



function onParentSendingMessageToIframe(message) {
    switch(message) {
        case "sendHref":
            sendMessageToParent(window.location.href);
            break;


        // If it's not one of these, it's most likely meant for the actual site and not this script. As such, NO ERRORS!
    }


    
}




function sendMessageToParent(message, parentOrigin) { // If parentOrigin is empty, it will be sent, no matter who the parent is. 
    if (parentOrigin == null) { parentOrigin = "*"}
    parent.postMessage(message, parentOrigin);
}