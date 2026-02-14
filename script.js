/*-------Global variables for the game state-------*/

/* This list contains the snippets of the solution image in the correct order. 
It is used for checking whether the provided solution is correct and for providing hints to the user. */
const solutionImageSnippets = [];

/* This list contains the moves that the user has to do in order to solve the puzzle. It is used for providing hints to the user. */
const movesToSolution = [];

let nextDevice = "desktop_windows"; // This variable saves the next device mode that will be switched to if the user clicks the toggle button.
let rowsPuzzle = Number(inputAmountSnippets.value);
let indexForEmptySnippet = Math.floor(Math.random() * Math.pow(rowsPuzzle, 2)); //This variable saves the index of the empty snippet in the solution.
let lastSnippetCanvas = null;

let initDone = false;
let pictureTaken = false;
let controlsEnabled = true;


/**
 * This is the entry point of the game. We start the video for the user to take a picture, which will be used for the puzzle.
 * After starting the video, we hide the start button and show the shoot button, so that the user can take a picture when they are ready.
 */
startBtn.addEventListener("click", () => {

  try {
    
    startVideo(); 
    startBtn.classList.add("is-invisible");
    shootBtn.classList.remove("is-invisible");
  } catch (error) {
    console.error("Media access error happened: ", error);
    return;
  }
});

/**
 * This button allows the user to switch between the front and back camera. 
 */
switchCameraBtn.addEventListener("click", () => {
  switchCamera(video); 
});


/**
 * After successfully taking a picture we want to hide the video stream and show the picture that was taken.
 * We also show the options for the game and give the user the possibility to retake the picture if they are not satisfied with it.
 */
shootBtn.addEventListener("click", () => {

  makeInvisible([videoContainer, shootBtn]);
  makeVisible([pictures, labelShuffle, inputAmountSnippets, labelAmountSnippets, difficultySelect, labelDifficulty, retakePictureBtn]);
  canvasPicture.classList.add("black-border");
  takePicture(video, canvasPicture);
  pictureTaken = true;
});


/**
 * The grid format of the puzzle has to be changed based on the amount of snippets that the user wants to play with.
 */
inputAmountSnippets.addEventListener("input", () => {
  
  puzzle.style.cssText = getGridFormat(Number(inputAmountSnippets.value))
});

retakePictureBtn.addEventListener("click", () => {

  makeInvisible([labelShuffle, pictures, inputAmountSnippets, labelAmountSnippets, difficultySelect, labelDifficulty, shuffleBtn]);
  startVideo();
  shootBtn.classList.remove("is-invisible");
  
});

shuffleBtn.addEventListener("click", acceptPicture);

/**
 * Once the picture has been accepted, we want initialize the game and show the puzzle and riddle to the user.
 */
async function acceptPicture() { 

  makeInvisible([labelShuffle, inputAmountSnippets, labelAmountSnippets, difficultySelect, labelDifficulty, shuffleBtn, canvasPicture, retakePictureBtn]);
  await initGame();
  makeVisible([canvasPicture, puzzleControls]);
  initDone = true;
}


/**
 *  This function divides the picture into snippets and initializes the snippets with a click listener.
 *  It also shuffles the snippets and shows the controls for the puzzle. Finally it adds the click event listener to the last snippet, 
 *  which is not in the puzzle. It is replaced by the empty white snippet and will be added as the last missing snippet.
 *  By clicking on it it will check if the puzzle is solved.
 */
