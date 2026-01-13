// Find all files needed, while making sure to read them with the correct encoding.
// Run all the posts through asciidoctor.

// Use post_base.html, and have them get injected into there. Keep in mind that post_base.html also has some important stuff around dates and titles, so don't forget those.
// Put the results of each post in index.html, and put them in the same folder that their AsciiDoc file is located.
// Then, once every post is complete, put everything into the main base.html.



// Using this is done through assciidoctor.convert(content: string).
import * as fs from 'node:fs';
import * as path from 'node:path';

import { marked } from 'marked';


// import * as jsdom from "jsdom";
import { JSDOM } from "jsdom";

import xml2js from 'xml2js';
// const { xml2js } = xml2js;


console.log("Ramblings: Started");

var generatedFilesWithinAPostToDelete = ['index.html']; // Array of file names, stored as strings. If a posts folder has any of these, the file will be deleted. this is intended to be used with generated files. be very careful with this, mm'kay?

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
// Generate everything, and make an event listener for every post you generate. Store these event listeners in an array, so that we can start doing the home page after all of them are done.
var postGenerationPromises = [];

for (const index in postFolders) {
    var actualPath = postFolders[index].parentPath + postFolders[index].name + "/" 
    postGenerationPromises.push( generatePost(actualPath) );
}

// console.log("Ramblings: Done"); // You gotta mod this such that it waits for everything to be done first.



