//David's Electric Teaching fix to Flash on Chrome 4/23/20 (Covid-19 time)
// Stated as Scripts for making a puzzle on our website. Girls Coding Club 2016-2017
// Using square grid to start with a single image of converted puzzle pieces
// first row will be functions and checked, below in order or not, match will win

// global variables
var canvas, ctx, dragging, w=512, h=512;
var canvasOffset, offsetX, offsetY;

// load up the canvas
function init() {
	//load canvas
	canvas = document.getElementById("puzzleCanvas");
	ctx = canvas.getContext("2d"), canvas.width = w, canvas.height = h;
	canvasOffset = $("#puzzleCanvas").offset();
	offsetX = Math.round(canvasOffset.left),
	offsetY = Math.round(canvasOffset.top);    
	canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);

	// alternative ways of using a button on the html
	//document.getElementById("loadPuzzleButton").addEventListener("click",function() { loadPuzzle();});
	//document.getElementById("changeDifficultyButton").addEventListener("click",function() { changeSize();});

	// loadPuzzle will do everything but load the picture. that's okay the button will :)
	initArrays();
	loadPuzzle();
} // end init

// setting up the number of side width to 4 and side height to 3 and number of pieces	
// 3 x 4 electric teaching puzzle
// the startClip and sectionWidth is for cropping to just a section of the image
var sidesWidth = 4;
var sidesHeight = 4;
var pieces = sidesWidth*sidesHeight;
var startClipX = w/sidesWidth;
var startClipY = h/sidesHeight;
var sectionWidth = w/sidesWidth;
var sectionHeight = h/sidesHeight;

// loading up the puzzle images
var imageObj = new Image();
imageObj.src = 'NewEponential.jpg';

// creating arrays for the pieces of the puzzle to hold x, y, and piecenumber.
var piecesArray=new Array();
function Piece() {
	var pieceNumber;
	var x;
	var y;
	var r;
	var c;
}
var slotArray=new Array();
function Slot() {
	var Piece
	var slotNumber;
	var x;
	var y;
	var r;
	var c;
}
function initArrays() {
	for (var i = 0; i < pieces; i++) {
	 	piecesArray[i] = new Piece();
	 	slotArray[i] = new Slot();
	 	piecesArray[i].pieceNumber = i;
	 	slotArray[i].slotNumber = i; 
	 	slotArray[i].Piece = piecesArray[i];
	} 
	for (var i = 0; i < sidesHeight; i++) {
		for (var j = 0; j < sidesWidth; j++) {
			var index = (i*sidesHeight)+j;
			piecesArray[index].x = j*sectionWidth;
			piecesArray[index].y = i*sectionHeight;
			piecesArray[index].r = i;
			piecesArray[index].c = j;
			slotArray[index].x = j*sectionWidth;
			slotArray[index].y = i*sectionHeight;
			slotArray[index].r = i;
			slotArray[index].c = j;
		}
	}
	shuffle(slotArray);
}// end initArray

// Fisher-Yates shuffle of randomly building a new list
function shuffle(array) {
	var currentIndex = array.length, tempValue, randomIndex;

	// keep selecting elements until list is gone
	while (currentIndex!==0) {
		// pick an element from list randomly 
		randomIndex = Math.floor(Math.random()*currentIndex);
		currentIndex -= 1;

		// swap with last element
		tempValue = array[currentIndex].Piece;
		array[currentIndex].Piece= array[randomIndex].Piece;
		array[randomIndex].Piece=tempValue;
	}
}

// load picture for puzzle
function loadPuzzle() {
	ctx.clearRect(0,0,w,h)
	ctx.fillStyle = "lightblue";
	ctx.fillRect(0,0,w,h)

	// after the image parameter, these are the rest in order IMAGE MUST BE SAME SIZE AS CANVAS!
	// startClipX, startClipY, width of clip, height of clip, location x, location y, width, height
	for (var tempIndex=0; tempIndex<pieces; tempIndex++) {
		var tempPiece = slotArray[tempIndex].slotNumber;
		ctx.drawImage(imageObj, slotArray[tempPiece].Piece.x, slotArray[tempPiece].Piece.y, sectionWidth, sectionHeight, slotArray[tempIndex].x, slotArray[tempIndex].y, sectionWidth, sectionHeight);
	}
} // end loadPuzzle

