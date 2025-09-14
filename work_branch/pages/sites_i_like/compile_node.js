// This compiles the 'Sites I Like' page.
// It used to be that a massive json added to the page, with Javascript creating all the web buttons. This is slow and cluttered and obliterates the end user's machine.
// But you know what? I'll man up and do it myself. Like a man. A real big boy.

// Since JSON doesn't allow comments, I will add the button documentation in here.


//  The web buttons are in an array of JS objects, within web_buttons.json. Assume all properties are mandatory unless explicitly specified. Within is:

//  image: This is, well, the image. I dunno what to say.
//  unoptimizedImage: If the image is an optimized version, then put down the unoptimized version. This is currently unused, but I would like to make 'Open Image in New Tab' link to the unoptimiized version. Maybe. That's a feature for later. In the event the thing was optimized from the start, don't put anything here.
//  titleText: This is the flavor text that you see when you hover over it. This is optional.
//  altText: This is what screenreaders and people who couldn't load the image will replace it with. No flavor text!! If left empty this will just be the link.
//  resultingLink: This is a link to the site that the button would, well, link to.
//  filterMode: nearest/smooth --- This determines the filtering mode when scaled. If left empty, it will default to smooth. 


const fs = require("node:fs");
const languageEncoding = require("detect-file-encoding-and-language");

console.log("Sites I Like: Started")

var web_buttons_json = require('./web_buttons.json');
var web_buttons_final = "";
for (var i = 0; i < web_buttons_json.length; i++) {
    if (web_buttons_json[i].altText == undefined) { web_buttons_json[i].altText = web_buttons_json[i].resultingLink }
    if (web_buttons_json[i].titleText == undefined) { web_buttons_json[i].titleText = web_buttons_json[i].altText }
    if (web_buttons_json[i].filterMode == undefined) { web_buttons_json[i].filterMode = "smooth" }
    
    // unoptimizedImage is unused. But this is a reminder that it exists in case you need it sometime ;)
    
    
    // Quick note: See the class based on filterMode? Yeah, the way I did that is not at all modular and 100% sucks.
    // However, these JS objects are weird and everything I try refuses to let me use strings or... anything... for that matter. Only substituting text using these thingies work.
    // But it's still compatible with the rest of the page so.... it's fine... I guess....

    var finalString = `<a title="${web_buttons_json[i].titleText}" href="${web_buttons_json[i].resultingLink}" target="_blank"><img class="archiveSite archiveSite-${web_buttons_json[i].filterMode}filter" src="${web_buttons_json[i].image}" loading="lazy" decoding="async" alt="${web_buttons_json[i].altText}">`

    web_buttons_final = web_buttons_final.concat(finalString);
} // Returns a super big string containing our required things.


// Alrighty, time to put this into our page.

// First, I need to get the base bage. Node.js doesn't know what encoding our file uses and will return a buffer, but if I tell it the encoding it will return a string.
// Sadly, I cannot guarantee my page uses a specific encoding. As such, a library will find it for us.
// Sadlyer, this library ONLY has an async function. and I need a sync function. Due to my lackluster programming abilities, I will use this stupid hack. 
languageEncoding("./base.html").then((fileInfo) => {
    // Everything from hereon continues here.
    // If they ever allow top-level awaits, please refactor this.
    encoding = fileInfo.encoding;
    var baseHTMLString = fs.readFileSync("./base.html", encoding);

    // First, a quick thingy at the start of the file to warn everyone editing index.html that they should actually be editing base.html and compiling afterwards.
    baseHTMLString = "<!-- HEY!!!!! This is the COMPILED version of this page. If you want to make eny edits, you should instead edit base.html, and then compile it. -->\n" + baseHTMLString;


    // The spot we'll replace is based on a tiny little important piece of text in the base.html, which says 'NODEJS-IDENTIFIER-UNIQUENESS-893429874892374923874'. This is the thing we replace, it (should) never appear anywhere else in that file. 
    var finalHTMLString = baseHTMLString.replace("NODEJS-IDENTIFIER-UNIQUENESS-893429874892374923874", web_buttons_final);
    fs.writeFileSync('./index.html', finalHTMLString);
    console.log("Sites I Like: Done");
})
