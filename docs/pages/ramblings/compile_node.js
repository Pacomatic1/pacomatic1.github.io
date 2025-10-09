// Find all files needed, while making sure to read them with the correct encoding.
// Run all the posts through asciidoctor.

// Use post_base.html, and have them get injected into there. Keep in mind that post_base.html also has some important stuff around dates and titles, so don't forget those.
// Put the results of each post in index.html, and put them in the same folder that their AsciiDoc file is located.
// Then, once every post is complete, put everything into the main base.html.



// Using this is done through assciidoctor.convert(content: string).
const fs = require('node:fs');

const Asciidoctor = require('asciidoctor');
const asciidoctor = Asciidoctor();

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
        var currentEntryPath = currentEntry.parentPath + currentEntry.name;

        // Don't add an if for post.json, that's handled with the adoc.
        if ( generatedFilesWithinAPostToDelete.includes(currentEntry.name) ) { fs.rmSync(currentEntryPath); }
        if ( currentEntry.name == 'post.adoc') {
            var postJSON = JSON.parse( fs.readFileSync(currentEntry.parentPath + "post.json", { encoding: 'utf8' }) );

            var postTitle = postJSON.postTitle;
            var postVersion = postJSON.postVersion;
            var postPublishDate = new Date(postJSON.postPublishDate);
            var postLastUpdate = new Date(postJSON.postLastUpdate);
            var postSubtitle = postJSON.postSubtitle;

            var asciiDocFileAsString = fs.readFileSync(currentEntryPath, { encoding: 'utf8' }); 
            const asciiDocFileLineByLine = () => { var arr = asciiDocFileAsString.split('\n'); arr.unshift(''); return arr; }; // This is to make reading easier. I find this to be nicer than a standard variable, since you don't have to synchronize it all the time. This array's indeices are synchronized with the line numbers, so the content actually starts at [1].


            // Now, we must modify certain sections of the AsciiDoc file.            
            var compiledAsciiDoc = asciidoctor.convert(asciiDocFileAsString);
        }
    }
}



function getLineNumFromCharIndexOfString(text, index) {
    let line = 1;
    for (let i = 0; i < index; i++) {
        if (text[i] === '\n') { line++; }
    }
    return line;
} // https://stackoverflow.com/a/76855467