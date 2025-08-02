export const gridControls =(function (){
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
    clearBoard,
  }
})();