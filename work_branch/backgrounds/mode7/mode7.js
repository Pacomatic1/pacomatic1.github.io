/*  REMEMBER: This is a module script, so you cannot run it using an external .js file when running locally. You also cannot use any textures when running this locally.
In order to do that, you need to run a local server, most easily done using Node.js + npm + the serve extension:
-----
npx serve <path to background folder>
-----
Sadly, npx is stupid and it makes iframes reference image paths relative to the root and not the iframe's location. This breaks the entire site. 
Don't worry though, none of will cause issues once pushed to any web host; Neocities, GitHub, or Nekoweb.
All this to say: Set up the Node.js server, and remember to stay pissed! */

/* This script is designed to be imported as a module. Here's the documentation (assuming you 'import * as MODE7 from <name>):
    Start with MODE7.constructPlane( { args } ). You must always do this first.
        Here's what args should contain. Assume all args are mandatory unless specified otherwise:
            texture: pathToTexture (string), Relative path.
            backupColor: "#00ff00" (string) (optional), // In the event that the texture is blocked from being loaded, this color will be used instead.
            mainPlaneSize: 4 (float) (optional),
            cameraPosition: { x: 0 (float), y: 2.1 (float), z: 5 (float) } (optional), // XYZ.
            cameraLookAt: { 0 (float), 0.2 (float), 0 (float) } (optional), // XYZ.
            cameraFov: 40 (int) (optional),
            startingRotation: { x: 1.5708 (float), y: 0 (float), z: 0 (float) } (optional), // XYZ, Euler angles.
            rotationSpeed: 0.01 (float) (optional), // If you want no rotation, set to 0.0000001. Setting it to 0 breaks.
            ignoreCorsIssues: false (optional), // You shouldn't do this, but you can!
            generateMipmaps: false (boolean) (optional), // If false, textureFilteringWhenMipMapped will be irrelevant.
            textureFilteringNoMipMap: "nearest" (string) (optional), // Set to "nearest" or "linear".
            textureFilteringWhenMipMapped: "nearest" (string) (optional), // Set to "nearest" or "linear".
            renderResolutionOnHDScreens: .5 (float) (optional), // iIf not 0, the render resolution will be given this multiplier because performance. Only affects high-DPI screen, others will see it at full scale. If 0, then it's off. If you wanna be evil, you can set it above 1 to make people who already have bad performance have *even worse* performance. But you would never do that, *right?*
            whereToPutCanvas: "%body" (string) (optional), // Where to put this in the DOM. If you want to put it somewhere with a specific ID, prefix with hashtag thenadd ID. If you want to put it in the instance of an HTML element, prefix with % and add element's name. Unless you're putting this in a one-off element (like the body), you'd best use an ID.
    
    You can call MODE7.constructInfinitePlane( { args } ). Perfect if you don't want everything in the distance to be a flat color.
        Here's what args should contain. Assume all args are mandatory unless specified otherwise:
            texture: "#00ff00" (string) (optional), Either a path to a texture or a color. If it's a texture, it's a relative path. Note that any mention of mipmaps or filtering is irrelevant wehn using a color (though that's not much of a surprise).
            startingRotation: { x: 1.5708 (float), y: 0 (float), z: 0 (float) } (optional), // XYZ, Euler angles.
            rotationSpeed: sameAsMainPlane (float) (optional), // If you want no rotation, set to 0.0000001. Setting it to 0 breaks.
            generateMipmaps: sameAsMainPlane (boolean) (optional), // If false, textureFilteringWhenMipMapped will be irrelevant.
            textureFilteringNoMipMap: sameAsMainPlane (string) (optional), // Set to "nearest" or "linear".
            textureFilteringWhenMipMapped: sameAsMainPlane (string) (optional), // Set to "nearest" or "linear".
            repeatAmount: 5000 (int) (optional), // This is the amount of times the texture will repeat, not the size of the texture.

*/





import * as THREE from 'three';

var hasScriptBeenInitialized = false; // Nothing can happen until constructPlane is called. Always make sure it's true!
var willThereBeCorsIssues = seeIfThereWillThereBeCorsIssues(); 

var scene, camera, renderer, loader, mainPlane, ignoreCorsIssues, renderResolutionMultiplierOnHDScreens, textureToLoad, backupColor, mainPlaneSize, cameraPosition, cameraLookAt, cameraFov, startingRotation, rotationSpeed, ignoreCorsIssues, textureFilteringWhenMipMapped, textureFilteringNoMipMap, whereToPutCanvas, generateMipmaps; // Global variables.

var infinitePlane, infinitePlaneTexture, infinitePlaneBackupColor, infinitePlaneStartingRotation, infinitePlaneRotationSpeed, infinitePlaneGenerateMipmaps, infinitePlaneTextureFilteringNoMipMap, infinitePlaneTextureFilteringWhenMipMapped, infinitePlaneRepeatAmount; // Global variables, but for the infnite plane.

