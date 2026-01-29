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
    var actualPath = postFolders[index].parentPath + postFolders[index].name + "/";
    // postGenerationPromises.push( generatePost(actualPath) );

    await generatePost(actualPath);
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
            // File loading --------------------------------
            var basePostPath = currentEntry.parentPath + "../post_base.html";
            var compiledPostPath = currentEntry.parentPath + "index.html";

            var basePostAsString = fs.readFileSync( basePostPath, { encoding: 'utf8' })
            var postJSON = JSON.parse( fs.readFileSync(currentEntry.parentPath + "post.json", { encoding: 'utf8' }) );

            // Post data? Metadata? Title Data? What do we call this, exactly? -----------------------------------
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


            // Pre-processing ------------------------

            // wow, such empty
            


            // Compiling the markdown.
            marked.use({
                gfm: true,
                breaks: true,
            });

            var compiledMarkdown = marked.parse(markdownFileAsString);
            


            console.log(compiledMarkdown);



            // We are going to march through the string.
            
            // First, we are going to store any persistent variables.



            compiledMarkdown = perTagHTMLParser(compiledMarkdown, {
                forEveryTagWeHit: function (tagSubstring, index) {
                    if (tagSubstring.startsWith("<wavy")) {
                        var currentTagTimeProperty = getAttributeValueFromTagSubstring(tagSubstring, "time");
                        if ( currentTagTimeProperty == null) { currentTagTimeProperty = "1s"; }
                        
                        var currentTagDistanceProperty = getAttributeValueFromTagSubstring(tagSubstring, "distance");
                        if ( currentTagDistanceProperty == null) { currentTagDistanceProperty = "0"; }

                    }


                    return null;
                },
                forEveryTagEnderWeHit: function (tagSubstring, index) {
                    if ( tagSubstring.includes("wavy") ) {
                        return "</span>"
                    } else { return null; }
                }
            });


/*
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
*/

            // console.log(compiledMarkdown);

            // HTML Injection. ------------------------------
            var compiledPost;
            compiledPost = basePostAsString.replace("NODEJS-UNIQUENESS-86348753276982273", compiledMarkdown);
            compiledPost = compiledPost.replace("NODEJS-UNIQUENESS-65327128234", postTitle);
            compiledPost = compiledPost.replace("NODEJS-UNIQUENESS-5328746329847021", postDetailsLine);
            compiledPost = compiledPost.replace("NODEJS-UNIQUENESS-981273873264", postSubtitle);


            // Post processing. -------------------------------
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




// TODO: find a way to make getAttributeValueFromTagSubstring() synchronous.








/** Generic handler for marching through a markup string.
 * Run this function and it will march through your string. When we run through your string, we get to run a few functions along the way. These are contained in your JS Object containing the needed functions.
 * Note that this thing is blind to everything *outside* the tag. If you want to modify attributes *within* the tag, I'd recommend that you mix this with singleTagMarcher()
 * 
 * @param {string} stringToMarchThrough - The string you're marching through. It had BETTER be well-formed!
 * @param {json} functionsToRun - A JS Object containing some functions that will be run at specific points. Its contents are described above.
 * @param {function} functionsToRun.forEveryTagWeHit - Function with 5 parameters which I will detail below, and a return value being a string that replaces the tag that argument 1 gave you. Note that the function will then march right through your newly-replaced tag. If you don't want to have a function, do NOT define this as "null" or "undefined"; just don't define it. If you don't want to replace anything, return null.
 *  @param {string} functionsToRun.forEveryTagWeHit.param1 - This parameter contains only the tag (arrows included). number denoting the tag's starting index.
 *  @param {number} functionsToRun.forEveryTagWeHit.param2 - This parameter contains a number denoting the tag's starting index.
 *  @param {number[]} functionsToRun.forEveryTagWeHit.param3 - This parameter contains a JS Object. The structure is as follows: { startingIndicesOfAttributeNames: number[], endingIndicesOfAttributeNames: number[], startingIndicesOfAttributeQuotationMarks: number[],  endingIndicesOfAttributeQuotationMarks: number[] }. All the array indices are aligned; index 0 returns the relevant data for the first attribute, regardless of where you look. All the text indices are based on the tag substring from paramater 1.
 * 
 * @param {function} functionsToRun.forEveryTagEnderWeHit - Function with 2 args: string containing only the tag (arrows included), and a number denoting the tag's starting index. return value: the string that will replace the tag. Note that the function will then march right through your newly-replaced tag. If you don't want to have a function, do NOT define this as "null" or "undefined", don't define anything. If you don't want to replace anything, return null.
 * 
 */
