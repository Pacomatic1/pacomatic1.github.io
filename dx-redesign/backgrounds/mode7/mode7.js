/*  REMEMBER: This is a module script, so you cannot run it using an external .js file when running locally. You also cannot use any textures when running this locally.
In order to do that, you need to run a local server, most easily done using Node.js + npm + the serve extension:
-----
npx serve <path to background folder>
-----
Sadly, npx is stupid and it makes iframes reference image paths relative to the root and not the iframe's location. This breaks the entire site. 
Don't worry though, none of will cause issues once pushed to any web host; Neocities, GitHub, or Nekoweb.
All this to say: Set up the Node.js server, and remember to stay pissed! */

/* This script is designed to be imported as a module. Here's the documentation (assuming you 'import * as MODE7 from <name>):
    Start with MODE7.constructPlane( { args } ).
        Here's what args should contain. Assume all args are mandatory unless specified otherwise:
            texture: pathToTexture (string), Relative path.
            backupColor: "#00ff00" (string) (optional), // In the event that the texture is blocked from being loaded, this color will be used instead.
            planeSize: 4 (float) (optional),
            cameraPosition: { 0 (float), 2.1 (float), 5 (float) } (optional), // XYZ.
            cameraLookAt: { 0 (float), 0.2 (float), 0 (float) } (optional), // XYZ.
            cameraFov: 40 (int) (optional),
            startingRotation: { 0 (float), 0 (float), 0 (float) } (optional), // XYZ, Euler angles.
            rotationSpeed: 0.1 (float) (optional), // If you want no rotation, set to 0.
            ignoreCorsIssues: false (optional), // You shouldn't do this, but you can!
            textureFilteringNoMipMap: "nearest" (string) (optional), // Set to "nearest" or "linear".
            textureFilteringWhenMipMapped: "nearest" (string) (optional), // Set to "nearest" or "linear".
            renderResolutionOnHDScreens: .5 (float) (optional), // iIf not 0, the render resolution will be given this multiplier because performance. Only affects high-DPI screen, others will see it at full scale. If 0, then it's off. If you wanna be evil, you can set it above 1 to make people who already have bad performance have *even worse* performance. But you would never do that, *right?*
            whereToPutCanvas: "%body" (string) (optional), // Where to put this in the DOM. If you want to put it somewhere with a specific ID, prefix with hashtag thenadd ID. If you want to put it in the instance of an HTML element, prefix with % and add element's name. Unless you're putting this in a one-off element (like the body), you'd best use an ID.
            
*/





import * as THREE from 'three';

var hasScriptBeenInitialized = false; // Nothing can happen until constructPlane is called. Always make sure it's true!
var willThereBeCorsIssues = seeIfThereWillThereBeCorsIssues(); 

var scene, camera, renderer, plane, ignoreCorsIssues, renderResolutionMultiplierOnHDScreens, textureToLoad, backupColor, planeSize, cameraPosition, cameraLookAt, cameraFov, startingRotation, rotationSpeed, ignoreCorsIssues, textureFilteringWhenMipMapped, textureFilteringNoMipMap, whereToPutCanvas; // Global variables.


export function constructPlane(args) { // Wanna know what 'args' is? Look up.
    hasScriptBeenInitialized = true;
    textureToLoad = args.texture;
    backupColor = args.backupColor || "#00ff00";
    planeSize = args.planeSize || 4;
    cameraPosition = args.cameraPosition || { x: 0, y: 2.1, z: 5 };
    cameraLookAt = args.cameraLookAt || { x: 0, y: 0.2, z: 0 };
    cameraFov = args.cameraFov || 40;
    startingRotation = args.startingRotation || { x: 1.5708, y: 0, z: 0 }; // three.js uses radians. This is 90 in degrees.
    rotationSpeed = args.rotationSpeed || { x: 0, y: 0, z: 0.01 };
    ignoreCorsIssues = args.ignoreCorsIssues || false;
    textureFilteringNoMipMap = args.textureFilteringNoMipMap || "nearest";
    textureFilteringWhenMipMapped = args.textureFilteringWhenMipMapped || "nearest";
    renderResolutionMultiplierOnHDScreens = args.renderResolutionMultiplierOnHDScreens || .5;
    whereToPutCanvas = args.whereToPutCanvas || "%body";

    if (ignoreCorsIssues) { console.log("From the background: CORS issues have been manually ignored."); }
    if (willThereBeCorsIssues) { console.log("From the background: CORS issues are expected. If you want to view this correctly, run a local server and view the background on there. An easy way is to get Node.js, npm, and the serve extension, then use 'npx serve <project directory here>'."); }
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( cameraFov, window.innerWidth / window.innerHeight, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer({ alpha: true } );

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
    
    // Create the flat plane (MODE 7!!!!!) 
    const geometry = new THREE.PlaneGeometry( planeSize, planeSize, planeSize );
    
    // If we're running on file://, disable the texture to avoid a bunch of issues.
    var material;
    var colorAsValidHex = "#" + backupColor.substring(1);
    if (willThereBeCorsIssues) {
        material = new THREE.MeshBasicMaterial( { color: colorAsValidHex } );
    } else {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(textureToLoad);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.textureFilteringNoMipMap;
        texture.magFilter = THREE.textureFilteringWhenMipMapped;    
        material = new THREE.MeshBasicMaterial( { map: texture } );
    }

    material.transparent = true;
    material.side = THREE.DoubleSide
    plane = new THREE.Mesh( geometry, material );
    
    plane.rotation.x = startingRotation.x; 
    plane.rotation.y = startingRotation.y; 
    plane.rotation.z = startingRotation.z; 
    scene.add( plane );

    camera.position.x = cameraPosition.x;
    camera.position.y = cameraPosition.y;
    camera.position.z = cameraPosition.z;
    
    camera.lookAt(cameraLookAt.x,cameraLookAt.y,cameraLookAt.z);



    onWindowResize(); // This does a bunch of unneeded stuff, but it also handles renderResolutionMultiplierOnHDScreens so we'll run it.
}




addEventListener("resize", onWindowResize);

function onWindowResize() { // This is called on init as well.
    if (!hasScriptBeenInitialized) { return; } // Don't do anything if the script hasn't been initialized yet.
    var width = window.innerWidth;
    var height = window.innerHeight;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // if (window.devicePixelRatio >= 2 && renderResolutionMultiplierOnHDScreens != 0) {
        renderer.setSize( window.innerWidth, window.innerHeight * renderResolutionMultiplierOnHDScreens );
    // } else {
        renderer.setSize( width, height );
    // }
    
    renderer.setPixelRatio( window.devicePixelRatio );
    
}


function animate() {
    // This is only called after the script is initialized, so we don't need to know if it's initialized or not. This causes more bugs if other functions go against this, but it runs every frame so avoiding the extra check is a very consequential optimization.
    plane.rotation.x += rotationSpeed.x;
    plane.rotation.y += rotationSpeed.y;
    plane.rotation.z += rotationSpeed.z;
    renderer.render( scene, camera );
}

function seeIfThereWillThereBeCorsIssues() { // If possible, check the variable "willThereBeCorsIssues" instead. Optimization.
    // three.js does NOT like running off local files. C'est la vie.
    if (ignoreCorsIssues) { return false; }
    return window.location.href.includes("file:");
}