// Face Mesh Demo by Andy Kong
// Base Javascript for setting up a camera-streaming HTML webpage.

async function setupCamera() {
  // Find the <video> element in the webpage,
  // then use the mediaDevices API to request a camera from the user
  video = document.getElementById("video");
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
  });
  // Assign our camera to the HTML's video element
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function drawVideo() {
  // Draw the video stream into our screen
  ctx.drawImage(video, 0, 0);
  // Call self again
  requestAnimationFrame(drawVideo);
}

// Set up variables to draw on the canvas
var canvas;
var ctx;
async function main() {
  // Set up front-facing camera
  await setupCamera();
  videoWidth = video.videoWidth;
  videoHeight = video.videoHeight;
  video.play();

  // Set up the HTML Canvas to draw the video feed onto
  canvas = document.getElementById("facecanvas");
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  ctx = canvas.getContext("2d");

  // Start the video->canvas drawing loop
  drawVideo();
}
