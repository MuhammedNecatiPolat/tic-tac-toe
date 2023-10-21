(function() {
    
    function createPlayer(name, marker){
        return {name,marker}
    }

    const gameBoard = (function(){
        const board = [["", "", ""], ["", "", ""], ["", "", ""]];
        const markBoard = (row, col, marker) => {
            if (board[row][col] !== "" || isSomeoneWon() || isBoardFull()) {
                return false;
            }
            board[row][col] = marker;
            return true;
        }
        
        const isSomeoneWon = () => {
            for(let i = 0; i < 3; i++){
                if(board[i][0] !== "" && board[i][0] === board[i][1] && board[i][1] === board[i][2]){
                    return board[i][0];
                }
            }
            for(let i = 0; i < 3; i++){
                if(board[0][i] !== "" && board[0][i] === board[1][i] && board[1][i] === board[2][i]){
                    return board[0][i];
                }
            }
            if(board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2]){
                return board[0][0];
            }
            if(board[0][2] !== "" && board[0][2] === board[1][1] && board[1][1] === board[2][0]){
                return board[0][2];
            }
            return false;
        }

        const isBoardFull = () => {
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    if(board[i][j] === ""){
                        return false;
                    }
                }
            }
            return true;
        }

        const getGameboardSlot = (row, col) => {
            return board[row][col];
        }

        const resetBoard = () => {
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    board[i][j] = "";    
                }
            }
        }


        return {markBoard, isBoardFull, isSomeoneWon, resetBoard, getGameboardSlot};
    })();
    
    const displayController = (function(){
        let currentPlayer = 0;
        const playerNameDiv = document.getElementById('player-name');
        const playerMarkerDiv = document.getElementById('player-marker');

        const players = [];
        const createPlayers = () => {
            players.push(createPlayer(prompt("Enter your name Player 1"), prompt("Enter your marker Player 1")));
            players.push(createPlayer(prompt("Enter your name Player 2"), prompt("Enter your marker Player 2")));
        }

        const createBoard = () => {    
            const gameBoardDiv = document.getElementById("gameboard");
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    const markSlot = document.createElement('div');
                    markSlot.classList.add('mark-slot');
                    markSlot.setAttribute('data-row', i);
                    markSlot.setAttribute('data-col', j);
                    gameBoardDiv.appendChild(markSlot);
                }
            }
            setPlayerDivs();
        }

        const renderBoard = () => {
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    const markSlot = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                    markSlot.innerText = gameBoard.getGameboardSlot(i, j);
                }
            }
        }
        

        const getNextPlayer = () => {
            return (currentPlayer + 1) % 2
        }

        const adjustBoard = () => {
            currentPlayer = getNextPlayer();
            setPlayerDivs();

        }

        const manageGameStatus = () => {
            if(!gameBoard.isBoardFull() && !gameBoard.isSomeoneWon()){
                adjustBoard();
            }
            if(gameBoard.isSomeoneWon()){
                alert(players[currentPlayer].name + " Won!");        
            }
            if(gameBoard.isBoardFull()){
                alert("Everybody won!");
            }
        }


        const listenBoard = () => {
            const markSlots = document.getElementsByClassName('mark-slot');
            for(let i = 0; i < markSlots.length; i++){
                markSlots[i].addEventListener('click', (markSlot) => {
                    if(gameBoard.markBoard(
                        markSlots[i].getAttribute('data-row'), 
                        markSlots[i].getAttribute('data-col'),
                        players[currentPlayer].marker,
                        )){
                            renderBoard();
                            manageGameStatus();
                        }
                    });
            }
        }

        const setPlayerDivs = () => {
            playerNameDiv.innerText =  players[currentPlayer].name + "'s Turn";
            playerMarkerDiv.innerText =  "Current Marker is: '" + players[currentPlayer].marker + "'";
        }

        const listenResetButton = () => {
            const resetButton = document.getElementById('reset-button');
            resetButton.addEventListener('click', () => {
                gameBoard.resetBoard()
                renderBoard();
                players[0].name = prompt("Enter your name Player 1");
                players[0].marker = prompt("Enter your marker Player 1");
                players[1].name = prompt("Enter your name Player 2");
                players[1].marker = prompt("Enter your marker Player 2");
                currentPlayer = 0;
                setPlayerDivs();
            });
            

        }

        const listenStartButton = () => {
            const startButton = document.getElementById('start-button');
            startButton.addEventListener('click', () => {
                createPlayers();
                createBoard();
                listenBoard();
            })
        }


        return {listenResetButton, listenStartButton}
    })();
    
    displayController.listenStartButton();
    displayController.listenResetButton();
})();