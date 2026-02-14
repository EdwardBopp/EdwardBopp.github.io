/* This file has utility functions for the video stream and camera operations. */
let streamVideo = null;


/**
 * This functio starts the video stream by making the video container visible, adding a black border to the video element 
 * and calling the startVideoStream function to access the camera and display the stream in the video element.
 */
function startVideo(){

  videoContainer.classList.remove("is-invisible");
  video.classList.add("black-border");
  startVideoStream(video);
}

/**
 * This function start the video stream from the camera and displays it in the given video element. 
 * It also sets the global variable streamVideo to the stream object, so that it can be used later to stop the stream or switch the camera. 
 * The cameraMode parameter can be either "environment" for the back camera or "user" for the front camera. The default value is "environment".
 * @param {*} videoElement The video element where the stream should be displayed.
 * @param {*} cameraMode The camera mode/type for the stream, either "environment" or "user". The default value is "environment".
 */
function startVideoStream(videoElement, cameraMode = "environment") {

  navigator.mediaDevices.getUserMedia({
      video: { facingMode: cameraMode } 
  }).then(stream => {

    streamVideo = stream;
    videoElement.srcObject = stream;
    videoElement.play();
      
  }).catch(err => {

    console.log("An error occurred: " + err);      
  });
}

/**
 * Closes the camera connection by stopping all tracks of the stream and setting the video element's source to null. 
 * It also sets the global variable streamVideo to null.
 * @param {*} video Video element whose source should be set to null after stopping the stream.
 */
function closeCameraConnection(video){

  for(const track of streamVideo.getTracks()) {
    track.stop();
  }

  video.srcObject = null;
  streamVideo = null;
}

/**
 * Switches the camera by closing the current camera connection and starting a new video stream with the opposite camera mode/type.
 * @param {*} video The video element where the new stream should be displayed after switching the camera.
 */
function switchCamera(video) {

  if (streamVideo) {
    const videoTracks = streamVideo.getVideoTracks();
    if (videoTracks.length > 0) {
      const currentFacingMode = videoTracks[0].getSettings().facingMode;
      const newFacingMode = currentFacingMode === "environment" ? "user" : "environment";
      closeCameraConnection(video);
      streamVideo = startVideoStream(video, newFacingMode);
    }
  }
}

/**
 * Takes a picture by drawing the current frame of the video stream onto a canvas element.
 * It also closes the camera connection after taking the picture.
 * @param {*} video The video element where the stream is displayed, which is used to get the current frame for taking the picture.
 * @param {*} canvasPicture The canvas element where the picture should be drawn after taking it.
 */

function takePicture(video, canvasPicture){

  const factor = video.videoWidth / video.videoHeight;
  canvasPicture.width = window.innerWidth * 0.4;
  canvasPicture.height = canvasPicture.width / factor;
  const ctx = canvasPicture.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(video, 0, 0, canvasPicture.width, canvasPicture.height);
  closeCameraConnection(video); 
}

function resetStream() {

  streamVideo = null;
}