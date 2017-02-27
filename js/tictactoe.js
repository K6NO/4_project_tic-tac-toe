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
    var playerNamesDisplay = document.getElementsByClassName('player-name');
    var player2Name = '';
    var player1Name = '';
    var virtualBoxes = ["E","E","E","E","E","E","E","E","E"];

    var activePlayer = 1;
    var stepCounter = 0;

    boardScreen.style.display = 'none';
    endScreen.style.display = 'none';

    startButton.addEventListener('click', function (e) {
        e.preventDefault();
        startScreen.style.display = 'none';
        boardScreen.style.display = '';
        player1Name = player1NameField.value;
        player2Name = player2NameField.value;
        playerNamesDisplay[0].innerText = player1Name;
        playerNamesDisplay[1].innerText = player2Name;

        console.log(player1Name + ' , ' + player2Name);
    });

    newGameButton.addEventListener('click', function (e) {
        e.preventDefault();
        endScreen.style.display = 'none';
        startScreen.style.display = '';
        player1Box.classList.add('active');
        player2Box.classList.remove('active');
        endScreen.classList.remove('screen-win-one');
        endScreen.classList.remove('screen-win-two');
        endScreen.classList.remove('screen-win-tie');
        stepCounter = 0;
        activePlayer = 1;
        player2Name = '';
        player1Name = '';
        player1NameField.value = '';
        player2NameField.value = '';
        for (var i = 0; i < boxes.length; i++) {
            boxes[i].classList.remove('box-filled-1');
            boxes[i].classList.remove('box-filled-2');
        }
    })

    player1Box.classList.add('active');
    player2Box.classList.remove('active');

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
                if (!boxes[boxIndex].classList.contains('box-filled-1') && !boxes[boxIndex].classList.contains('box-filled-2')) {
                    stepCounter++;
                    if (activePlayer === 1) {
                        boxes[boxIndex].classList.add('box-filled-1');
                        virtualBoxes[boxIndex] = 'O';
                        activePlayer = 2;
                        player1Box.classList.remove('active');
                        player2Box.classList.add('active');
                    } else {
                        boxes[boxIndex].classList.add('box-filled-2');
                        virtualBoxes[boxIndex] = 'X';
                        activePlayer = 1;
                        player1Box.classList.add('active');
                        player2Box.classList.remove('active');
                    }
                    var row1 = checkBoard(0, 3, 1);
                    var row2 = checkBoard(3, 6, 1);
                    var row3 = checkBoard(6, 9, 1);
                    var col1 = checkBoard(0, 7, 3);
                    var col2 = checkBoard(1, 8, 3);
                    var col3 = checkBoard(2, 9, 3);
                    var dia1 = checkBoard(0, 9, 4);
                    var dia2 = checkBoard(2, 9, 2);
                    //console.log("Row1:" + row1 + " Row2: " + row2 + " Row3: " + row3);
                    //console.log("Col1:" + col1 + " Col2: " + col2 + " Col3: " + col3);
                    //console.log("Dia1:" + dia1 + " Dia2: " + dia2);
                    checkWin(row1, row2, row3, col1, col2, col3, dia1, dia2, stepCounter);
                }
                //var emptyBoxesArray = checkEmptyBoxes(virtualBoxes);
                makeComputerMove(virtualBoxes);
                console.log(virtualBoxes);

            }, false);

        })(i);
    }


    var checkBoard = function (start, end, jump) {
        var numberOfSigns = 0;
        for (var i = start; i < end; i += jump) {
            if (boxes[i].classList.contains('box-filled-1')) {
                numberOfSigns++;
            } else if (boxes[i].classList.contains('box-filled-2')) {
                numberOfSigns--;
            }
        }
        return numberOfSigns;
    }

    var checkWin = function (row1, row2, row3, col1, col2, col3, dia1, dia2, stepCounter) {
        if (row1 === 3 || row2 === 3 || row3 === 3 || col1 === 3 || col2 === 3 || col3 === 3 || dia1 === 3 || dia2 === 3) {
            boardScreen.style.display = 'none';
            endScreen.classList.add('screen-win-one');
            endGameMessage.innerText = 'Winner - ' + player1Name;
            endScreen.style.display = '';
            console.log('player1 wins');
        } else if (row1 === -3 || row2 === -3 || row3 === -3 || col1 === -3 || col2 === -3 || col3 === -3 || dia1 === -3 || dia2 === -3) {
            boardScreen.style.display = 'none';
            endScreen.classList.add('screen-win-two');
            endGameMessage.innerText = 'Winner - ' + player2Name;
            endScreen.style.display = '';
            console.log('player2 wins');
        } else if (stepCounter === 9) {
            boardScreen.style.display = 'none';
            endScreen.classList.add('screen-win-tie');
            endGameMessage.innerText = "It's a Tie!";
            endScreen.style.display = '';
            console.log("it's a tie");
        }
    }


    var makeComputerMove = function(virtualBoxes){

        //check empty boxes
        var emptyBoxesArray = [];
        for (let i=0; i<virtualBoxes.length; i++){
            if(virtualBoxes[i] === 'E'){
                emptyBoxesArray.push(i);
            }
        }

        //determine move
        var move = emptyBoxesArray[Math.floor(Math.random() * emptyBoxesArray.length)];
        console.log(move);
        return move;
    }

}());


//machine player
// 1. check for "E" indexes.
// 2. check for
// calculate minimax for all steps
// 3.