function perTagHTMLParser(stringToMarchThrough, functionsToRun) {
    var isNextCharacterEscaped = false;

    var tagAttributeQuoteType = ""; // This is going to be hella confusing to read, but. " or ' mean that we're in an attribute, and an empty string means we're not.
    
    // The following 2 variables are meant to compliment each other; the same index always returns the relevant data for the same attribute.
    var tagAttributeQuoteStartingIndices = []; // Clear this every time you leave a tag.
    var tagAttributeQuoteEndingIndices = []; // Clear this every time you leave a tag.
    var tagAttributeNameStartingIndices = []; // Clear this every time you leave a tag.
    var tagAttributeNameEndingIndices = []; // Clear this every time you leave a tag.


    var currentlyInsideTag = false;
    var currentTagStartingIndex = -1; // -1 is our "null value". That said, you should be cross-checking this with currentlyInsideTag.
    var currentTagEndingIndex = -1; // -1 is our "null value". That said, you should be cross-checking this with currentlyInsideTag.

    // Fun and extremely vital fact: This does NOT cache the string's length; if we make the string longer, the for loop will abide without hesitation. 
    overallTextIterator: for (let i = 0; i < stringToMarchThrough.length; i++) {
        var currentChar = stringToMarchThrough.charAt(i);

        // First, deal with whether or not the character is escaped. Also keep in mind a "\\", in which case we just want to skip everything here because it's a normal backslash and is totally irrelevant.
        if ( isNextCharacterEscaped ) {
            isNextCharacterEscaped = false;
            continue overallTextIterator;
        }
        if ( !isNextCharacterEscaped && currentChar == "\\") {
            isNextCharacterEscaped = true;
            continue overallTextIterator;
        }
        // Assuming I did this right, we will never have to worry about escaped characters ever again :)
        // If I did it wrong... Well, we both know who's gonna be fixing it.
        
        // ...it'll be me. I'm the one who will be fixing it. I'm going to have to fix everything here.
        
        if (currentChar == "<" && tagAttributeQuoteType == "") { // So. We've hit one of them arrows and we aren't in an attribute? Well golly gosh, looks like a tag (ender) just started! {
            currentlyInsideTag = true;
            currentTagStartingIndex = i;
        }
        if ( currentlyInsideTag ) {
            
            if ( currentChar == "\"" || currentChar == "'" ) { // We have hit the beginning/end of a tag attribute.
                if ( tagAttributeQuoteType == "") { // If we do not already think we are inside an attribute, we have hit the beginning.
                    tagAttributeQuoteType = currentChar; // Say that we now inside of one.
                    tagAttributeQuoteStartingIndices.push(i);
                    continue overallTextIterator;
                }
                if ( tagAttributeQuoteType == currentChar) { // If we were inside an attribute earlier and hit the same ender, we have likely hit the end. Now, we'd best say so.
                    tagAttributeQuoteType = ""; // Say that we are done, because we have hit the end.
                    tagAttributeQuoteEndingIndices.push(i);
                    continue overallTextIterator;
                }

            }

            if (currentChar == ">" && tagAttributeQuoteType == "") { // We hit one of them arrows and we are not inside of an attribute? By golly, we must be at the end of the tag (ender)!
                currentlyInsideTag = false;
                currentTagEndingIndex = i;

                // Alright, time to handle our idiotic custom tag dealings.
                // We are going to do the replacement *during* the for loop, which also means modifying the for loop's iterator.
                var currentTagSubstring = stringToMarchThrough.slice(currentTagStartingIndex, currentTagEndingIndex + 1) ;
                var isTagEnder = false;

                console.log( currentTagSubstring );

                if (tagAttributeQuoteStartingIndices.length != tagAttributeQuoteEndingIndices.length) { console.log( `Error: The string marcher failed to correctly grab the starting and ending indices of an attribute! I think something's up. Here's the tag's substring, in case it's just malformed HTML: ${currentTagSubstring}` ); }


                // We'd like to modify tagAttributeQuoteStartingIndices and tagAttributeQuoteEndingIndices to be based on the tag on its own rather than the full string we were given. 
                for (let i = 0; i < tagAttributeQuoteStartingIndices.length; i++) {
                    // We will do both starting and ending indices here, which should not be a problem if the array's indices are aligned, WHICH THEY SHOULD BE.
                    tagAttributeQuoteStartingIndices[i] = tagAttributeQuoteStartingIndices[i] - currentTagStartingIndex;
                    tagAttributeQuoteEndingIndices[i] = tagAttributeQuoteEndingIndices[i] - currentTagStartingIndex;
                }

                if (currentTagSubstring.startsWith("</")) { isTagEnder = true; }
                var stringToReplaceCurrentTag = null; // If we do not need any replacement, this will be null.

                if (!isTagEnder && tagAttributeQuoteStartingIndices.length > 0) { // Tag enders don't have attributes. If they do, the markup is malformed, not my problem.
                    // We must find tagAttributeNameStartingIndices and tagAttributeNameEndingIndices.
                    // We will do this by marching through the tag, backwards. And yes, this means 2 mested string marchers.
                    

                    tagAttribLoop: for (let i = 0; i < tagAttributeQuoteStartingIndices.length; i++) { // For each item in the starting indice array,
                        // Variables for this mini-loop
                        var nameEndReached = false;
                        var nameStartReached = false;
                        var nameEqualsReached = false;
                        
                        tagSingleAttribLoop: for (let j = tagAttributeQuoteStartingIndices[i]; j > 0; j--) { // March backwards through the tag substring, starting at the index specified by startingIndices.
                            let currentCharInTagAttribLoop = currentTagSubstring.charAt(j);
                            if (currentCharInTagAttribLoop == "=") {
                                nameEqualsReached = true;
                                continue tagSingleAttribLoop;
                            }

                            if (nameEqualsReached && currentCharInTagAttribLoop != " " && !nameEndReached) { // We did it boys, we hit the name. No equals signs here, folks!
                                nameEndReached = true;
                                tagAttributeNameEndingIndices.push(j);
                                continue tagSingleAttribLoop;
                            }

                            if (nameEndReached && currentCharInTagAttribLoop == " " && !nameStartReached) { // We hi the whitespace right before the attribute name.
                                nameStartReached = true;
                                tagAttributeNameStartingIndices.push(j + 1); // We are the *whitespace*, not the actual start. To get the actual start, we need to go up by one.
                                break tagSingleAttribLoop;
                            }

                        }
                    }


                }

                if ( Object.hasOwn(functionsToRun, "forEveryTagWeHit") && !isTagEnder) {
                    stringToReplaceCurrentTag = functionsToRun.forEveryTagWeHit(currentTagSubstring, currentTagStartingIndex, {
                        startingIndicesOfAttributeNames: tagAttributeNameStartingIndices,
                        endingIndicesOfAttributeNames: tagAttributeNameEndingIndices,
                        startingIndicesOfAttributeQuotationMarks: tagAttributeQuoteStartingIndices,
                        endingIndicesOfAttributeQuotationMarks: tagAttributeQuoteEndingIndices
                    } );
                }
                if ( Object.hasOwn(functionsToRun, "forEveryTagEnderWeHit") && isTagEnder) {
                    stringToReplaceCurrentTag = functionsToRun.forEveryTagEnderWeHit(currentTagSubstring, currentTagStartingIndex);
                    console.log(stringToReplaceCurrentTag)
                }

                /* Debug. If these indice 0 of each array keeps ascending with every line, this was done correctly.
                console.log(tagAttributeNameStartingIndices);
                console.log(tagAttributeNameEndingIndices);
                
                console.log(tagAttributeQuoteStartingIndices);
                console.log(tagAttributeQuoteEndingIndices);
                */

                if (stringToReplaceCurrentTag != null) { // If the tag needs replacement...
                    i = currentTagStartingIndex; // The string marcher will now march right through our new tag ender.
                    stringToMarchThrough = replaceFirstSubstringInStringAfterACertainPoint(stringToMarchThrough, currentTagSubstring, stringToReplaceCurrentTag, currentTagStartingIndex);
                }


                // Oh, yes. We's also like to clear these. We NEED to clear these because we'd like them empty for later.
                tagAttributeQuoteStartingIndices = [];
                tagAttributeQuoteEndingIndices = [];
                tagAttributeNameStartingIndices = [];
                tagAttributeNameEndingIndices = [];
                // I am now thinking about memory management in C. Soon. Soon.
            }
        }
    }

    return stringToMarchThrough;
}


