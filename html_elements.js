/*-------HTML Elements are saved for easy access-------*/ 

const main = document.getElementsByTagName("main")[0];

/* Toggling option between mobile and desktop mode */
const togglePcModeBtn = document.getElementById("btnTogglePCmode");

/* Provides the entry point for the game */
const startBtn = document.getElementById("btnStart");

/* Live preview for taking a picture */ 
const video = document.getElementById("video"); 
const videoContainer = document.getElementById("videoContainer");
const switchCameraBtn = document.getElementById("btnSwitchCamera");
const shootBtn = document.getElementById("btnShoot");

/* Elements for the puzzle game */
const pictures = document.getElementById("pictures"); 
const canvasPicture = document.getElementById("canvasTakenPicture"); 
const puzzle = document.getElementById("puzzle"); 
const retakePictureBtn = document.getElementById("retakePicture"); 

/* Options for the game */
const inputAmountSnippets = document.getElementById("amountSnippets");
const labelAmountSnippets = document.getElementById("labelAmountSnippets");
const difficultySelect = document.getElementById("difficulty");
const labelDifficulty = document.getElementById("labelDifficulty");

/* Shuffle Controls*/
const labelShuffle = document.getElementById("labelShuffle");
const shuffleBtn = document.getElementById("btnShuffle");

/* Hints for solving the puzzle */
const puzzleControls = document.getElementById("puzzleControls");
const solvePuzzleBtn = document.getElementById("btnSolvePuzzle");
const moveOneStepBtn = document.getElementById("btnMoveOneStep");

/* Sidebar */
const arrow = document.getElementById("arrow");
const sidebar = document.getElementsByClassName("sidebar")[0];
const sidebarContent = document.getElementById("sidebarContent");

/* Information about the game */
const info = document.getElementById("info");
const infoBtn = document.getElementById("btnInfo");
const closeInfoBtn = document.getElementById("btnCloseInfo");

/* Navigation after the game was won */
const gameWonMessage = document.getElementById("gameWonMessage");
const playAgainBtn = document.getElementById("btnPlayAgain");
const savePictureBtn = document.getElementById("btnSavePicture");

/* This element is used as a placeholder in the puzzle for the empty snippet */
const emptySnippet = document.createElement("canvas");