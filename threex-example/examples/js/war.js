'use strict';

//////////////////////////////////////////////////////////////////////////////////
//    Test if the browser support WebGL and getUserMedia
//////////////////////////////////////////////////////////////////////////////////
;
(function () {
  // TODO backport those 2 in Detector.js
  var hasGetUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia) ? true : false;
  var hasMediaStreamTrackSources = MediaDevices.enumerateDevices || MediaStreamTrack.getSources ? true : false;
  var hasWebGL = (function () {
    try {
      var canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  })();

  if (hasWebGL === false) {
    alert('your browser doesn\'t support navigator.getUserMedia()')
  }
  if (hasMediaStreamTrackSources === false) {
    alert('your browser doesn\'t support MediaDevices.enumerateDevices()')
  }
  if (hasGetUserMedia === false) {
    alert('your browser doesn\'t support navigator.getUserMedia()')
  }
})()

//////////////////////////////////////////////////////////////////////////////////
//    enabled/disable various parts
//////////////////////////////////////////////////////////////////////////////////
var detectMarkersEnabled = true
var markerToObject3DEnabled = true
var webglRenderEnabled = true

document.querySelector('#detectMarkersEnabled input').checked = detectMarkersEnabled
document.querySelector('#detectMarkersEnabled input').addEventListener('change', function () {
  detectMarkersEnabled = document.querySelector('#detectMarkersEnabled input').checked
})

document.querySelector('#markerToObject3DEnabled input').checked = markerToObject3DEnabled
document.querySelector('#markerToObject3DEnabled input').addEventListener('change', function () {
  markerToObject3DEnabled = document.querySelector('#markerToObject3DEnabled input').checked
})

document.querySelector('#webglRenderEnabled input').checked = webglRenderEnabled
document.querySelector('#webglRenderEnabled input').addEventListener('change', function () {
  webglRenderEnabled = document.querySelector('#webglRenderEnabled input').checked
    // clear the webgl canvas - thus the last webgl rendering disapears
  renderer.clear()
})

document.querySelector('#markerDebugEnabled input').checked = false
document.querySelector('#markerDebugEnabled input').addEventListener('change', function () {
  jsArucoMarker.debugEnabled = document.querySelector('#markerDebugEnabled input').checked
})

//////////////////////////////////////////////////////////////////////////////////
//    init Stats for detectMarkers
//////////////////////////////////////////////////////////////////////////////////
var detectMarkersStats = new Stats();
detectMarkersStats.setMode(1);
document.body.appendChild(detectMarkersStats.domElement);
detectMarkersStats.domElement.style.position = 'absolute'
detectMarkersStats.domElement.style.bottom = '0px'
detectMarkersStats.domElement.style.right = '0px'

var renderStats = new Stats();
renderStats.setMode(0);
document.body.appendChild(renderStats.domElement);
renderStats.domElement.style.position = 'absolute'
renderStats.domElement.style.bottom = '0px'
renderStats.domElement.style.left = '0px'

//////////////////////////////////////////////////////////////////////////////////
//    Handle ui button
//////////////////////////////////////////////////////////////////////////////////
document.querySelector('#info .webcam').addEventListener('click', function (event) {
  location.hash = '#webcam'
  location.reload()
})

document.querySelector('#info .image').addEventListener('click', function (event) {
  location.hash = '#image'
  location.reload()
})

document.querySelector('#info .video').addEventListener('click', function (event) {
  location.hash = '#video'
  location.reload()
})

//////////////////////////////////////////////////////////////////////////////////
//    Init
//////////////////////////////////////////////////////////////////////////////////

// init renderer
var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// array of functions for the rendering loop
var onRenderFcts = [];

// init scene and camera
var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 2;

// Synchronous ajax request
// function getRemote() {
//     return $.ajax({
//         type: "GET",
//         url: remote_url,
//         async: false
//     }).responseText;
// }

/**
 * @param  repeatCard {string}   Do not repeat this card
 */
function getRandomCard(repeatCard) {
  var repeatPath = repeatCard || '';
  var path = 'images/'; // @NOTE change to correct asset directory

  // Grab Suit
  var suits = ['clu', 'dia', 'hea', 'spa'];
  var suit = suits[Math.floor(Math.random()*suits.length)];
  path += suit;

  // Grab number
  var number = Math.floor(Math.random() * 13) + 1;
  path += number.toString();

  path += '.png';

  if (path === repeatPath) {
    return getRandomCard(repeatPath);
  }

  return path;
}

var randomCards = [];
// Get two random cards
(function() {
  for (var i = 0; i < 2; i++) {
    var path;

    if (i > 0) {
      path = getRandomCard(randomCards[0]);
    } else {
      path = getRandomCard();
    }

    randomCards.push(path);
  }
})();

// Init game [Map]
var arIDToImagePath = [{
  id: 265,
  imageUrl: randomCards[0]
}, {
  id: 860,
  imageUrl: randomCards[1]
}];

//////////////////////////////////////////////////////////////////////////////////
//    create a markerObject3D
//////////////////////////////////////////////////////////////////////////////////

