
//*****Tic Tac Toe Game: Player vs Computer*****


ticTacToeGame("X", "O");

function ticTacToeGame(player, computer) { //Arguments "X" and "O"
  
  
  //ELEMENTS - INTERFACE-------------------------------
  

  //Board is created inmiddle of the container. First the container:
  var container = document.getElementById("container");
  container.innerHTML = "";
  
  //Then the board div appended to container with id "board".
  var boardDiv = document.createElement("div");
  boardDiv.id = "board";
  container.appendChild(boardDiv);

  //Here we create the 9 box divs appended to boardDiv with id "t"+i (t1,t2,...) and class "tile".
  for (var i = 1; i < 10; i++) {
    var boxDiv = document.createElement("div");
    boxDiv.id = "t" + i;
    boxDiv.className = "tile";
    boardDiv.appendChild(boxDiv);
  }

  
  //GAME CORE-------------------------------------
  
  //We create a tiles object containing a tile object.
  var tiles = {};

  //Loop tiles object and create a tile object with new Tile().
  for (var i = 1; i < 10; i++) {
    tiles[i] = new Tile(i); 
  }
  
   //Tile constructor for each tile adding "taken" and "position" properties.  
  function Tile(i) {
    // in tiles object we give taken and pos properties to each tile:
    this.taken = false; //all tiles are free at the beginning

    if (i === 1 || i === 3 || i === 7 || i === 9) {
      this.pos = "corner";
    } else if (i === 5) {
      this.pos = "center";
    } else this.pos = "middle";
  }
  
  //Tile combinations to win.
  var positionWin = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
  ];
  
  //Function to update the board at the beginning. 
  var board = updateBoard();
  
  //For each win combination creates a 2d array listing which tiles are untaken and which are taken and by who.
  function updateBoard() {

    //Clear board.
    board = [];

    //Reanaylse win combinations.
    for (var i = 0; i < positionWin.length; i++) {

      var free = []; //Free tiles
      var takenPlayer = []; //Tiles taken by player
      var takenComputer = []; //Tiles taken by computer

      for (var j = 0; j < positionWin[i].length; j++) {

        var currTile = positionWin[i][j];

        switch (tiles[currTile].taken) {
          case false:
            free.push(currTile);
            break;
          case player:
            takenPlayer.push(currTile);
            break;
          case computer:
            takenComputer.push(currTile);
        }
      }

      board.push([free, takenPlayer, takenComputer]);
    }
    
    return board;
  }
  
  //Moves at the beginning.
  var totalMoves = 0;

  //select tile divs.
  var tileDivs = document.getElementsByClassName("tile");
  
  //If choose "O" computer gets first move with "X".
  if (computer === "X") setTimeout(computerCalc, 1000);

  //Add listener to each div.
  for (var i = 0; i < tileDivs.length; i++) {
    tileDivs[i].addEventListener("click", playerMoved);
  }
  
  
  //FUNCTIONS FOR MOVING ----------------------------------
  
  //What to do if player has moved.
  function playerMoved() {
    
    //Mark tile as taken.
    tiles[this.id[1]].taken = player;
    //Draw nought or cross
    draw.call(this, player);
    //Remove event listener so player can't click on tile.
    this.removeEventListener("click", playerMoved);
    //Give taken class to the tile removing the pointer cursor.
    this.className = "tile taken";
    //Update board.
    updateBoard();
    totalMoves++;
    checkWin();
    //Delay until computer moves.
    setTimeout(computerCalc, 700);
  }

  //What to do if computer has moved.
  function computerMoved(tile) {
    tiles[tile].taken = computer;
    tileDivs[tile - 1].removeEventListener("click", playerMoved);
    tileDivs[tile - 1].className = "tile taken"
    draw.call(tileDivs[tile - 1], computer);
    updateBoard();
    totalMoves++;
    checkWin();
  }
  
  //Draws a nought or cross to the board.
  function draw(sym) { //Expects player or computer as arg.
    var symbol = document.createElement("div");
    symbol.textContent = sym;
    symbol.className = "symbol";
    this.appendChild(symbol);
  }
  
  //Checks for win or draw.
  function checkWin () {
    for(var i = 0; i < board.length; i++){
      if(board[i][2].length === 3){
        return gameOver("lose")
      }
    }
    
    if(totalMoves === 9) return gameOver("draw");
  }
  
  //Ends the game and displays result with option to replay on modal.
  function gameOver(arg) { //Expects "lose" or "draw
    
    //Remove tile event listeners.
    for(var i = 0; i< tileDivs.length; i++){
      tileDivs[i].removeEventListener("click", playerMoved);
    }
    
    //Game result divs.
    var modal = document.getElementById("modal");
    var result = document.getElementById("result");
    var crosses = document.getElementById("crosses");
    var noughts = document.getElementById("noughts");
    
    //Starts a new game with user as crosses.
    crosses.onclick = function () {
      modal.style.display = "none";
      container.style.display = "flex";
      ticTacToeGame("X", "O");
    };
    //... as noughts.
    noughts.onclick = function () {
      modal.style.display = "none";
      container.style.display = "flex";
      ticTacToeGame("O", "X");
    }
    
    //Displays results div.
    result.textContent = (arg === "lose") ? "You Lose!" : "Draw";
    setTimeout(function () {modal.style.display = "flex"}, 1300);
    setTimeout(function () {container.style.display = "none"}, 1300);
  }


  //MAKE THE COMPUTER THINK -------------------------------------------
  
  function computerCalc() {

    //Look for win.
    for (var i = 0; i < board.length; i++) {
      if (board[i][0].length === 1 && board[i][2].length === 2) {
        return computerMoved(board[i][0][0]);
      }
    }

    //Look for block.
    for (var i = 0; i < board.length; i++) {
      if (board[i][0].length === 1 && board[i][1].length === 2) {
        return computerMoved(board[i][0][0]);
      }
    }
    
    //Look for fork.
    var forks = findForks(computer);
    if (forks.length > 0) return computerMoved(forks[0]);
    
    //Look for 2 in a row as long as doesn't create fork for opponent.
    forks = findForks(player);
    for (var i = 0; i < board.length; i++){
      if(board[i][0].length === 2 && board[i][2].length === 1)
        if(!forks.includes(board[i][0][0])) return computerMoved(board[i][0][1]);
        else if (!forks.includes(board[i][0][1])) return computerMoved(board[i][0][0]);
    }
    
    //Look if center is free
    if (!tiles[5].taken) {
      return computerMoved(5);
    }
    
    //Look if opposite corner is free.
    if (tiles[1].taken && !tiles[9].taken) return computerMoved(9);
    if (tiles[9].taken && !tiles[1].taken) return computerMoved(1);
    if (tiles[3].taken && !tiles[7].taken) return computerMoved(7);
    if (tiles[7].taken && !tiles[3].taken) return computerMoved(3);
    
    for (var i = 1; i <= board.length; i++){
      if(tiles[i].pos = "corner" && !tiles[i].taken) return computerMoved(i);
    }
    
      for (var i = 1; i <= board.length; i++){
        if(tiles[i].pos = "middle" && !tiles[i].taken) return computerMoved(i);
      }
    
    //Finds possible forks for given player.
    function findForks(arg) { //Expects player  or computer.
      
      var x = (arg === player) ? 1 : 2;
      
      //Array for forks.
      var arr = [];
      
      for (var i = 0; i < board.length; i++) {
        if (board[i][0].length === 2 && board[i][x].length === 1){
          for (var j = 0; j < 2; j++){
            arr.push(board[i][0][j]);
          }
        }
      }
      
      arr = arr.filter( function (elm, i) {
        for (var j = 0; j < arr.length; j++){
          if (i != j && elm === arr[j]) return true;
        }
        
        return false;
      });
      
      return arr;
    }
  }
}