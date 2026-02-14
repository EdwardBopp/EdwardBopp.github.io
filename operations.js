/** This file has utility functions for the operation of the puzzle 
 * and the website in general. 
 */ 

function makeInvisible(elements){

  for(let elem of elements){  
    elem.classList.add("is-invisible");
  }
}

function makeVisible(elements){

  for(let elem of elements){  
    elem.classList.remove("is-invisible");
  }
}

/**
 * This function returns a string with the grid format for the puzzle, depending on the amount of snippets in one row/column. 
 * It also sets the global variables rowsPuzzle and indexForEmptySnippet.
 * @param {Number} amountSnippets The amount of snippets in one row/column of the puzzle.
 * @returns The grid format for the puzzle as a string.
 */
function getGridFormat(amountSnippets){

  rowsPuzzle = amountSnippets;
  indexForEmptySnippet = Math.floor(Math.random() * Math.pow(rowsPuzzle, 2));

  const gridFormat = `
    grid-template-columns: repeat(${rowsPuzzle}, 1fr);
    grid-template-rows: repeat(${rowsPuzzle}, 1fr);
  `;

  return gridFormat;
}

togglePcModeBtn.addEventListener("click", togglePCmode);
/**
 * This function changes the next device mode/type for the puzzle.
 * It also changes the title of the button and the visibility of the shuffle button, depending on the mode.
 * The shuffle button is only visible in desktop mode, if a picture has been taken and the puzzle has not been initialized yet.
 */
function togglePCmode(){

  const icon = document.getElementById("iconTogglePCmode");
  nextDevice = icon.innerText;
  nextDevice = nextDevice === "mobile" ? "desktop_windows" : "mobile";
  icon.innerText = nextDevice;
  

  if(nextDevice === "mobile") {

    if(pictureTaken && !initDone) shuffleBtn.classList.remove("is-invisible");
    togglePcModeBtn.title = "Change to Mobile";

  
  } else {

    shuffleBtn.classList.add("is-invisible");
    togglePcModeBtn.title = "Change to PC";
  }
}

arrow.addEventListener("click", toggleArrow);
/**
 * This function toggles the visibility of the sidebar and changes the arrow icon accordingly.
 */
function toggleArrow(){

  sidebar.classList.toggle("sidebarAfterAnimation");
  arrow.innerText = arrow.innerText == "arrow_left" ? "arrow_right" : "arrow_left";
}




