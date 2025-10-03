// Find all files needed, while making sure to read them with the correct encoding.
// Run all the posts through asciidoctor.

// Use post_base.html, and have them get injected into there. Keep in mind that post_base.html also has some important stuff around dates and titles, so don't forget those.
// Put the results of each post in index.html, and put them in the same folder that their AsciiDoc file is located.
// Then, once every post is complete, put everything into the main base.html.



// Using this is done through assciidoctor.convert(content: string).
const Asciidoctor = require('asciidoctor');
asciidoctor = Asciidoctor();
const fs = require('node:fs');
const languageEncoding = require("detect-file-encoding-and-language");


console.log("Ramblings: Started");

var generatedFilesWithinAPostToDelete = ['index.html']; // Array of file names, stored as strings. If a posts folder has any of these, the file will be deleted. this is intended to be used with generated files.

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





console.log("Ramblings: Done");



async function generatePost(postFolderPath) {
    // First, we find all files.
    // Remove only the files we'll generate. index.html and whatnot.
    // Next, do the thing. you know, run post.adoc through asciidoctor, stuff that in base_template.html.
    // Use JSDoc for handling titles, dates, and post-proessing.
    // Place the item and its relevant data in the array of all the posts. make sure the date of the post as added alongside the post.

    var fileDirEntryList = fs.readdirSync(postFolderPath, {withFileTypes: true});
    for (const index in fileDirEntryList) {
        var currentEntry = fileDirEntryList[index];
        var currentEntryPath = fileDirEntryList[index].parentPath + fileDirEntryList[index].name;

        if ( generatedFilesWithinAPostToDelete.includes(currentEntry.name) ) { fs.rmSync(currentEntryPath); }
        if (currentEntry.name == 'post.adoc') {
            // Get the encoding.
            var fileEncoding = await languageEncoding(currentEntryPath); // This returns JS Object, but what we just want is fileEncoding.encoding.


            console.log(asciidoctor.convert( fs.readFileSync(currentEntryPath, { encoding: fileEncoding.encoding }) ));



        }
    }
}