addEventListener("resize", onWindowResize);



// PUBLIC STUFF

export function constructPlane(args) { // Wanna know what 'args' is? Look up.
    hasScriptBeenInitialized = true;
    textureToLoad = args.texture;
    backupColor = args.backupColor || "#00ff00";
    mainPlaneSize = args.mainPlaneSize || 4;
    cameraPosition = args.cameraPosition || { x: 0, y: 2.1, z: 5 };
    cameraLookAt = args.cameraLookAt || { x: 0, y: 0.2, z: 0 };
    cameraFov = args.cameraFov || 40;
    startingRotation = args.startingRotation || { x: 1.5708, y: 0, z: 0 }; // three.js uses radians. This is 90 in degrees.
    rotationSpeed = args.rotationSpeed || 0.01;
    ignoreCorsIssues = args.ignoreCorsIssues || false;
    textureFilteringNoMipMap = args.textureFilteringNoMipMap || "nearest";
    textureFilteringWhenMipMapped = args.textureFilteringWhenMipMapped || "nearest";
    generateMipmaps = args.generateMipmaps || false; 
    renderResolutionMultiplierOnHDScreens = args.renderResolutionMultiplierOnHDScreens || .5;
    whereToPutCanvas = args.whereToPutCanvas || "%body";
    

    if (ignoreCorsIssues) { console.log("From the background: CORS issues have been manually ignored."); }
    if (willThereBeCorsIssues) { console.log("From the background: CORS issues are expected. If you want to view this correctly, run a local server and view the background on there. It's easy to do with Node.js and http-server."); }
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( cameraFov, window.innerWidth / window.innerHeight, 0.001, 1000 );
    renderer = new THREE.WebGLRenderer( { alpha: true } );

    renderer.setSize( 128, 128 ); // Later, we will call onWindowResize(). onWindowResize() will override this anyways, so in the meantime give it something small.
    renderer.setAnimationLoop( animate );

    // We need to add the canvas, but first we must pick a place - see whereToPutCanvas.
    var placeToPutCanvas;
    if (whereToPutCanvas.startsWith("#")) { // If it starts with a hashtag, it's an ID.
        placeToPutCanvas = document.getElementById(whereToPutCanvas.substring(1)); // Get the element with the ID.
    } else if (whereToPutCanvas.startsWith("%")) { // If it starts with a percent, it's an element name.
        placeToPutCanvas = document.getElementsByTagName(whereToPutCanvas.substring(1))[0]; // Get the first element with that name.
    } // Thanks, GitHub Copilot! I'm terrified!
    
    renderer.domElement.id = "mode7Canvas"; // Give the canvas an ID so we can find it later.
    placeToPutCanvas.appendChild( renderer.domElement );
    
    // Create the flat mainPlane (MODE 7!!!!!) 
    const geometry = new THREE.PlaneGeometry( mainPlaneSize, mainPlaneSize, mainPlaneSize );
    
    // If we're running on file://, disable the texture to avoid a bunch of issues.
    var material;
    var colorAsValidHex = "#" + backupColor.substring(1);
    if (willThereBeCorsIssues) {
        material = new THREE.MeshBasicMaterial( { color: colorAsValidHex } );
    } else {
        loader = new THREE.TextureLoader();
        const texture = loader.load(textureToLoad);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = generateMipmaps;
        
        switch (textureFilteringNoMipMap) {
            case "nearest":
                texture.minFilter = THREE.NearestFilter;
                break;
            case "linear":
                texture.minFilter = THREE.LinearFilter;
                break;
            default:
                console.log("From the background: textureFilteringNoMipMap has in invalid value. Defaulting to nearest.");
                texture.minFilter = THREE.NearestFilter; 
                break;
        }
        switch (textureFilteringWhenMipMapped) {
            case "nearest":
                texture.magFilter = THREE.NearestFilter;
                break;
            case "linear":
                texture.magFilter = THREE.LinearFilter;
                break;
            default:
                console.log("From the background: textureFilteringWhenMipMapped has in invalid value. Defaulting to nearest.");
                texture.magFilter = THREE.NearestFilter; 
                break;
        }

        material = new THREE.MeshBasicMaterial( { map: texture } );
    }

    material.transparent = true;
    material.side = THREE.DoubleSide
    mainPlane = new THREE.Mesh( geometry, material );
    
    mainPlane.rotation.x = startingRotation.x; 
    mainPlane.rotation.y = startingRotation.y; 
    mainPlane.rotation.z = startingRotation.z; 
    scene.add( mainPlane );

    camera.position.x = cameraPosition.x;
    camera.position.y = cameraPosition.y;
    camera.position.z = cameraPosition.z;
    
    camera.lookAt(cameraLookAt.x,cameraLookAt.y,cameraLookAt.z);



    onWindowResize(); // This does a bunch of unneeded stuff, but it also handles renderResolutionMultiplierOnHDScreens so we'll run it.
}