async function generatePost(postFolderPath) {
    // First, we find all files.
    // Remove only the files that get generated. index.html and whatnot.
    // Next, pre-process; deal with custom tags and such.
    // Next, do the thing. you know, run post.md through marked, stuff that in base_template.html.
    // Use JSDoc for some extras.
    // Place the item and its relevant data in the array of all the posts. Make sure the date of the post as added alongside the post.


    // var postFailedPromise = new Promise()
    var fileDirEntryList = fs.readdirSync(postFolderPath, {withFileTypes: true});
    for (const index in fileDirEntryList) {
        var currentEntry = fileDirEntryList[index];
        var currentEntryPath = currentEntry.parentPath + currentEntry.name;

        // Don't add an if for post.json, that's handled with the adoc.
        if ( generatedFilesWithinAPostToDelete.includes(currentEntry.name) ) { fs.rmSync(currentEntryPath); }
        if ( currentEntry.name == 'post.md') {
            // File loading
            var basePostPath = currentEntry.parentPath + "../post_base.html";
            var compiledPostPath = currentEntry.parentPath + "index.html";

            var basePostAsString = fs.readFileSync( basePostPath, { encoding: 'utf8' })
            var postJSON = JSON.parse( fs.readFileSync(currentEntry.parentPath + "post.json", { encoding: 'utf8' }) );

            // Post data? Metadata? Title Data? What do we call this, exactly?
            var postTitle = postJSON.postTitle;
            var postVersion = postJSON.postVersion;
            var postPublishDate = new Date(postJSON.postPublishDate);
            var postLastUpdate = new Date(postJSON.postLastUpdate);
            var postSubtitle = postJSON.postSubtitle;

            var postPublishMonthName = convertMonthNumberToYear(postPublishDate.getMonth(), true);
            var postLastUpdateMonthName = convertMonthNumberToYear(postLastUpdate.getMonth(), true);

            var postDetailsLine = `v${postVersion}; Published ${postPublishMonthName} ${postPublishDate.getDay()}, ${postPublishDate.getFullYear()}; Last Updated ${postLastUpdateMonthName} ${postLastUpdate.getDay()}, ${postLastUpdate.getFullYear()};`;

            var markdownFileAsString = fs.readFileSync(currentEntryPath, { encoding: 'utf8' }); 
            const markdownFileLineByLine = () => { var arr = markdownFileAsString.split('\n'); arr.unshift(''); return arr; }; // This is to make reading easier. I find this to be nicer than a standard variable, since you don't have to synchronize it all the time. This array's indices are synchronized with the line numbers, so content actually starts at [1]. [0] can be considered undefined behaviour or something. This also means that, If you want the total linecount, you can use 'markdownFileLineByLine.length - 1'.


            // Pre-processing.

            // wow, such empty
            


            // Compiling the markdown.
            marked.use({
                gfm: true,
                breaks: true,
            });

            var compiledMarkdown = marked.parse(markdownFileAsString);


            // <wavy> tags
            
            // TODO: An instance of  "</span></wavy>" is broken, as this line does not  do it correctly and turns it into "</span</span" and not "</span></span>". I likely did something wrong in this very spot.
            // for some god forsaken reason, the [^\\] is causing the bug. Why, exactly? No clue.
            compiledMarkdown = replaceAllTagEndersOfType(compiledMarkdown, "wavy", "</span>"); // <wavy> tags get replaced by <span>, so we need to swap all the <wavy> enders with <span> enders. We also make sure to exclude anything with a backslash in or before it, because that means they were escaped, and we have to respect that. I ♥️ regular expressions
                        

            var wavyTagSubStrings = getAllContentsOfTags("wavy", markdownFileAsString);
            var startingIndicesOfWavyTags = getStartingIndicesOfTags("wavy", markdownFileAsString);
            var replacedWavyTagSubstrings = [];

            for (let i = 0; i < wavyTagSubStrings.length; i++) {
                // First, we want to grab all the attributes we seek.
                var currentTagTimeProperty = await getAttributeValueFromTagSubstring(wavyTagSubStrings[i], "time");
                if ( currentTagTimeProperty == null) { currentTagTimeProperty = "1s"; }
                
                var currentTagDistanceProperty = await getAttributeValueFromTagSubstring(wavyTagSubStrings[i], "distance");
                if ( currentTagDistanceProperty == null) { currentTagDistanceProperty = "0"; }
                
                // currentTagDistanceProperty = "null"; // THIS IS FOR TESTING. KILL LATER.


                var stringToAddToReplaceArray = `<span class="wavyText" style=" --distance: ${currentTagDistanceProperty}; --time: ${currentTagTimeProperty};">`;

                replacedWavyTagSubstrings.push(stringToAddToReplaceArray);
            }
            
            // console.log(startingIndicesOfWavyTags);
            // console.log(wavyTagSubStrings);
            // console.log(replacedWavyTagSubstrings);

            // error check.
            // These had all BETTER be the same length!
            if ( !(wavyTagSubStrings.length == startingIndicesOfWavyTags.length && startingIndicesOfWavyTags.length == replacedWavyTagSubstrings.length) ) {
                console.log(`For some reason, the length of wavyTagSubStrings, startingIndicesOfWavyTags, and replacedWavyTagSubstrings are not all equal. This is bad. Fix it now.\nwavyTagSubStrings: ${wavyTagSubStrings}\nstartingIndicesOfWavyTags: ${startingIndicesOfWavyTags}\nreplacedWavyTagSubstrings: ${replacedWavyTagSubstrings}`);
            }


            // startingIndicesOfWavyTags includes our starting and ending arrows. HOW CONVENIENT!!!
            // We will use this to aid in our replacement, and we will also make sure to make use of those starting indices so as to avoid friendly fire.
            for (let i = replacedWavyTagSubstrings.length - 1; i > 0; i--) { // We go backwards, as going forwards means recalculating indices over and over (waste of time, both for the programmer and the computer)
                compiledMarkdown = replaceFirstSubstringInStringAfterACertainPoint(compiledMarkdown, wavyTagSubStrings[i], replacedWavyTagSubstrings[i], startingIndicesOfWavyTags[i]);
            }

            // console.log(compiledMarkdown);

            // HTML Injection.
            var compiledPost;
            compiledPost = basePostAsString.replace("NODEJS-UNIQUENESS-86348753276982273", compiledMarkdown);
            compiledPost = compiledPost.replace("NODEJS-UNIQUENESS-65327128234", postTitle);
            compiledPost = compiledPost.replace("NODEJS-UNIQUENESS-5328746329847021", postDetailsLine);
            compiledPost = compiledPost.replace("NODEJS-UNIQUENESS-981273873264", postSubtitle);


            // Post processing.
            var postProcessingDOM = new JSDOM(compiledPost, {
                url: "file://" + path.resolve(compiledPostPath),
                contentType: "text/html",
                includeNodeLocations: true,
                storageQuota: 10000000
            });


            // Links that end with an exclamation mark will be opened in a new tab.
            var linkTags = postProcessingDOM.window.document.querySelectorAll('a');
            for (let i = 0; i < linkTags.length; i++) {
                if (linkTags[i].href.endsWith('!') || linkTags[i].href.endsWith('!/')) {
                    var sliceAmount = 0;
                    if (linkTags[i].href.endsWith('!')) {sliceAmount = 1};
                    if (linkTags[i].href.endsWith('!/')) {sliceAmount = 2};

                    linkTags[i].target = "_blank";
                    linkTags[i].href = linkTags[i].href.substring(0, linkTags[i].href.length - sliceAmount);
                }
            }

            // Make all images load using async.
            var imageTags = postProcessingDOM.window.document.querySelectorAll('img');
            for (let i = 0; i < imageTags.length; i++) { 
                // They only load when they're on-screen, and they don't lag you when they decode (since there's a million of 'em)
                imageTags[i].loading = "lazy";
                imageTags[i].decoding = "async";
            }
            

            compiledPost = postProcessingDOM.serialize();
            
            console.log("------------------------------------------");


            // WE ADRE CURRENTLY USING THE MARKDOWN AND NOT THE ACTUAL POST. BE CAREFUL!!!!!!!!!!!
            // SWAP ARG 2 WITH compiledPost!!!

            // When all is said and done, our generated file shall be written.
            fs.writeFile(compiledPostPath, compiledMarkdown, (err) => {
                if (err == null) {
                    console.log(`Ramblings: Wrote post "${postTitle}" successfully!`)
                } else {
                    console.log(`Ramlbings: There was a problem trying to write "${postTitle}". It is, "${err}".`)
                }
            });

            // return 0;
        }
    }
}



