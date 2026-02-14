let selectedSnippet = null; // Tracks the currently selected snippet. It is initialized to null, meaning that no snippet is selected at the beginning.

/**
 * Gets the index of the given snippet in the puzzle container.
 * @param {*} snippet The given snippet to search for in the puzzle container.
 * @returns The index of the given snippet in the puzzle container, or -1 if the snippet is null.
 */
function getIndexOfSnippet(snippet){

  if (snippet === null) return -1;

  return Array.from(puzzle.children).indexOf(snippet);
}

/**
 * Initializes a canvas element for a given image data value and adds a click event listener to it.
 * @param {*} value The image data value to be drawn on the canvas.
 * @param {*} listener The click event listener to be added to the canvas.
 * @returns The initialized canvas element.
 */
function initSnippet(value, listener){

  const canvasForSection = document.createElement("canvas");
  canvasForSection.height = value.height;
  canvasForSection.width = value.width;
  
  const ctxForSection = canvasForSection.getContext("2d", { willReadFrequently: true });
  ctxForSection.putImageData(value, 0, 0);
  canvasForSection.addEventListener("click", listener);
  return canvasForSection;
}

function removeAllListenersSnippets(listener){

  for(let snippet of puzzle.children){
    snippet.removeEventListener("click", listener);
  }
}

/**
 * Changes the currently selected snippet by updating the CSS styles of the previously selected snippet and the newly selected snippet.
 * @param {*} snippet The new snippet to be selected. If it is null, only the previously selected snippet will be updated and no new snippet will be selected.
 */
function changeSelectedSnippet(snippet=null){

  if(selectedSnippet !== null){
    selectedSnippet.style.cssText = `
    border: none;
    width: ${selectedSnippet.width}px;
    height: ${selectedSnippet.height}px;
    `;
    }

  if(snippet === null) return;

  snippet.style.cssText = `
    border: 2px solid #00E676;
    width: ${snippet.width - 4}px;
    height: ${snippet.height - 4}px;
  `;

  selectedSnippet = snippet;
}

/**
 * Lisenter function for the click event on the snippets. It changes the selected snippet to the clicked snippet if the initialization is done and the controls are enabled.
 * @param {*} event The click event on the snippet. The target of the event is the clicked snippet that should be selected.
 */
function snippetClicked(event){

  if(!initDone) return;
  if(!controlsEnabled) return;
  changeSelectedSnippet(event.target); 
}


/**
 * Selects the next snippet based on the given direction.
 * @param {*} direction The direction in which the next snippet should be selected.
 */
function selectSnippet(direction){

  if (selectedSnippet === null) {
   
    return;
  }

  const neighbor = getNeighborSnippetBasedOnDirection(direction);
  if (neighbor == null) return;
  changeSelectedSnippet(neighbor);
}

/**
 * Gets the neighboring snippet of the currently selected snippet based on the given direction.
 * @param {*} direction The direction in which the neighboring snippet should be retrieved.
 * @returns The neighboring snippet, or null if no neighbor exists in the given direction.
 */
function getNeighborSnippetBasedOnDirection(direction) {

  const indexOfSelected = getIndexOfSnippet(selectedSnippet);

  switch (direction) {

    case directions.LEFT:

      if(indexOfSelected % rowsPuzzle == 0) return null;
      return puzzle.children[indexOfSelected - 1];

    case directions.RIGHT:

      if((indexOfSelected + 1) % rowsPuzzle == 0) return null;
      return puzzle.children[indexOfSelected + 1];

    case directions.UP:

      if(indexOfSelected < rowsPuzzle) return null;
      return puzzle.children[indexOfSelected - rowsPuzzle];

    case directions.DOWN:
      
      if(indexOfSelected >= puzzle.children.length - rowsPuzzle) return null;
      return puzzle.children[indexOfSelected + rowsPuzzle];     
  }
}

/**
 * Swaps the currently selected snippet with its neighboring snippet based on the given direction.
 * @param {*} direction The direction in which the snippets should be swapped.
 * @returns Whether the swap was successful.
 */
function swapSnippetsBasedOnDirection(direction){

  const neighbor = getNeighborSnippetBasedOnDirection(direction);
  if(neighbor == null) return false;
  swapSnippets(selectedSnippet, neighbor);
  return true;
}




