/* This file contains the directions and the function to determine the direction between two snippets. */
const directions = Object.freeze({
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down"
});


const oppositeDirections = {
  [directions.LEFT]: directions.RIGHT,
  [directions.RIGHT]: directions.LEFT,
  [directions.UP]: directions.DOWN,
  [directions.DOWN]: directions.UP
};


function adjacentDirection(index1, index2) {

  if(index1 - rowsPuzzle == index2) return directions.UP;
  else if(index1 + rowsPuzzle == index2) return directions.DOWN;
  else if(index1 - 1 == index2) return directions.LEFT;
  else if(index1 + 1 == index2) return directions.RIGHT;
  return null;
}
