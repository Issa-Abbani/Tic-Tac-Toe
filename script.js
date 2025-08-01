const gridControls =(function (){
  const board = document.querySelector(".game-board");

  const getBoard = () => board;

  const generateBoard = ()=>{
    board.innerHTML = '';
    for(let i = 0; i < 9; i++){
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.index = i;
      board.appendChild(cell);
    }
  };

  const clearBoard = ()=>{
    const cells = document.querySelectorAll(".game-board .cell");
    cells.forEach(cell => cell.textContent = '');
  }

  return{
    getBoard,
    generateBoard,
    clearBoard
  }
})();

const gameControls = (function () {
  let player1;
  let board = gridControls.getBoard();

  // Player object constructor
  function Player(name, marker) {
    this.name = name;
    this.marker = marker;
  }

  const selectMarker = () => {
    const markerWindow = document.querySelector('.marker-choice');
    const markerChoices = document.querySelectorAll('.marker-choice .marker');
    const body = document.querySelector('body');
    const gameUI = document.querySelector('main');

    markerChoices.forEach((choiceBtn) => {
      choiceBtn.addEventListener('click', () => { 
        body.classList.add('active');
        markerWindow.style.display = 'none';     
        gameUI.style.display = 'block';    
        player1 = new Player('Player 1', choiceBtn.textContent);   
      });
    });
  };

  return {
    selectMarker
  };
})();

gameControls.selectMarker();

gridControls.generateBoard();