// TODO: Indices on splitting the string are broken!




/** Suppose we have a string. We want to replace a substring within it, but there are multiple instances of the substring! Well, that's where this function comes in handy; we can specify an indice for where to start looking, with the first (and only the first!) instance of the substring being replaced. */
function replaceFirstSubstringInStringAfterACertainPoint(stringToModify, substringToReplace, stringYouAreReplacingItWIth, indiceOfWhereToStartLooking) { 
        //     Cut the string into two pieces, at our index.
        //     Replace the thing.
        //     Merge the strings back together.
        
        var stringHalves = splitStringAtIndex( stringToModify, indiceOfWhereToStartLooking );
        console.log( stringToModify.charAt(indiceOfWhereToStartLooking) )
        console.log(stringHalves)
        stringHalves[1] = stringHalves[1].replace( substringToReplace, stringYouAreReplacingItWIth);
        return stringHalves[0] + stringHalves[1];
}


/** Replaces tag enders of the specified name with a string of your choosing. If you want all "\</wavy>"s to be replaced with "\</span>", you'd use arguments (blahblahblah, "wavy", "\</span>"). */
function replaceAllTagEndersOfType(stringToReplaceTagEndersIn, tagName, stringToReplaceItWith) {
    // Normally I would use the regex on its own, but the regex seems to capture one character before it; removing the "no \" clause fixes this, but I cannot remove that. I don't know why the regex team did this, but fine, whatever, I will fix that myself.
    // If I ever find a regex that does NOT do this, I will replace the whole function with that.
    var regexToUse = new RegExp(String.raw`[^\\]<\/${tagName}\s*>`, "g");
    var allInstancesOfTagEnder = Array.from( stringToReplaceTagEndersIn.matchAll(regexToUse) );
    
    var allInstancesOfCorrectedTagEnder = []; // array of js objects; see the for loop below for syntax

    for (let i = 0; i < allInstancesOfTagEnder.length; i++) {
        allInstancesOfCorrectedTagEnder.unshift({ // Yes, I used unshift(). Yes, they are now backwards (final instance to first instance). This is 100% intentional. I could form the array normally and then use reverse() but this seems simpler.
            stringToReplace: allInstancesOfTagEnder[i][0].substring(1),
            capturedIndex: allInstancesOfTagEnder[i]["index"] + 1
        });
    }

    // We are now going to replace every single instance of the thingies in allInstancesOfCorrectedTagEnder. To avoid many issues, we will be working backwards.

    var replacedString = stringToReplaceTagEndersIn;
    for (let i = 0; i < allInstancesOfCorrectedTagEnder.length; i++) { // I am going forwards through the array, because the array is already last-to-first.
        // allInstancesOfCorrectedTagEnder[i] = { stringToReplace: string, capturedIndex: int }
        replacedString = replaceFirstSubstringInStringAfterACertainPoint(replacedString, allInstancesOfCorrectedTagEnder[i].stringToReplace, stringToReplaceItWith, allInstancesOfCorrectedTagEnder[i].capturedIndex);
    }

    return replacedString;
}

