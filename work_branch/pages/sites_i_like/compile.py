# This compiles the 'Sites I Like' page.
# It used to be that a massive json added to the page, with Javascript creating all the web buttons. This is slow and cluttered and obliterates the end user's machine.
# But you know what? I'll man up and do it myself. Like a man. A real big boy.

# ------- OLD JAVASCRIPT CODE THAT YOU HAVE TO PORT BUT ONLY KIND OF -------
    # <script>
    #     var itemsLookupTable = [
    #         // This is an array of JS objects. Assume all properties are mandatory unless explicitly specified. Within is:

    #         // image: This is, well, the image. I dunno what to say.
    #         // unoptimizedImage: If the image is an optimized version, then put down the unoptimized version. This is currently unused, but I would like to make 'Open Image in New Tab' link to the unoptimiized version. Maybe. That's a feature for later. In the event the thing you already have is optimized, don't put anything here.
    #         // titleText: This is the flavor text that you see when you hover over it. This is optional.
    #         // altText: This is what screenreaders and people who couldn't load the image will replace it with. No flavor text!! If left empty this will just be the link.
    #         // resultingLink: This is a link to the site that the button would, well, link to.
    #         // filterMode: nearest/smooth --- This determines the filtering mode when scaled. If left empty, it will default to smooth. 

    #         {
    #             resultingLink: "https://medjed.nekoweb.org",
    #             image: "./assets/sites/medjed-nekoweb.jpg",
    #             filterMode: "nearest"
    #         },
    #         {
    #             resultingLink: "https://melonking.net",
    #             image: "./assets/sites/melonking.gif",
    #             altText: "Visit melonking.net!",
    #             filterMode: "smooth"
    #         },
    #         {
    #             resultingLink: "https://melankorin.net/",
    #             image: "./assets/sites/melankorin.gif",
    #             filterMode: "nearest"
    #         },
    #         {
    #             resultingLink: "https://darkosparko.nekoweb.org",
    #             image:"./assets/sites/darkosparko.gif",
    #             filterMode: 'nearest',
    #             altText: "Rocket into the Spark-Web!"
    #         },
    #         {
    #             resultingLink: "https://dimden.dev/",
    #             image: "./assets/sites/dimden.gif",
    #             filterMode: 'nearest'
    #         },
    #         {
    #             resultingLink: "https://planetclue.com/",
    #             image: "./assets/sites/planetclue.gif",
    #             filterMode: 'smooth'
    #         },
    #         {
    #             resultingLink: "https://nekoweb.org",
    #             image: "./assets/sites/nekoweb.gif",
    #             altText: "button by nepeta.pet",
    #             filterMode: 'nearest'
    #         },
    #         {
    #             resultingLink: "https://thinliquid.dev",
    #             image: "./assets/sites/thinliquid.png",
    #             altText: "thinliquid's button",
    #             filterMode: 'nearest'
    #         },
    #         {
    #             resultingLink: "https://joo.sh",
    #             image: "./assets/sites/joosh.gif",
    #             filterMode: 'smooth'
    #         },
    #         {
    #             resultingLink: "https://bomberfish.ca",
    #             image: "./assets/sites/bomberfish.gif",
    #             filterMode: "nearest"
    #         }
    #     ];
    #     document.getElementById("archiveLoader").addEventListener("click", () => { loadSuperArchive(itemsLookupTable, document.getElementById('superArchiveContainer')) } ); // Calling an inline function was necessary 'cause I couldn't specifiy the args unless the function ran *before* you click the button (which defeats the purpose). This is good enough. 


    #     // This is an optimization.
    #     var imageTags = document.querySelectorAll('img');
    #     for (let i = 0; i < imageTags.length; i++) {
    #         var tagToMod = imageTags[i]; 
    #         // They only load when they're on-screen, and they don't lag you when they decode (since there's a million of 'em)
    #         tagToMod.loading = "lazy";
    #         tagToMod.decoding = "async";
    #     }


    #     function loadSuperArchive(lookupTable, placeToPutStuff) {
    #         // See itemsLookupTable for documentation on how this stupid format works. You're gonna need it if you want to understand this. 
    #         // TODO: Put this in a web worker. I did try, mind you, but document.createElement doesn't work and manually making the tag with string concatenation + innerHTML doesn't support images for some reason.

    #         placeToPutStuff.innerHTML = "";
    #         for (var i = 0; i < lookupTable.length; i++) {
    #             if (lookupTable[i].altText == undefined) { lookupTable[i].altText = lookupTable[i].resultingLink }
    #             if (lookupTable[i].titleText == undefined) { lookupTable[i].titleText = lookupTable[i].altText }

    #             var containerAnchor = document.createElement('a');
    #             var imageTag = document.createElement('img');
    #             imageTag.classList.add("archiveSite");
                
    #             imageTag.src = lookupTable[i].image;
    #             // unoptimizedImage is unused. But this is a reminder that it exists in case you need it sometime ;)
    #             imageTag.alt = lookupTable[i].altText;
    #             imageTag.loading = "lazy";
    #             imageTag.decoding = "async";
    #             if (lookupTable[i].filterMode == undefined) { lookupTable[i].filterMode = "smooth" }

    #             switch(lookupTable[i].filterMode) {
    #                 case "nearest":
    #                     imageTag.classList.add("archiveSite-nearestfilter");
    #                 case "smooth":
    #                     imageTag.classList.add("archiveSite-smoothfilter");

    #             }

                
    #             containerAnchor.title = lookupTable[i].altText;
    #             containerAnchor.href = lookupTable[i].resultingLink;
    #             containerAnchor.target = "_blank";
                
    #             // We have to put the image inside an anchor tag because images can't lead to links. Oh well, it's less of a hacky workaround and more of 'an established precedent' that was established before I was born. What the hell man??? 
    #             containerAnchor.appendChild(imageTag);
    #             placeToPutStuff.appendChild(containerAnchor);
    #         }
    #     }

    # </script>
# ------- OKAY NOW WE DO THE PYTHON VERSION -------


# Since JS doesn't allow comments, I will add the button documentation in here.


#  The web buttons are in an array of JS objects, within web_buttons.json. Assume all properties are mandatory unless explicitly specified. Within is:

#  image: This is, well, the image. I dunno what to say.
#  unoptimizedImage: If the image is an optimized version, then put down the unoptimized version. This is currently unused, but I would like to make 'Open Image in New Tab' link to the unoptimiized version. Maybe. That's a feature for later. In the event the thing was optimized from the start, don't put anything here.
#  titleText: This is the flavor text that you see when you hover over it. This is optional.
#  altText: This is what screenreaders and people who couldn't load the image will replace it with. No flavor text!! If left empty this will just be the link.
#  resultingLink: This is a link to the site that the button would, well, link to.
#  filterMode: nearest/smooth --- This determines the filtering mode when scaled. If left empty, it will default to smooth. 

import json
import os

# Note that this requires you to be located in the same place as this script; that's the place with web_buttons.json in it.
webButtonJsonList = open("./web_buttons.json", mode='r')
print(json.dump(webButtonJsonList))






# And after all is said and done...
webButtonJsonList.close()