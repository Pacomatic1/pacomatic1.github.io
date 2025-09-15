// Initialize project search.
var projectElementList = Array.from(document.getElementsByClassName("projectListing"));

function SearchForProjects() { // This code is purely for reference. Since we're gonna do something that isn't just an unordered list of hyperlinks, you should change this wen you figure out what you wanna do. 
    var inputElement = document.getElementById("ProjectsSearchBar");
    var filteredValue = inputElement.value.toUpperCase();
    
    // Loop through all projects, and hide those that do not match our search query.
    for (i = 0; i < projectElementList.length; i++) {
        // Get the title, make uppercase, check it.
        var projectName = projectElementList[i].getElementsByClassName("projectTitleText")[0].innerHTML;
        console.log(projectName);
        // if (a.innerHTML.toUpperCase().indexOf(filter) > -1){
        //     li[i].style.display = "";
        // } else {
        //     li[i].style.display = "none";
        // }
    }

    console.log(projectElementList);






    // Declare variables
    // var input, filter, ul, li, a, i;
    // input = document.getElementById("ProjectsSearchBar");
    // filter = input.value.toUpperCase();
    // ul = document.getElementById("ProjMenu");
    // li = ul.getElementsByTagName("li");
    // // Loop through all list items, and hide those who don't match the search query
    // for (i = 0; i < li.length; i++) {
    //     a = li[i].getElementsByTagName("a")[0];
    //     if (a.innerHTML.toUpperCase().indexOf(filter) > -1){
    //         li[i].style.display = "";
    //     } else {
    //         li[i].style.display = "none";
    //     }
    // }
}