// Load 2 objects to mask over the object
var markerObject3DCollection = [];
var markerIds = [];
var i = 0;

// Loops through and adds the object as a scene
for (; i < 2; i++) {
  var markerObject3D = new THREE.Object3D();
  scene.add(markerObject3D);
  markerObject3DCollection.push(markerObject3D);

  //////////////////////////////////////////////////////////////////////////////////
  //    add an object in the markerObject3D
  //////////////////////////////////////////////////////////////////////////////////

  // add an object in the markerObject3D
  (function () {
    var geometry = new THREE.PlaneGeometry(1, 1, 10, 10)
    var material = new THREE.MeshBasicMaterial({
      wireframe: true
    })
    var mesh = new THREE.Mesh(geometry, material);
    markerObject3D.add(mesh);

    var mesh = new THREE.AxisHelper
    markerObject3D.add(mesh);
  })();
}

// On marker detected
window.addEventListener('markersDetected', function(e) {
  // Get IDs -- HARDCODED
  markerIds = e.detail;

  // markerId must be int
  markerIds.forEach(function(markerId, markerIndex) {
    // Get Images from the map
    var cardFromId = arIDToImagePath.find(function(card, cardIndex) {
      return card.id === markerId;
    });

    // If no object found, should throw error
    if (Object.keys(cardFromId).length === 0) {
      throw new Error('Could not find card from id ' + markerId)
    };

    // Load texture from found card
    var material = new THREE.SpriteMaterial({
      map: THREE.ImageUtils.loadTexture(cardFromId.imageUrl),
    });
    var geometry = new THREE.BoxGeometry(1, 1, 1)
    var object3d = new THREE.Sprite(material);
    object3d.scale.set(1, 1, 1);

    markerObject3DCollection[markerIndex].add(object3d);
  });

  window.removeEventListener('markersDetected');
});

// window.addEventListener('nextGameState', function() {});

//////////////////////////////////////////////////////////////////////////////////
//    render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////

// handle window resize
window.addEventListener('resize', function () {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}, false)


// render the scene
onRenderFcts.push(function () {
  renderStats.begin();
  if (webglRenderEnabled === true) {
    renderer.render(scene, camera);
  }
  renderStats.end();
})

// run the rendering loop
var previousTime = performance.now()
requestAnimationFrame(function animate(now) {

  requestAnimationFrame(animate);

  onRenderFcts.forEach(function (onRenderFct) {
    onRenderFct(now, now - previousTime)
  })

  previousTime = now
});

//////////////////////////////////////////////////////////////////////////////////
//    Do the Augmented Reality part
//////////////////////////////////////////////////////////////////////////////////


// init the marker recognition
var jsArucoMarker = new THREEx.JsArucoMarker()

// if no specific image source is specified, take the webcam by default
if (location.hash === '') location.hash = '#webcam'

// init the image source grabbing
if (location.hash === '#video') {
  var videoGrabbing = new THREEx.VideoGrabbing()
  jsArucoMarker.videoScaleDown = 2
} else if (location.hash === '#webcam') {
  var videoGrabbing = new THREEx.WebcamGrabbing()
  jsArucoMarker.videoScaleDown = 2
} else if (location.hash === '#image') {
  var videoGrabbing = new THREEx.ImageGrabbing()
  jsArucoMarker.videoScaleDown = 10
} else console.assert(false)

// attach the videoGrabbing.domElement to the body
document.body.appendChild(videoGrabbing.domElement);

//////////////////////////////////////////////////////////////////////////////////
//    Process video source to find markers
//////////////////////////////////////////////////////////////////////////////////

// Set dom element in global scope
var domElement = videoGrabbing.domElement;
var markers;

onRenderFcts.push(function () {
  // Find the markers on the video. Returns collection of markers
  detectMarkersStats.begin();
  markers = jsArucoMarker.detectMarkers(domElement);
  detectMarkersStats.end();

  // Send event that we need to set the images of the markerObject3D collection
  if (markers.length === 2 && markers[0].id !== markers[1].id) {
    var markerIds = markers.map(function(marker) { return marker.id });
    var markersDetectedEvent = new CustomEvent('markersDetected', { 'detail': markerIds });
    window.dispatchEvent(markersDetectedEvent);
  }
});

// @TODO update onRenderFcts next
markerObject3DCollection.forEach(function(markerObject3D, markerIndex) {
  // set the markerObject3D as visible
  markerObject3D.visible = false
  // process the image source with the marker recognition
  onRenderFcts.push(function () {
    if (detectMarkersEnabled === false) return

    // Grab dom element from THREEx video grabbing
    // var domElement = videoGrabbing.domElement;

    if (markerToObject3DEnabled === false) return
    markerObject3D.visible = false;

    // see if this.markerId has been found
    markers.forEach(function (marker) {
      if (marker.id === markerIds[markerIndex]) {
        jsArucoMarker.markerToObject3D(marker, markerObject3D)
        markerObject3D.visible = true
        return;
      }
    });
  });
});
