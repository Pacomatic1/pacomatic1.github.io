var itemsLookupTable = [
    // This is an array of JS objects. Assume all properties are mandatory unless explicitly specified. Within is:

    // image: This is, well, the image. I dunno what to say.
    // unoptimizedImage: This is the unoptimized version of the image. If you don't *have* an unoptimized version, do not add this property.
    // titleText: This is the flavor text that you see when you hover over it. This is optional.
    // altText: This is what screenreaders and people who couldn't load the image will replace it with. No flavor text!!
    // siteLink: This is a link to the site that the button would, well, link to.

    {
        siteLink: "https://medjed.nekoweb.org",
        image: "./assets/sites/medjed-nekoweb.jpg",
        altText: "Medjed, on Nekoweb."
    }
];
var latestMessage;
const maxItemBuffer = 10; // This is an array containing the raw HTMLObjects; you 

onmessage = (e) => {
    latestMessage = e.data;

    if (latestMessage == "loadData") {
        console.log("The web worker has started loading the super archive!");
        console.log(itemsLookupTable);

        var itemBuffer

        // Understand this: document.createElement, or anything similar to it, is not availiable in Web Workers. As such, I will have to do it the stupid and hacky but super fast way.


        for (var i = 0; i < itemsLookupTable.length; i++) {
            if (itemsLookupTable[i].titleText == undefined) { itemsLookupTable[i].titleText = itemsLookupTable[i].altText}


            var finalTag = '<a class="" target="_blank" title="' + itemsLookupTable[i].titleText + '" href="' + itemsLookupTable[i].siteLink + '"> <img src="' + itemsLookupTable[i].image + '" alt="' + itemsLookupTable[i].altText + '></img></a>'
            console.log(finalTag);
            postMessage(finalTag);

            /*
            var containerAnchor = document.createElement('a');
            var imageTag = document.createElement('img');
            imageTag.classList.add("featuredSite");
            
            imageTag.src = itemsLookupTable[i].image;
            // unoptimizedImage is unused. But this is a reminder that it exists in case you need it sometime ;)
            imageTag.alt = itemsLookupTable[i].alt;
            
            containerAnchor.title = itemsLookupTable[i].titleText;
            containerAnchor.href = itemsLookupTable[i].siteLink;
            containerAnchor.target = "_blank";
            
            // We have to put the image inside an anchor tag because images can't lead to links. Oh well, it's less of a hacky workaround and more of 'an established precedent' that was established before I was born. What the hell man??? 
            containerAnchor.appendChild(imageTag);
            console.log(containerAnchor);
            // placeToPutStuff.appendChild(containerAnchor);
            */
        }



    }
};