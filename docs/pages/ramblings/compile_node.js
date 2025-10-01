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
var postFolderPath = "./posts/"
var postPaths = [];

// postFolders will, if unmodified, return files too. We do not want this. As such, we gotta get rid of everything that isn't a folder.
var postFolders = fs.readdirSync(postFolderPath, {withFileTypes: true});
var postFoldersTempArray = [];
for (const index in postFolders) {    
    if ( postFolders[index].isDirectory() ) {
        postFoldersTempArray.push(postFolders[index]);
    }
}
postFolders = postFoldersTempArray;


await toString();
console.log("AUSHSUH")

async function toString() {
    console.log("sijsi")
}

















console.log("Ramblings: Done");