// Since JSON doesn't allow comments, I will add the button documentation in here.

//  The web buttons are in an array of JS objects, within project_listings.json. Assume all properties are mandatory unless explicitly specified. Within is:

//  banner: This is a url pointing to the banner's image file.
//  title: This is ideally the project's name. There *is* a character limit, but so long as you aren't frivolous it shouldn't be much an issue.
//  bannerAlt: This is the alt text for the banner. Need I explain?
//  link: This is where you go when you click the banner. Due to the site being so whack, external links should have the protocol as well; you know, 'https://example.com' vs. 'example.com'.
// target: Where do you want the link to open? You get to choose between "parent", "internal", and "external". "external" means opening a new tab, "parent" means opening it in the overall parent page. "internal" means opening it within the frame. As a rule of thumb, any links that are part of the site should be opened within the iframe, and any links that are not part of the site should be opened using a new tab.
//  accentColor: This is a color that will be applied to some stuffs. It'll do some blending with other parts of the page, so no gradients or images. Just one hex color.
//  description: This is the description. What must I say?
//  date: This is the date of the project, from when it started to when it ended (if at all).


const fs = require("node:fs");

console.log("Projects Page: Started")

var project_listings_json = require('./project_listings.json');
var project_listings_final = "";

for (var i = 0; i < project_listings_json.length; i++) {

    // ok so i decided to do accentcolor later because it's destroying me from the inside. come back l8er.

    var linkTarget;
    switch(project_listings_json[i].target) {
        case "parent":
            linkTarget = "_top";
            break;
        case "internal":
            linkTarget = "_self"
            break;
        case "external":
            linkTarget = "_blank";
            break;
    }

    var finalString = `
    <div class="projectListing">
        <div class="projectTitle">
            <p class="ignore-master-css projectTitleText">${project_listings_json[i].title}</p>
        </div>
        <a href="${project_listings_json[i].link}" target="${linkTarget}">
            <div class="projectBanner" style="background-image: url('${project_listings_json[i].banner}');">
            </div>
        </a>
        <div class="projectDescription">
            <p class="ignore-master-css">${project_listings_json[i].description}</p>
        </div>
        <div class="projectDate">
            <p class="ignore-master-css">${project_listings_json[i].date}</p>
        </div>
    </div>
    `


    project_listings_final = project_listings_final + finalString;
} // Returns a super big string containing our required things.


// Alrighty, time to put this into our page.

// First, I need to get the base bage. Node.js doesn't know what encoding our file uses and will return a buffer, but if I tell it the encoding it will return a string.
// Lucky me, I mandated a certain encoding. So we don't need any detection shenanigans.

var baseHTMLString = fs.readFileSync("./base.html", 'utf8');

// First, a quick thingy at the start of the file to warn everyone editing index.html that they should actually be editing base.html and compiling afterwards.
baseHTMLString = "<!-- HEY!!!!! This is the COMPILED version of this page. If you want to make eny edits, you should instead edit base.html, and then compile it. -->\n" + baseHTMLString;

// The spot we'll replace is based on a tiny little important piece of text in the base.html, which says 'NODEJS-UNIQUENESS-IDENTIFIER-HOWEEEEAAWWEEEEEEEEE2198732987926758239084617235239847'. This is the thing we replace, it must never appear anywhere else in that file. 
var finalHTMLString = baseHTMLString.replace("NODEJS-UNIQUENESS-IDENTIFIER-HOWEEEEAAWWEEEEEEEEE2198732987926758239084617235239847", project_listings_final);
fs.writeFileSync('./index.html', finalHTMLString);
console.log("Projects Page: Done");