/** Splits a string in two, at the given index. Returns an array of both halves of the string. */
function splitStringAtIndex(stringToSplit, index) {
    // Little problem: Each newline actually counts as 3 characters, which goes against every single "find indice" function ever. I don't know why.
    // This means that, when we are doing our index stuff, the spot where it's split is far behind where we're supposed to split it.
    
    // Using an actual newline actually removes the need for handling backslashes ourselves! How convenient!
    var newLineRegex = new RegExp(String.raw`\n`, "g");
    var newLineArrayHelper = [ ...stringToSplit.matchAll(newLineRegex) ];
    
    // console.log(newLineArrayHelper)

    // The index we're given aligns with whatever indexes we use inside newLineArrayHelper.
    // So, we can iterate through each entry until the array's index is greater than our given index. Then we move it backwards one because we are currently on the first newline AFTER the given index.
    var newLineArrayHelperTextIndex = 0;
    var newLineArrayHelperArrayIndex = 0;
    loop: for (let i = 0; i < newLineArrayHelper.length; i++) {
        if (newLineArrayHelper[i].index >= index) { // More than/equal to, because equal to would mean that the index is at the very end of a line; that'd make the newline come right AFTER it.
            newLineArrayHelperTextIndex = newLineArrayHelper[i].index;
            newLineArrayHelperArrayIndex = i;
            break loop;
        }
    }

    var newLineCount = newLineArrayHelperArrayIndex;

    index = index + (3 * newLineCount);

    return [ stringToSplit.substring(0, index), stringToSplit.substring(index, stringToSplit.length) ];
}

/**  Give it the substring of a tag, including the name, and give it the name of an attribute. If the desired attribute exists, we'll return its contents. If it does not, we return null. */
async function getAttributeValueFromTagSubstring(substring, attributeName) {
    // First, we handle the cases in which the tag does not have the ending or starting arrows.
    if ( !substring.endsWith(">") ) { substring = substring + ">"; }
    if ( !substring.startsWith("<") ) { substring = "<" + substring; }
    
    // We use xml2js under the hood, but xml2js demands that all tags end properly (eg. "<b>" is not allowed, but "<b></b>" is fine.)
        
    // So, we find the tag's name. Find the index of the first whitespace or ending arrow; everything between it and the starting arrow (which is guaranteed to be substring[1]) is the tag's name.

    // But wait! What if there is whitespace between the starting arrow and the  
    var substringForTagFind = substring.substring(1);
    substringForTagFind = substringForTagFind.trimStart();
    // Yes, this stuff changed the indices such that the indices for the tag name are now different.
    // But, that is fine, because we are going to be pulling from substringForTagFind, whose indices align with our found indices. Once we have that, we pull the tag name, and then forget the variable ever existed.
    var tagNameEndingIndice = substringForTagFind.indexOf(" ");
    if ( tagNameEndingIndice == -1 ) { tagNameEndingIndice = substringForTagFind.indexOf(">"); }
    
    var tagName = substringForTagFind.substring(0, tagNameEndingIndice);

    var tagAttributes;
    await xml2js.parseString(substring + `</${tagName}>`, function(err, result) {
        tagAttributes = result;
    });

    // Gotta do some if statements in the event the attribute does not exist.
    if ( Object.hasOwn(tagAttributes[tagName], "$") ) {
        if ( Object.hasOwn(tagAttributes[tagName]["$"], attributeName) ) {
            return tagAttributes[tagName]["$"][attributeName];
        }
    } else { return null; }
}



/*
TODO: Modify the "stop searching for string" trigger. As is stands, it looks for ">", but what happens if that's part of an attribute, like in CSS or something?
So, get on that sometime.
*/

// https://frontendinterviewquestions.medium.com/how-to-replace-html-tags-from-string-in-javascript-c86e40936eb0

