addCssToChildPage();
setAllImgTagsToUseAsyncDecoding();

function addCssToChildPage() {
	var cssLink = document.createElement("link");
	cssLink.href = "iframe_styling.css"; 
	cssLink.rel = "stylesheet"; 
	cssLink.type = "text/css";
	document.head.appendChild(cssLink);	
}

function setAllImgTagsToUseAsyncDecoding() {
	



}