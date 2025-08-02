import { gridControls } from "./gridControls.js";

export const gameControls = (function () {
  let player1;
  let player2;
  let gameOver = false;
  let boardArray = Array(9).fill('');
  let currentTurn = 'X';
  let currentPlayer;
  let ties = 0;
  let enemyType;
  let inputLocked;
  // Player object constructor
  function Player(name, marker) {
    this.name = name;
    this.marker = marker;
    this.score = 0;
  }

const selectOpponent = () => {
  const enemyChoices = document.querySelectorAll('.enemy-choice .enemy');
  const enemyChoiceContainer = document.querySelector('.enemy-choice');
  const markerWindow = document.querySelector('.marker-choice');

  const savedDataExists = loadGameData();
  if (savedDataExists && enemyType && player1 && player2) {
    enemyChoiceContainer.style.display = 'none';
    markerWindow.style.display = 'none';

    const body = document.querySelector('body');
    const gameUI = document.querySelector('main');

    body.classList.add('active');
    gameUI.style.display = 'block';

    resetButtons();
    displayScores();
    startGame();
    return;
  }

  // New game flow
  enemyChoices.forEach(choice => {
    choice.addEventListener('click', () => {
      enemyType = choice.textContent;
      enemyChoiceContainer.style.display = 'none';
      markerWindow.style.display = 'flex';
      selectMarker();
    });
  });
};



  //Logic for creating player and assigning a marker to said player!
  const selectMarker = () => {
    const markerWindow = document.querySelector('.marker-choice');
    const markerChoices = document.querySelectorAll('.marker-choice .marker');
    const body = document.querySelector('body');
    const gameUI = document.querySelector('main');
    resetButtons();

    markerChoices.forEach((choiceBtn) => {
      choiceBtn.addEventListener('click', () => { 
        body.classList.add('active');
        markerWindow.style.display = 'none';     
        gameUI.style.display = 'block'; 
        if(enemyType === 'Bot!'){
          player2 = new Player ('Bot', choiceBtn.textContent === 'X' ? 'O' : 'X');
        } else{
          player2 = new Player ('Player 2', choiceBtn.textContent === 'X' ? 'O' : 'X');
        }  
        player1 = new Player('Player 1', choiceBtn.textContent);   
        
        currentPlayer = currentTurn === player1.marker  ? player1 : player2;
        startGame();
        saveGameData();
      });
    });
  };

  //Starting a game logic
  const startGame = () => {
    gameOver = false;
    gridControls.generateBoard();
    currentTurn = 'X';
    currentPlayer = currentTurn === player1.marker ? player1 : player2;

    displayScores();
    boardArray = Array(9).fill('');
    console.log(player1);

    if(currentPlayer.name === 'Bot'){
      botMove();
    }

    const cells = document.querySelectorAll('.game-board .cell');
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        if(cell.textContent !== '' || inputLocked) return;
        if (cell.textContent === '' && !gameOver) {
          const index = Number(cell.dataset.index);
          playRound(index);
        }
      });
    });
  };

  const displayScores = ()=>{
    const scoreboard = document.querySelector('.scoreboard');

    scoreboard.innerHTML = `
      <div class="score p1-score">${player1.name}: <span id="player1-score">${player1.score}</span></div>
      <div class="score ties">Ties: <span id="ties">${ties}</span></div>
      <div class="score p2-score">${player2.name}: <span id="player2-score">${player2.score}</span></div>
    `;
  };

  const playRound = (index)=>{
    const status = document.querySelector('.status');

        //Checking if board element is full or not
      if(boardArray[index] !== ''){
        return;
      }
      boardArray[index] = currentPlayer.marker;

      //UI modification
      document.querySelector(`.game-board .cell[data-index = "${index}"]`).textContent = currentPlayer.marker;

      //check if the current player has won. Done in every round.
      if (checkWin(boardArray, currentPlayer.marker)) {
        currentPlayer.score++;
        document.querySelector(`.game-board .cell[data-index = "${index}"]`).textContent = currentPlayer.marker;
        gameOver = true;
        inputLocked = true;
        saveGameData();

        setTimeout(() => {
          status.textContent = `${currentPlayer.name} wins!`;
          inputLocked = false;
          startGame();
        }, 50);
        return;
      }

      //check if every cell is filled in order to declare a draw.
      if (boardArray.every(cell => cell !== '')) {
          ties++;
          document.querySelector(`.game-board .cell[data-index = "${index}"]`).textContent = currentPlayer.marker;
          gameOver = true;
          inputLocked = true;
          saveGameData();
          setTimeout(() => {
            status.textContent = `it's a draw!`;
            inputLocked = false;
            startGame();
          }, 50);
          return;
      }

      //Turn Switching via marker and then player
      currentTurn = currentTurn === 'X' ? 'O' : 'X';
      currentPlayer = currentTurn === player1.marker ? player1 : player2;

      //To make the bot play in case it is it's turn
      if (currentPlayer.name === 'Bot') {
        inputLocked = true
        setTimeout(botMove, 400);
      } else{
        inputLocked = false;
      }

  }


  const checkWin = (board, marker) => {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8], 
      [0,3,6], [1,4,7], [2,5,8], 
      [0,4,8], [2,4,6]          
    ];

    return winPatterns.some(pattern =>
      pattern.every(index => board[index] === marker)
    );
  };


    const botMove = () => {
      if (gameOver) return;

      const emptyIndices = boardArray
        .map((val, index) => (val === '' ? index : null))
        .filter(i => i !== null);

      if (emptyIndices.length === 0) return;

      const beSmart = Math.round(Math.random() * 10) / 10;


      if(beSmart >= 0.4){

        //The following is a predictive algorithm that makes the bot smarter. At full power, winning is impossible
        for (const idx of emptyIndices) {
          boardArray[idx] = currentPlayer.marker;
          if (checkWin(boardArray, currentPlayer.marker)) {
            boardArray[idx] = '';
            playRound(idx);
            return;
          }
          boardArray[idx] = '';
        }

        
        const opponentMarker = currentPlayer.marker === 'X' ? 'O' : 'X';
        for (const idx of emptyIndices) {
          boardArray[idx] = opponentMarker; 
          if (checkWin(boardArray, opponentMarker)) {
            boardArray[idx] = ''; 
            playRound(idx);
            return;
          }
          boardArray[idx] = ''; 
        }
      }
      
      const randIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      playRound(randIdx);
      if (!gameOver) {
      inputLocked = false;
      };
    };

    //Saving data locally
    const saveGameData = () => {
      const data = {
        player1: { name: player1.name, score: player1.score, marker: player1.marker },
        player2: { name: player2.name, score: player2.score, marker: player2.marker },
        ties: ties,
        currentTurn,
        enemyType,
      };
      localStorage.setItem('ticTacToeGameData', JSON.stringify(data));
    };

    //load local data
    const loadGameData = () => {
      const savedData = localStorage.getItem('ticTacToeGameData');
      if (!savedData) return false;

      const data = JSON.parse(savedData);

      if (data.player1) {
        player1 = new Player(data.player1.name, data.player1.marker);
        player1.score = data.player1.score || 0;
      }

      if (data.player2) {
        player2 = new Player(data.player2.name, data.player2.marker);
        player2.score = data.player2.score || 0;
      }

      ties = data.ties || 0;
      currentTurn = data.currentTurn || 'X';
      currentPlayer = currentTurn === player1.marker ? player1 : player2;

      enemyType = data.enemyType || null;


      return true;
    };

    //reset player data
    const resetPlayerData = () => {
      localStorage.removeItem('ticTacToeGameData');
      player1.score = 0;
      player2.score = 0;
      ties = 0;
      enemyType = undefined;
      currentTurn = 'X';
      currentPlayer = currentTurn === player1.marker ? player1 : player2;
      displayScores();
      
      const enemyChoiceContainer = document.querySelector('.enemy-choice');
      const gameUI = document.querySelector('main');
      const body = document.querySelector('body');

      enemyChoiceContainer.style.display = 'block';
      enemyChoiceContainer.style.textAlign = 'center';
      gameUI.style.display = 'none';
      body.classList.remove('active');

      selectOpponent();
    };

    //reset board data
    const resetBoardData = ()=>{
      startGame();
    }

    //reset scores data
    const resetScoresData = () =>{
      player1.score = 0;
      player2.score = 0;
      ties = 0;
      displayScores();
      saveGameData();
      startGame();
    }

    
    const resetButtons = ()=>{
      const resetBoard = document.querySelector('#reset-board');
      const resetScores = document.querySelector('#reset-scores');
      const resetPlayer = document.querySelector('#reset-player');

      resetBoard.addEventListener('click', resetBoardData);
      resetScores.addEventListener('click', resetScoresData);
      resetPlayer.addEventListener('click', resetPlayerData);
    }


  return {
  selectOpponent,
  resetPlayerData,
  resetBoardData,
  resetScoresData
  };
})();