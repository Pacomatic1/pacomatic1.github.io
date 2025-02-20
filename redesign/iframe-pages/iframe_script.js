// This is kept in the same spot as the iframe-pages in order to simplify the <script> link, since that's done manually (and I want to reduce the amount of things done manually by as much as possible).
addMandatoryBitsToChildPage();



function addMandatoryBitsToChildPage() {
	// Add CSS stylesheet via link tag.
	// I could have each page manually link it but any and all common code should ideally be offloaded to this script, the parent page, and the stylesheet that this script is appending.
	var cssLink = document.createElement("link");
	cssLink.href = "./resources/iframe_styling.css"; 
	cssLink.rel = "stylesheet"; 
	cssLink.type = "text/css";
	document.head.appendChild(cssLink);

	// iframe-resizer's child script is added in order to avoid a scrollbar for the childPage.
	var iframeResizerChildLink = document.createElement("script");
	iframeResizerChildLink.src = "./resources/iframe-resizer-child.js"; 
	document.head.appendChild(iframeResizerChildLink);
	

}