async function initGame(){

  puzzle.classList.add("black-border");
  solutionImageSnippets.push(...divideImage(canvasPicture, rowsPuzzle)); // Divide the original image into snippets and save them in the solution list.
  solutionImageSnippets.forEach((value) => {
    puzzle.append(initSnippet(value, snippetClicked)); // Add the snippets to the puzzle and add the click listener for selecting the snippets.  
  });

  await shuffle();

  // Here we get the last snippet, which will be the missing one in the puzzle. 
  let lastSnippet = Array.from(puzzle.children).find(elem => 
    equalsImageData(elem.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, elem.width, elem.height), solutionImageSnippets[indexForEmptySnippet])
  );

  // We create the empty snippet, which will replace the last snippet in the puzzle and will be the missing one that the user has to find.
  emptySnippet.width = lastSnippet.width;
  emptySnippet.height = lastSnippet.height;
  emptySnippet.addEventListener("click", snippetClicked);
  const ctx = emptySnippet.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#f4f7f6";
  ctx.fillRect(0, 0, lastSnippet.width, lastSnippet.height);

  puzzle.replaceChild(emptySnippet, lastSnippet); // Replace the last snippet with the empty snippet

  puzzleControls.getElementsByClassName("flex-layout")[0].lastChild.remove();
  puzzleControls.getElementsByClassName("flex-layout")[0].appendChild(lastSnippet); // Add last snippet to the controls
  lastSnippet.classList.add("fade-in"); // Animation for the last snippet in the controls
  lastSnippet.classList.add("black-border");
  lastSnippetCanvas = lastSnippet;
  lastSnippetCanvas.removeEventListener("click", snippetClicked); 

  // Here we add the click event listener to the last snippet in the controls, which is not in the puzzle. By clicking on it, it will check if the puzzle is solved.
  lastSnippetCanvas.addEventListener("click", async () => {

    if(gameWon()) {
    
      // If the game is won, we want to add the last snippet to the puzzle by replacing the empty snippet and show the game won message. 
      lastSnippetCanvas.classList.remove("black-border"); 
      lastSnippetCanvas.classList.add("fade-out");
      await new Promise((resolve, reject) => setTimeout(resolve, 900));
      puzzle.replaceChild(lastSnippetCanvas, emptySnippet);
      lastSnippetCanvas.classList.remove("fade-out");
      lastSnippetCanvas.classList.add("fade-in");
      setTimeout(() => {
        lastSnippetCanvas.classList.remove("fade-in");
        lastSnippetCanvas = null;
      }, 1000);
      
      // The whole puzzle gets a green border to indicate that the puzzle is solved. 
      puzzle.classList.remove("black-border");
      puzzle.style.border = "3px solid #00E676";
      changeSelectedSnippet(null);

      gameWonMessage.classList.remove("is-invisible"); // Show the game won message
      removeAllListenersSnippets(snippetClicked); // Remove the click listeners from the snippets, so that the user cannot click on them anymore after winning the game.
      puzzleControls.classList.add("is-invisible"); // Hide controls
    }else {

      missingSnippetText.innerText = "The puzzle is not solved yet. Keep trying!";
      setTimeout(() => {
        missingSnippetText.innerText = "Click for completing the puzzle";
        
      }, 2000);
    }
  });
  console.log(missingSnippetText);
  missingSnippetText.classList.add("is-visible");
}

/**
 * This function shuffles the snippets randomly.
 */
async function shuffle(){

  const directionValues = Object.values(directions);
  let direction = null;
  let j = null;
  let lastMove = null;
  selectedSnippet = puzzle.children[indexForEmptySnippet];

  let shuffleSteps = 0;

  switch(difficultySelect.value.toString()) {

    case "easy":

      shuffleSteps = 10;
      break;

    case "medium":

      shuffleSteps = 20;
      break;

    case "hard":
  
      shuffleSteps = 30;
  }

  // Based on the selected difficulty, we shuffle the snippets. We save the shuffle for the solution, so that we can provide hints to the user later.
  for (let i = 0; i < shuffleSteps; i++) {

    j = Math.floor(Math.random() * 4); 
    direction = directionValues[j];

    if(oppositeDirections[direction] === lastMove || !swapSnippetsBasedOnDirection(direction)) {
      i--;
      continue;
    }
    
    lastMove = direction;
    movesToSolution.push(oppositeDirections[direction]);
    await new Promise((resolve, reject) => setTimeout(resolve, 50)); 
  }

  selectedSnippet = null; 
}

/**
 * Checks if the current state of the puzzle is the same as the solution. If it is, it returns true, otherwise false.
 * @returns Whether the game is won.
 */
function gameWon(){

  const imageSnippets = puzzle.children;
  let imageSnippet;
  
  if(imageSnippets.length != solutionImageSnippets.length) throw new Error("Puzzle length and solution length are different!");

  for(let i = 0; i < imageSnippets.length; i++){

    imageSnippet = imageSnippets[i] == emptySnippet ? lastSnippetCanvas : imageSnippets[i];
    imageSnippet = imageSnippet.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, imageSnippet.width, imageSnippet.height);
    if(!equalsImageData(imageSnippet, solutionImageSnippets[i])) return false;
  }

  return true;
}


/**
 * This button resets the game state to the initial state for restarting the game.
 */
playAgainBtn.addEventListener("click", () => {

  makeInvisible([gameWonMessage, pictures]);
  startBtn.classList.remove("is-invisible");
  inputAmountSnippets.setAttribute("value", "3");
  rowsPuzzle = Number(inputAmountSnippets.value);
  indexForEmptySnippet = Math.floor(Math.random() * Math.pow(rowsPuzzle, 2));
  solutionImageSnippets.length = 0;
  selectedSnippet = null;
  resetStream();
  lastSnippetCanvas = null; 
  initDone = false;
  pictureTaken = false;
  puzzle.innerHTML = "";
  puzzle.style.cssText = "";
  movesToSolution.length = 0;
  emptySnippet.style.cssText = "";
});

/**
 * This button/function allows the user to save the picture they took in the sidebar, so that they can use it later
 * for playing the puzzle again.
 */
