/**
 * Compare two image data objects for equality.
 * @param {*} img1 First image data object to compare.
 * @param {*} img2 Second image data object to compare.
 * @returns Whether the two image data objects are equal.
 */
function equalsImageData(img1, img2){

  const img1Data = img1.data;
  const img2Data = img2.data;

  if (img1Data.length != img2Data.length) return;
  
  for (let i = 0; i < img1Data.length; i++){

    if(img1Data[i] != img2Data[i]) return false;

  }

  return true;
}

/**
 * Divides the image in the provided canvas into snippets based on the number of rows in the puzzle.
 * @param {*} canvasPicture Picture to divide into snippets.
 * @param {*} rowsPuzzle Number of rows in the puzzle, which is used to determine the size of the snippets.
 * @returns An array of image data objects representing the snippets.
 */
function divideImage(canvasPicture, rowsPuzzle){

  const snippets = [];
  const heightImg = canvasPicture.height;
  const widthImg = canvasPicture.width;
  const widthImgSection = widthImg / rowsPuzzle;
  const heightImgSection = heightImg / rowsPuzzle;
  const contextOfCanvas = canvasPicture.getContext("2d", { willReadFrequently: true });
  
  for(let y = 0; y < heightImg; y += heightImgSection) {

    for(let x = 0; x < widthImg; x += widthImgSection){

      snippets.push(contextOfCanvas.getImageData(x, y, widthImgSection, heightImgSection));
      
    }   
  }
  return snippets;
}

/**
 * Copies the given canvas and return the copy.
 * @param {*} sourceCanvas Canvas to copy.
 * @returns A copy of the given canvas.
 */
function copyCanvas(sourceCanvas){

  const newCanvas = document.createElement("canvas");
  newCanvas.width = sourceCanvas.width;
  newCanvas.height = sourceCanvas.height;
  const srcCtx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  const copyCtx = newCanvas.getContext("2d", { willReadFrequently: true });
  copyCtx.putImageData(srcCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height), 0, 0);

  return newCanvas;
}

/**
 * Replaces the elements in a parent node by swapping the positions of the two given elements.
 * @param {*} element1 
 * @param {*} element2 
 */
function swapSnippets(element1, element2){

  if(element1 == element2) throw new Error("Both elements to swap are the same!");
  if(!element1 || !element2) throw new Error("One of the elements to swap is null or undefined!");

  const parent = element1.parentNode;
  const copy = copyCanvas(element1);
  parent.replaceChild(copy, element1);
  parent.replaceChild(element1, element2);
  parent.replaceChild(element2, copy);
  
}