//  determining the current piece when mouse is down
function doMouseDown() {
  	canvas.addEventListener("mousemove", doMouseMove, false);
  	mouseX = event.clientX-offsetX;
  	mouseY = event.clientY-offsetY;
	currentMovingFromPiece = getCurrentPiece(mouseX, mouseY);
	dragging =true;
}  // end doMouseDown

function doMouseMove() {
  	if (dragging){
  		mouseX = event.clientX-offsetX;
  		mouseY = event.clientY-offsetY;
  		loadPuzzle();
  		var piece = slotArray[currentMovingFromPiece].Piece;
  		ctx.drawImage(imageObj, piece.x, piece.y, sectionWidth, sectionHeight, mouseX-.5*sectionWidth, mouseY-.5*sectionHeight, sectionWidth, sectionHeight);
  	}	
}  // end doMouseMove

function doMouseUp() {
	if (dragging) {
		dragging = false;
	  	mouseX = event.clientX-offsetX;
  		mouseY = event.clientY-offsetY;
		currentMovingToPiece = getCurrentPiece(mouseX, mouseY)
		// swap with last element
		tempValue = slotArray[currentMovingToPiece].Piece;
		slotArray[currentMovingToPiece].Piece= slotArray[currentMovingFromPiece].Piece;
		slotArray[currentMovingFromPiece].Piece=tempValue;
		
	} // endIf 
	loadPuzzle();

	canvas.removeEventListener("mousemove", doMouseMove, false);
}  // end doMouseUp

// check if puzzle is correct
function piecesCorrect() {
	var topRow = 0;
	var piecesSolved = 0;
		//check for first row functions
	for (var int = 0; int<sidesWidth; int++) {
		if (slotArray[int].Piece.r == 0) {
			topRow ++;
		}
		console.log(slotArray[int].Piece.r, topRow);
	}
	if (topRow != sidesWidth) {
		ctx.fillStyle = "red";
		ctx.font = "26px Arial Bold";
		ctx.fillText("Functions names need to be in top row",20,110);
		return;
	}
	// check for all items in same column
	for (var int=0; int<sidesWidth; int++) {
		var slotc = slotArray[int].Piece.c;
		for (var jint=int+sidesWidth; jint<pieces;jint=jint+sidesWidth){
			if (slotArray[jint].Piece.c==slotc) {piecesSolved++;}
			console.log(slotArray[jint].Piece.c, piecesSolved);
		}
	}
	if (piecesSolved == pieces-sidesWidth) {
		ctx.fontStyle = "Green";
		ctx.font = "40px Arial Bold";
		ctx.fillText("Puzzle Solved! Nice job!",40,40);
	}
	else {
		ctx.fontStyle = "Orange";
		ctx.font = "40px Arial Bold";
		ctx.fillText("Not solved yet - keep going.",40,40);
	}
} //end piecescorrect()

// check for mouse location and current piece
function getCurrentPiece(x, y) {
	// checking which column by x index jumping at section widths
	var xIndex = 0;
	var tempSectionWidth = sectionWidth;
	while (x >= tempSectionWidth) {
		xIndex++;
		tempSectionWidth += sectionWidth;
	}
	// checking which column by y index jumping at section heights	
	var yIndex = 0;
	var tempSectionHeight = sectionHeight;
	while (y >= tempSectionHeight) {
		yIndex++;
		tempSectionHeight += sectionHeight;
	}

	var pieceIndex = xIndex + (yIndex * sidesHeight);
	return pieceIndex;
} //getCurrentPiece()

// for reshuffle buton
function reshuffle() {shuffle(slotArray); loadPuzzle();}
