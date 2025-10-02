// Find all files needed, while making sure to read them with the correct encoding.
// Run all the posts through asciidoctor.

// Use post_base.html, and have them get injected into there. Keep in mind that post_base.html also has some important stuff around dates and titles, so don't forget those.
// Put the results of each post in index.html, and put them in the same folder that their AsciiDoc file is located.
// Then, once every post is complete, put everything into the main base.html.



// Using this is done through assciidoctor.convert(content: string).
import * as asciidoctor from "asciidoctor";
import * as fs from 'node:fs';


console.log("Ramblings: Started");

// Find files
var homePagePath = "./base.html";
var postFolderPath = "./posts/";

// postFolders will, if unmodified, return files too. We do not want this. As such, we gotta get rid of everything that isn't a folder.
var postFolders = [];
for (const index in fs.readdirSync(postFolderPath, {withFileTypes: true})) {
    var list = fs.readdirSync(postFolderPath, {withFileTypes: true});    
    if ( list[index].isDirectory() ) {
        postFolders.push(list[index]);
    }
}

// Generate posts, and make an event listener for every post you generate. Store these event listeners in an array, so that we can start doing the home page after all of them are done.
for (const index in postFolders) {
    var actualPath = postFolders[index].path + postFolders[index].name + "/" 
    generatePost(actualPath);

}





async function generatePost(postFolderPath) {
    // First, we find all files.
    // Remove only the files we'll generate. index.html and whatnot.
    // Next, do the thing. you know, run post.adoc through asciidoctor, stuff that in base_template.html.
    // Use JSDoc for handling titles, dates, and post-proessing.
    // Place the item and its relevant data in the array of all the posts. make sure the date of the post as added alongside the post.

    var fileDirEntryList = fs.readdirSync(postFolderPath, {withFileTypes: true});
    var fileNameList = fs.readdirSync(postFolderPath, {withFileTypes: false});
    for (const index in fileDirEntryList) {
        
    }
}








console.log("Ramblings: Done");