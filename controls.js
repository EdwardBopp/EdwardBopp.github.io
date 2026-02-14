/* This file contains the necessary function for handling device motions and keyboard controls */

let lastTimeEvent = Date.now();
let screenOrientation = screen.orientation.type.toString();

screen.orientation.addEventListener("change", () => {

  screenOrientation = screen.orientation.type.toString();
});

/**
 * This function handles the controls for a mobile device by listening and processing data from the device's motion sensors. 
 */
if("DeviceMotionEvent" in window){

  window.addEventListener("devicemotion", function(event) {

    
    if(!controlsEnabled) return; // At some parts of the game the controls are disable to avoid unwanted movements.

    const rotationRate = event.rotationRate;
    const alpha = rotationRate.alpha;
    const beta = rotationRate.beta;   
    const gamma = rotationRate.gamma;

    const acceleration = event.acceleration;
    const accX = acceleration.x;
    const accY = acceleration.y;
    const accZ = acceleration.z;
    const orientationLandScape = screenOrientation.startsWith("landscape");

    // The conditions for triggering an event and the corresponding direction.
    const conditions = [

    [(alpha < -150) && !orientationLandScape, directions.UP, "rotation"],
    [(alpha > 150) && !orientationLandScape, directions.DOWN, "rotation"],
    [(gamma > 100), directions.LEFT, "rotation"],
    [(gamma < -100), directions.RIGHT, "rotation"],
    [(beta > 100) && orientationLandScape, directions.UP, "rotation"],
    [(beta < -100) && orientationLandScape, directions.DOWN, "rotation"],
    [(accY > 3), orientationLandScape ? directions.LEFT : directions.UP, "acceleration"],
    [(accY < -3), orientationLandScape ? directions.RIGHT : directions.DOWN, "acceleration"],
    [(accX > 3), orientationLandScape ? directions.UP : directions.RIGHT, "acceleration"],
    [(accX < -3), orientationLandScape ? directions.DOWN : directions.LEFT, "acceleration"],
    [(accZ > 10) || (accZ < -10), "shake", "acceleration"]

    ];

    const triggeredEvent = conditions.find(condition => condition[0]);

    if(triggeredEvent) {

      let now = Date.now();
      // To avoid triggering multiple events in a short time, we check if at least 1 second has passed since the last triggered event.
      if(now - lastTimeEvent < 1000) return;
      lastTimeEvent = now;

      if (triggeredEvent[2] === "rotation") {
        //Rotation events mean, that the user wants to move the snippets
        move(triggeredEvent[1]);     

      }else {
       
        if(triggeredEvent[1] === "shake" && !initDone && pictureTaken) {
          //Shaking indicates that the user wants to accept the picture and start the game.
          acceptPicture();
          return;
        }else if (triggeredEvent[1] !== "shake") {

          //Acceleration events mean, that the user wants to select a snippet
          selectSnippet(triggeredEvent[1]);
        }      
      }
    }
  });
}

/**
 * This function handles the controls for a desktop device by listening and processing keyboard events. 
 * The arrow keys and the WASD keys can be used to move or select snippets, respectively.
 */
document.addEventListener("keydown", (event) => {

  if(!controlsEnabled) return;

  if (nextDevice === "desktop_windows") return;

  const keyname = event.key;
  switch(keyname) {

    case "ArrowLeft":
      move(directions.LEFT);
      break;
  
    case "ArrowRight":
      move(directions.RIGHT);
      break;

    case "ArrowUp":
      move(directions.UP);
      break;

    case "ArrowDown":
      move(directions.DOWN);
      break;

    case "a":
      selectSnippet(directions.LEFT);
      break;

    case "d":
      selectSnippet(directions.RIGHT);
      break;

    case "w":
      selectSnippet(directions.UP);
      break;

    case "s":
      selectSnippet(directions.DOWN);
      break;
      
  }
});