addMandatoryBitsToChildPage();



function addMandatoryBitsToChildPage() {
	// Add CSS stylesheet via link tag.
	// I could have each page manually link it but any and all common code should ideally be offloaded to this script, the parent page, and the stylesheet that this script is appending.
	var cssLink = document.createElement("link");
	cssLink.href = "iframe_styling.css"; 
	cssLink.rel = "stylesheet"; 
	cssLink.type = "text/css";
	document.head.appendChild(cssLink);



}