export function constructInfinitePlane(args) {
    infinitePlaneTexture = args.texture;
    infinitePlaneBackupColor = args.backupColor || "#00ff00";
    infinitePlaneStartingRotation = args.startingRotation || { x: 1.5708, y: 0, z: 0 }; // three.js uses radians. This is 90 in degrees.
    infinitePlaneRotationSpeed = args.rotationSpeed || rotationSpeed;
    infinitePlaneGenerateMipmaps = args.generateMipmaps || generateMipmaps;
    infinitePlaneTextureFilteringNoMipMap = args.textureFilteringNoMipMap || textureFilteringNoMipMap;
    infinitePlaneTextureFilteringWhenMipMapped = args.textureFilteringWhenMipMapped || textureFilteringWhenMipMapped;
    infinitePlaneRepeatAmount = args.repeatAmount || 5000; 
    const geometry = new THREE.PlaneGeometry( 999, 999, 999 );
    var material;
    
    var isThisAColor = false;
    if (infinitePlaneTexture.startsWith("#")) { isThisAColor = true; } // If it starts with a hashtag, it's a color.

    if (isThisAColor) {
        material = new THREE.MeshBasicMaterial( { color: infinitePlaneTexture } );
    } else {
        const texture = loader.load(infinitePlaneTexture);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = infinitePlaneGenerateMipmaps;
        
        switch (infinitePlaneTextureFilteringNoMipMap) {
            case "nearest":
                texture.minFilter = THREE.NearestFilter;
                break;
            case "linear":
                texture.minFilter = THREE.LinearFilter;
                break;
            default:
                console.log("From the background: textureFilteringNoMipMap has in invalid value. Defaulting to nearest.");
                texture.minFilter = THREE.NearestFilter; 
                break;
        }
        switch (infinitePlaneTextureFilteringWhenMipMapped) {
            case "nearest":
                texture.magFilter = THREE.NearestFilter;
                break;
            case "linear":
                texture.magFilter = THREE.LinearFilter;
                break;
            default:
                console.log("From the background: textureFilteringWhenMipMapped has in invalid value. Defaulting to nearest.");
                texture.magFilter = THREE.NearestFilter; 
                break;
        }

        texture.wrapS = THREE.RepeatWrapping; // Repeat the texture on the infinite plane.
        texture.wrapT = THREE.RepeatWrapping; // Repeat the texture on the infinite plane.
        texture.repeat.set( infinitePlaneRepeatAmount, infinitePlaneRepeatAmount );

        material = new THREE.MeshBasicMaterial( { map: texture } );
    }
    
    material.transparent = true;
    material.side = THREE.DoubleSide
    infinitePlane = new THREE.Mesh( geometry, material );
    
    infinitePlane.rotation.x = infinitePlaneStartingRotation.x; 
    infinitePlane.rotation.y = infinitePlaneStartingRotation.y; 
    infinitePlane.rotation.z = infinitePlaneStartingRotation.z; 

    infinitePlane.position.y = -0.1; // Anti z-fighting
    scene.add( infinitePlane );

}


// CALLED OFTEN BUT STILL PRIVATE 

function onWindowResize() { // This is called on init as well.
if (!hasScriptBeenInitialized) { return; } // Don't do anything if the script hasn't been initialized yet.
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    if (window.devicePixelRatio >= 2 && renderResolutionMultiplierOnHDScreens != 0) {
        renderer.setSize( window.innerWidth, window.innerHeight * renderResolutionMultiplierOnHDScreens );
    } else {
        renderer.setSize( width, height );
    }
    
    renderer.setPixelRatio( window.devicePixelRatio );
    
}

function animate() {
    // This is only called after the script is initialized, so we don't need to know if it's initialized or not. This causes more bugs if other functions go against this, but it runs every frame so avoiding the extra check is a very consequential optimization.
    mainPlane.rotation.z += rotationSpeed;
    if (infinitePlane) { infinitePlane.rotation.z += infinitePlaneRotationSpeed; }
    renderer.render( scene, camera );
}

// MISCELLANEOUS

function seeIfThereWillThereBeCorsIssues() { // If possible, check the variable "willThereBeCorsIssues" instead, as it's set at the start and is only one read as opposed to several. Optimization.
    // three.js does NOT like running off local files. C'est la vie.
    if (ignoreCorsIssues) { return false; }
    return window.location.href.includes("file:");
}