/** Returns an array of strings, containing the insides of the tags. Includes the both the opening and closing arrows, but those should be easy to remove if need be. */
function getAllContentsOfTags(tagName, stringToSearchIn) { 
    var startingIndicesOfSearchTags = getStartingIndicesOfTags(tagName, stringToSearchIn);
    if (startingIndicesOfSearchTags.length > 0) { // startingIndicesOfSearchTags is quite odd, and not just a regular number array lke we want it to be. First, we change that.
        // Get the ending indices of these wavy tags; these ending indices are going to the indices of the > characters.
        var endingIndicesOfSearchTags = [];
        for (let i = 0; i < startingIndicesOfSearchTags.length; i++) {
            endingIndicesOfSearchTags.push( stringToSearchIn.indexOf( ">", startingIndicesOfSearchTags[i]) )
        }
        
        // Get the contents of the tags into a bunch of strings, and figure out what it is we need to replace from there.
        var searchTagSubStrings = [];
        for (let i = 0; i < startingIndicesOfSearchTags.length; i++) {
            searchTagSubStrings.push( stringToSearchIn.substring(startingIndicesOfSearchTags[i], endingIndicesOfSearchTags[i]) + ">" ); // This pushes them *without* the ending arrows, so we add those in real quick.
        }

        return searchTagSubStrings;
    } else { return []; }
}

// TODO: Avoid a capture if it has a backslash at any point in it.
/** Gets the starting indices of all tags of a specified type; this is the indice of the starting arrow "<", by the way. */
function getStartingIndicesOfTags(tagName, stringToSearchIn) {
    var startingIndicesOfSearchTags = [...stringToSearchIn.matchAll( new RegExp(String.raw`<\s*${tagName}\s*`, "gi") )];

    // console.log(startingIndicesOfSearchTags)

    if (startingIndicesOfSearchTags.length > 0) { 
        let finalArray = [];
        for (let i = 0; i < startingIndicesOfSearchTags.length; i++) {
            finalArray.push(startingIndicesOfSearchTags[i].index);
        }
        return finalArray; // This variable contains the index of the < character.
    } else { return []; }
}

function getLineNumFromCharIndexOfString(text, index) {
    let line = 1;
    for (let i = 0; i < index; i++) {
        if (text[i] === '\n') { line++; }
    }
    return line;
} // https://stackoverflow.com/a/76855467

/** NOTICE: This is zero-indexed; January is 0, February is 1, March is 2, etc. This is to follow the conventions of the Date() API. Also note that this is a language thing, so if you ever localize the blog, you'll be forced to translate the function.*/
function convertMonthNumberToYear(month, useThreeLetterVersion = false) {
    var monthName;
    switch(month) {
        case 0:
            if (useThreeLetterVersion) { monthName = "Jan"; }
            else { monthName = "January"; }
            break;
        case 1:
            if (useThreeLetterVersion) { monthName = "Oct"; }
            else { monthName = "October"; }
            break;
        case 2:
            if (useThreeLetterVersion) { monthName = "Mar"; }
            else { monthName = "March"; }
            break;
        case 3:
            if (useThreeLetterVersion) { monthName = "Apr"; }
            else { monthName = "April"; }
            break;
        case 4:
            if (useThreeLetterVersion) { monthName = "May"; }
            else { monthName = "May"; }
            break;
        case 5:
            if (useThreeLetterVersion) { monthName = "Jun"; }
            else { monthName = "June"; }
            break;
        case 6:
            if (useThreeLetterVersion) { monthName = "Jul"; }
            else { monthName = "July"; }
            break;
        case 7:
            if (useThreeLetterVersion) { monthName = "Aug"; }
            else { monthName = "August"; }
            break;
        case 8:
            if (useThreeLetterVersion) { monthName = "Sep"; }
            else { monthName = "September"; }
            break;
        case 9:
            if (useThreeLetterVersion) { monthName = "Oct"; }
            else { monthName = "Oct"; }
            break;
        case 10:
            if (useThreeLetterVersion) { monthName = "Nov"; }
            else { monthName = "November"; }
            break;
        case 11:
            if (useThreeLetterVersion) { monthName = "Dec"; }
            else { monthName = "December"; }
            break;
        default:
            console.log("Invalid month!");
            monthName = "なんだこれ????";
            break;
    }
    return monthName;
	// Bro is not Toby Fox :wilted_rose:
}

