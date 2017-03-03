var ticTacToeModule = (function() {
    var startScreen = document.getElementById('start');
    var boardScreen = document.getElementById('board');
    var endScreen = document.getElementById('finish');
    var startButton = document.getElementById('start-button');
    var player1Box = document.getElementById('player1');
    var player2Box = document.getElementById('player2');
    var boxes = document.getElementsByClassName('box');
    var endGameMessage = document.getElementById('end-game-message');
    var newGameButton = document.getElementById('new-game-button');
    var player1NameField = document.getElementById('player1-name');
    var player2NameField = document.getElementById('player2-name');
    var computerCheckbox = document.getElementById('computer');
    var playerNamesDisplay = document.getElementsByClassName('player-name');
    var player2Name = '';
    var player1Name = '';
    var theBoard = ["E","E","E","E","E","E","E","E","E"];
    var gameState = 'running';
    var activeTurn = "human";
    var choice;

    // Initial game setup
    var activePlayer = 1;
    boardScreen.style.display = 'none';
    endScreen.style.display = 'none';
    player1Box.classList.add('active');
    player2Box.classList.remove('active');

    //start screen event handlers (play against computer checkbox)
    computerCheckbox.addEventListener('change', function(){
        if(computerCheckbox.checked){
            player2NameField.disabled = true;
            player2NameField.value = 'Computer';
            player2Name = 'computer';
        } else {
            player2NameField.disabled = false;
            player2NameField.value = '';
            player2Name = '';
        }
    });

    //(start button)
    startButton.addEventListener('click', function () {
        if (player1NameField.value === '' || player2NameField === '' ){
            alert('Please enter the players name or choose computer opponent!')
        } else {
            startScreen.style.display = 'none';
            boardScreen.style.display = '';
            player1Name = player1NameField.value;
            player2Name = player2NameField.value;
            playerNamesDisplay[0].innerText = player1Name;
            playerNamesDisplay[1].innerText = player2Name;

        }
    });

    //end screen event handler (new game button)
    newGameButton.addEventListener('click', function () {
        endScreen.style.display = 'none';
        startScreen.style.display = '';
        player1Box.classList.add('active');
        player2Box.classList.remove('active');
        endScreen.className.remove('screen-win-one');
        endScreen.classList.remove('screen-win-two');
        endScreen.classList.remove('screen-win-tie');
        activePlayer = 1;
        player2Name = '';
        player1Name = '';
        player1NameField.value = '';
        player2NameField.value = '';
        computerCheckbox.checked = false;
        player2NameField.disabled = false;
        for (var i = 0; i < boxes.length; i++) {
            boxes[i].classList.remove('box-filled-1');
            boxes[i].classList.remove('box-filled-2');
        }
        theBoard = ["E","E","E","E","E","E","E","E","E"];
    });


    // board boxes event handlers
    for (var i = 0; i < boxes.length; i++) {
        (function (boxIndex) {
            boxes[i].addEventListener('mouseover', function () {
                if (!boxes[boxIndex].classList.contains('box-filled-1') && !boxes[boxIndex].classList.contains('box-filled-2')) {
                    if (activePlayer === 1) {
                        boxes[boxIndex].style.backgroundImage = 'url("img/o.svg")';
                    } else {
                        boxes[boxIndex].style.backgroundImage = 'url("img/x.svg")';
                    }
                }
            }, false);

            boxes[i].addEventListener(('mouseout'), function () {
                boxes[boxIndex].style.backgroundImage = '';
            }, false);

            boxes[i].addEventListener(('click'), function () {

                //click event handler - check if state is not terminal and box is empty
                if (!isTerminal(theBoard) && !boxes[boxIndex].classList.contains('box-filled-1') && !boxes[boxIndex].classList.contains('box-filled-2')) {

                    if (activePlayer === 1) {
                        boxes[boxIndex].classList.add('box-filled-1');
                        theBoard[boxIndex] = 'O';

                        //make a computer move if the computer plays, otherwise switch players
                        if(computerCheckbox.checked && !isTerminal(theBoard)) {
                            activeTurn = 'computer';
                            makeComputerMove(theBoard);
                        } else {
                            activePlayer = 2;
                            player1Box.classList.remove('active');
                            player2Box.classList.add('active');
                        }

                    } else {
                        boxes[boxIndex].classList.add('box-filled-2');
                        theBoard[boxIndex] = 'X';
                        activePlayer = 1;
                        player1Box.classList.add('active');
                        player2Box.classList.remove('active');
                    }
                    //check if terminal state has been reached, end game if necessary
                    checkGameOver(isTerminal(theBoard));

                }
            }, false);
        })(i);
    }

    // function checking if terminal state is reached (X/O won or tie)
    var isTerminal = function (theBoard) {
        //check rows
        for(var i = 0; i <= 6; i+=3){
            if (theBoard[i] !== "E" && theBoard[i] === theBoard[i+1] && theBoard[i+1] === theBoard[i+2]){
                gameState = theBoard[i] + "-won"; // update the result of the game (not 'running')
                return true;
            }
        }
        //check columns
        for(var i=0; i<3; i++){
            if(theBoard[i] !== "E" && theBoard[i] === theBoard[i+3] && theBoard[i+3] === theBoard[i+6]){
                gameState = theBoard[i] + "-won";
                return true;
            }
        }
        //check diagonals
        for(var i= 0, j=4; i<=2; i+=2, j-=2){
            if(theBoard[i] !== "E" && theBoard[i] === theBoard[i+j] && theBoard[i+j] === theBoard[i+j*2]){
                gameState = theBoard[i] + "-won";
                return true;
            }
        }
        //check if it's a tie
        var emptyBoxesArray = checkEmptyBoxes(theBoard);
        if(emptyBoxesArray.length == 0){
            gameState = 'draw';
            return true;
        } else {
            //game is still running
            console.log("Game still running");
            return false;
        }
    };

    //switch display if game is over
    var checkGameOver = function (isTerminal) {
        if (isTerminal) {
            boardScreen.style.display = 'none';
            endScreen.style.display = '';
            if (gameState === 'O-won') {
                endScreen.classList.add('screen-win-one');
                endGameMessage.innerText = 'Winner - ' + player1Name;
            } else if (gameState === 'X-won') {
                endScreen.classList.add('screen-win-two');
                endGameMessage.innerText = 'Winner - ' + player2Name;
            } else {
                endScreen.classList.add('screen-win-tie');
                endGameMessage.innerText = "It's a Tie!";
            }
        }
    }


    //helper function returning an array of indexes of empty boxes
    var checkEmptyBoxes = function (theBoard) {
        var emptyBoxesArray = [];
        for (var i=0; i<theBoard.length; i++){
            if(theBoard[i] === 'E'){
                emptyBoxesArray.push(i);
            }
        }
        return emptyBoxesArray;
    }

    // function making a move for the computer - works with random move (commented), fails to work with minimax
    var makeComputerMove = function(){

        //check empty boxes
        //var emptyBoxesArray = checkEmptyBoxes(theBoard);

        //random move
        //var move = emptyBoxesArray[Math.floor(Math.random() * emptyBoxesArray.length)];
        //return move;

        //the minimax function stores the chosen index in the choice variable
        minimax(theBoard, 0);
        var move = choice;
        theBoard[move] = "X";
        boxes[move].classList.add('box-filled-2');
        activeTurn = 'human';
        choice = [];
        console.log("Move: " + move);
    }

    //scoring function
    var score = function(theBoard, depth){
        isTerminal(theBoard);
        if(gameState === 'draw')
            return 0;
        else if (gameState === 'O-won')
            return depth-10;
        else if (gameState === 'X-won')
            return 10-depth;
    }

    //minimax function
    var minimax = function (tempBoard, depth) {
        console.log("In minimax");
        if (isTerminal(tempBoard)){
            var scoreResult = score(tempBoard, depth);
            console.log("Terminal reached. Scoring: " + scoreResult);
            return scoreResult;
        }
        depth+=1;
        var scores = new Array();
        var moves = new Array();
        var availableMoves = checkEmptyBoxes(tempBoard);
        console.log("Available moves: " + availableMoves);
        var move, possibleGame;
        for (var i= 0; i<availableMoves.length; i++){
            move = availableMoves[i];
            possibleGame = getNewState(move, tempBoard);
            scores.push(minimax(possibleGame, depth));
            moves.push(move);
            tempBoard = undoMove(tempBoard, move);
        }

        var maxScore, maxScoreIndex, minScore, minScoreIndex;
        if (activeTurn === 'computer') {
            maxScore = Math.max.apply(Math, scores);
            maxScoreIndex = scores.indexOf(maxScore);
            choice = moves[maxScoreIndex];
            return scores[maxScoreIndex];
        }
        else {
            minScore = Math.min.apply(Math, scores);
            minScoreIndex = scores.indexOf(minScore);
            choice = moves[minScoreIndex];
            return scores[minScoreIndex];
        }
    }

    //helper function, creating a new state for the minimax function
    var getNewState = function(move, theBoard){
        var piece = changeTurn();
        theBoard[move] = piece;
        return theBoard;
    }

    //helper function, undoing moves made by the getNewState function
    var undoMove = function(theBoard, move){
        theBoard[move] = 'E';
        return theBoard;
    }

    //helper function, automatically switching between players when minimax is calculated
    var changeTurn = function(){
        var piece;
        if(activeTurn === 'computer'){
            piece = 'X';
            activeTurn = 'human';
        }
        else {
            piece = 'O';
            activeTurn = 'computer';
        }
        return piece;

    }
}());