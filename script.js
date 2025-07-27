const gameBoard = (function (){

  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => board;
  
  const setCell = (index, marker) => {
    if (board[index] === '') {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const reset = ()=>{
    board = Array(9).fill(''); 
  }

  return{
    getBoard,
    setCell,
    reset
  }

})();

const Player = (name, marker) => {
  return { name, marker };
};

const gameController = (function(){
  let player1 = new Player('P1', 'X');
  let player2 = new Player('P2', 'O');
  let currentplayer = player1;

  const switchPlayer = ()=>{
    
  }
})();