savePictureBtn.addEventListener("click", () => {

  if(sidebarContent.children.length < 10){ // Limit for the amount of saved pictures

    const wrapper = document.createElement("div");
    wrapper.classList.add("saved-canvas-container");

    const canvas = copyCanvas(canvasPicture); // Copy the canvas to save the picture
    canvas.style.cursor = "pointer";
    canvas.classList.add("saved-canvas");
    canvas.classList.add("black-border");

    /* Once a picture in the sidebar is clicked, we want to reset the game state and start a new game with the selected picture. */
    canvas.addEventListener("click", () => {

      arrow.click(); // Close sidebar
      makeInvisible(main.children);
      solutionImageSnippets.length = 0; 
      selectedSnippet = null;
      resetStream();
      lastSnippetCanvas = null;
      initDone = false;
      pictureTaken = true;
      puzzle.innerHTML = "";
      puzzle.style.cssText = "";
      puzzle.classList.remove("black-border");
      puzzle.style.cssText = getGridFormat(Number(inputAmountSnippets.value));
      movesToSolution.length = 0;
      emptySnippet.style.cssText = "";
      makeVisible([labelShuffle, pictures, inputAmountSnippets, labelAmountSnippets, difficultySelect, labelDifficulty, retakePictureBtn]); 
      canvasPicture.getContext("2d", { willReadFrequently: true }).drawImage(canvas, 0, 0, canvasPicture.width, canvasPicture.height); // Take saved picture as new picture for the puzzle
    });

    wrapper.appendChild(canvas); // Wrapper contains the saved picture and the delete button for deleting the saved picture from the sidebar.
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "✖";
    deleteButton.classList.add("remove-button-style");
    deleteButton.addEventListener("click", () => {

      sidebarContent.removeChild(wrapper);
    });
    wrapper.appendChild(deleteButton);
    sidebarContent.appendChild(wrapper);
  
  }
  
});


/**
 * This funtion moves the current selected snippet in the given direction. If the selected snippet is the empty snippet, it moves the neighboring snippet in the given direction to the empty snippet.
 * @param {*} direction The direction to move in. It can be "up", "down", "left" or "right".
 */
async function move(direction){
  
  if (selectedSnippet === null) {
   
    return;
  }

  let selectedSnippetIsEmpty = selectedSnippet === emptySnippet;
  indexOfEmpty = Array.from(puzzle.children).indexOf(emptySnippet);
  const adjDirection = adjacentDirection(getIndexOfSnippet(selectedSnippet), indexOfEmpty);

  /* We want to only move the selected snippet if it is adjacent to the empty snippet and not the empty snippet.*/
  if((adjDirection == null || adjDirection !== direction) && !selectedSnippetIsEmpty) {     
    return;
  }

  /*If the selected snippet is the empty snippet, we want to move the neighboring snippet in the given direction to the empty snippet.*/
  if (selectedSnippetIsEmpty) {

    const neighbor = getNeighborSnippetBasedOnDirection(direction);
    if(neighbor == null) return;
    selectedSnippet = neighbor;
    direction = oppositeDirections[direction];
  }

  controlsEnabled = false; // While the move animation is running, we want to disable the controls to prevent multiple moves at the same time.
  selectedSnippet.classList.add("fade-out");
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  swapSnippetsBasedOnDirection(direction);
  selectedSnippet.classList.remove("fade-out");
  selectedSnippet.classList.add("fade-in");
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  selectedSnippet.classList.remove("fade-in");
  controlsEnabled = true;

  if(selectedSnippetIsEmpty){

    selectedSnippet = emptySnippet;
    checkMove(oppositeDirections[direction]); // We always check whether the move is correct.
    
  }else {

    checkMove(oppositeDirections[direction]);
  }
}

moveOneStepBtn.addEventListener("click", moveOneStep);
solvePuzzleBtn.addEventListener("click", solvePuzzle);

/**
 * This function moves the snippets step by step in the correct order to solve the puzzle. 
 * It is used for providing hints to the user and for solving the puzzle if the user wants to give up.
 * Controls are disabled while the solution is being executed to prevent multiple moves at the same time and to prevent the user from interfering with the solution.
 */
async function solvePuzzle(){

  moveOneStepBtn.disabled = true;
  solvePuzzleBtn.disabled = true;
  controlsEnabled = false;

  for (let i = movesToSolution.length; i > 0; i--){

    await moveOneStep();
  }
  lastSnippetCanvas.click();
  moveOneStepBtn.disabled = false;
  solvePuzzleBtn.disabled = false;
  controlsEnabled = true;
}

/**
 * This function moves the snippets one step in the correct order to solve the puzzle. It is used for providing hints to the user.
 */
async function moveOneStep(){

  moveOneStepBtn.disabled = true;
  solvePuzzleBtn.disabled = true;
  controlsEnabled = false;
  changeSelectedSnippet(emptySnippet);
  await move(movesToSolution[movesToSolution.length - 1]);
  moveOneStepBtn.disabled = false;
  solvePuzzleBtn.disabled = false;
  controlsEnabled = true;
}

/**
 * Checks whether the provided move is the correct move in the solution.
 */
function checkMove(direction){
 
  if(direction === movesToSolution[movesToSolution.length - 1]){

    // Remove the last move from the solution, since the user has done the correct move.
    movesToSolution.pop();  
  }else{

    // If the move is not correct, we want to add the opposite move to the solution, so that the user can still solve the puzzle by following the moves in the solution.
    movesToSolution.push(oppositeDirections[direction]);
  } 
}