// Note that this thing is blind to everything *outside* the tag. If you want to modify attributes *within* the tag, I'd recommend that you mix this with singleTagMarcher().

/** Give this function a string containing the contents of one tag.
 * It will return an array of JS Objects representing the attributes. See below.
 * 
 * You can optionally pass in a JS Object that replaces whatever was inside of the tag. The return value will be the tag's new substring.The format of the JS Object will basically 
 * 
 * Now, how does the return value look when you do not give it a JS Object to replace the stuff?
 * As for how the JS Objects in question look:
 * 
 * `{`  
 * 
 *     `name: String that represents the name of the attribute.`  
 *     `data: The string that normally comes after the attribute. If there is no data (often the case for boolan attributes), **this will not be made.**`  
 * `}`
 * 
 * The array will be in the same order as how it was before you did anything, 
 * 
 * 
 */
function singleTagMarcher(substring, newAttributeList = null) {

}




/** Suppose we have a string. We want to replace a substring within it, but there are multiple instances of the substring! Well, that's where this function comes in handy; we can specify an indice for where to start looking, with the first (and only the first!) instance of the substring being replaced. */
function replaceFirstSubstringInStringAfterACertainPoint(stringToModify, substringToReplace, stringYouAreReplacingItWIth, indiceOfWhereToStartLooking) { 
        //     Cut the string into two pieces, at our index.
        //     Replace the thing.
        //     Merge the strings back together.
        
        var stringHalves = splitStringAtIndex( stringToModify, indiceOfWhereToStartLooking );
        // console.log( stringToModify.charAt(indiceOfWhereToStartLooking) )
        // console.log(stringHalves)
        stringHalves[1] = stringHalves[1].replace( substringToReplace, stringYouAreReplacingItWIth);
        return stringHalves[0] + stringHalves[1];
}

