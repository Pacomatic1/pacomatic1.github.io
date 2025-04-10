// This is a helper script, used on every single iframe (unless they're non-compliant or something).

window.onmessage = function(e) { onParentSendingMessageToIframe(e.data); };



function onParentSendingMessageToIframe(message) {
    switch(message) {
        case "sendHref":
            sendMessageToParent(window.location.href);
            break;


        // If it's not one of these, it's most likely meant for the actual site and not this script. As such, NO ERRORS!
    }


    
}



function sendMessageToParent(message) {
    parent.postMessage(message, "*");
}