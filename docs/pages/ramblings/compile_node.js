// Find all files needed, while making sure to read them with the correct encoding.
// Run all the posts through asciidoctor.

// Use post_base.html, and have them get injected into there. Keep in mind that post_base.html also has some important stuff around dates and titles, so don't forget those.
// Put the results of each post in index.html, and put them in the same folder that their AsciiDoc file is located.
// Then, once every post is complete, put everything into the main base.html.





const Asciidoctor = require('asciidoctor');
const asciidoctor = Asciidoctor();     // Using this is done through assciidoctor.convert(content: string).
const fs = require("node:fs");


console.log("Ramblings: Started");

// Find files
var homePagePath = "./base.html";
var postFolderPath = "./posts/"
var postPaths = [];

// postFolders will, if unmodified, return files too. We do not want this. As such, we gotta get rid of 'em.
var postFolders = fs.readdirSync(postFolderPath, {withFileTypes: true});
var postFoldersTempArray = [];
for (const index in postFolders) {    
    if ( postFolders[index].isDirectory() ) {
        postFoldersTempArray.push(postFolders[index]);
    }
}
postFolders = postFoldersTempArray;
























console.log("Ramblings: Done");