// Camera setup function - returns a Promise so we have to call it in an async function
async function setupCamera() {
  // Find the video element on our HTML page
  video = document.getElementById("video");

  // Request the front-facing camera of the device
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      height: { ideal: 1920 },
      width: { ideal: 1920 },
    },
  });
  video.srcObject = stream;

  // Handle the video stream once it loads.
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

var curFaces = [];
async function renderPrediction() {
  // Call face Mesh on our video stream
  const facepred = await fmesh.estimateFaces(video);

  // If we find a face, export it to a global variable so we can access it elsewhere
  if (facepred.length > 0) {
    curFaces = facepred;
  }
  // Call itself again
  requestAnimationFrame(renderPrediction);
}

function drawWebcamContinuous() {
  ctx.drawImage(video, 0, 0);
  for (face of curFaces) {
    drawFace(face);
  }
  requestAnimationFrame(drawWebcamContinuous);
}

// Draws the current eyes onto the canvas, directly from video streams
async function drawFace(face) {
  ctx.fillStyle = "cyan";
  for (pt of face.scaledMesh) {
    ctx.beginPath();
    ctx.ellipse(pt[0], pt[1], 2, 2, 0, 0, 2 * Math.PI);
    ctx.fill();
  }
}

var canvas;
var ctx;
var fmesh;

async function main() {
  fmesh = await facemesh.load({ detectionConfidence: 0.9, maxFaces: 1 });

  // Set up front-facing camera
  await setupCamera();
  video.play();

  // Set up canvas for livestreaming
  canvas = document.getElementById("facecanvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx = canvas.getContext("2d");

  renderPrediction();
  // Start continuous drawing function
  drawWebcamContinuous();

  console.log("Camera setup done");
}

// Delay the camera request by a bit, until the main body has loaded
document.addEventListener("DOMContentLoaded", main);
