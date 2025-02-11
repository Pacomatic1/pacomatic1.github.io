function eventListener(event) {
    if (event.data === "startInit") {
		childPageInit();
	}
}




function addCssToChildPage() {
	var cssLink = document.createElement("link");
	cssLink.href = "iframe_styling.css"; 
	cssLink.rel = "stylesheet"; 
	cssLink.type = "text/css";
	document.head.appendChild(cssLink);	
}



function childPageInit() {
	addCssToChildPage();


}

// This is what happens when it's loaded. Keep in mind, this isn't supposed to happen instantly; it should instead wait for the event to begin initialization to happen.
window.addEventListener("message", eventListener, false);