/** Splits a string in two, at the given index. Returns an array of both halves of the string. */
function splitStringAtIndex(stringToSplit, index) {
    return [ stringToSplit.substring(0, index), stringToSplit.substring(index, stringToSplit.length) ];
}

/*
TODO: Modify the "stop searching for string" trigger. As is stands, it looks for ">", but what happens if that's part of an attribute, like in CSS or something?
So, get on that sometime.

Future me here. Perhaps you could make use of that string marcher? It already handles all the edge cases anyways, may as well use it.
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

// TODO: Avoid a capture if it has a backslash at any point in it. I'm not doing this juuust yet because using a "no-capture group" has caused issues before.
/** Gets the starting indices of all tags of a specified type; this is the indice of the starting arrow "<", by the way. */
function getStartingIndicesOfTags(tagName, stringToSearchIn) {
    var startingIndicesOfSearchTags = [...stringToSearchIn.matchAll( new RegExp(String.raw`<\s  *${tagName}\s*`, "gi") )];

    // console.log(startingIndicesOfSearchTags)

    if (startingIndicesOfSearchTags.length > 0) { 
        let finalArray = [];
        for (let i = 0; i < startingIndicesOfSearchTags.length; i++) {
            finalArray.push(startingIndicesOfSearchTags[i].index);
            console.log( charAt(startingIndicesOfSearchTags[i].index));
        }

        console.log(finalArray)
        return finalArray; // This variable contains the index of the < character.
    } else { return []; }
}

/** Note that this is 1-indexed; first line is 1, not 0. */
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

