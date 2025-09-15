// Initialize project search.
var projectElementList = Array.from(document.getElementsByClassName("projectListing"));

function SearchForProjects() { // This code is purely for reference. Since we're gonna do something that isn't just an unordered list of hyperlinks, you should change this wen you figure out what you wanna do. 
    var inputElement = document.getElementById("ProjectsSearchBar");
    var filteredValue = inputElement.value.toUpperCase();

    // Loop through all projects, and hide those that do not match our search query.
    for (i = 0; i < projectElementList.length; i++) {
        // Get the title, make uppercase, check it, and then hide if it is not what we need.
        var projectName = projectElementList[i].getElementsByClassName("projectTitleText")[0].innerHTML;
        if (projectName.toUpperCase().indexOf(filteredValue) > -1){
            projectElementList[i].style.display = "inline-block";
            // You should make sure that this is the same value as the CSS file.
        } else {
            projectElementList[i].style.display = "none";
        }
    }

}