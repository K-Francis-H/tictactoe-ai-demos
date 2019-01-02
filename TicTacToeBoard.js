function TicTacToeBoard(startPlayer, state){
	const E = 0x0;
	const X = 0x1;
	const O = 0x2;

	var currentPlayer = startPlayer;

	var gameState = state || 	[[E, E, E],
			 		[E, E, E],
			 		[E, E, E]];

	var moveCount = 0;
	for(var i=0; i < gameState.length; i++){
		for(var j=0; j < gameState[i].length; j++){
			if(gameState[i][j] !== E){
				moveCount++;
			}
		}
	}

	var self = this; //so we can call our public functions

	this.getMoves = function(){
		var moves = [];
		for(var i=0; i < gameState.length; i++){
			for(var j=0; j < gameState[i].length; j++){
				if(gameState[i][j] === E){
					moves.push({
						x: i,
						y : j,
						player : currentPlayer
					});
				}
			}
		}
		//currentPlayer = currentPlayer === X ? O : X;
		return moves;
	};

	//for capture based games like hnefatafl, this should use a state stack rather than create a new object each time
	this.makeMove = function(move){
		var newState = [];
		for(var i=0; i<gameState.length; i++){
			newState[i] = [];
			for(var j=0; j<gameState[i].length; j++){
				newState[i][j] = gameState[i][j];
			}
		}
		//even though isGameOver cant detect stalemates, the board must be full so it will still give invallid move 
		if(move && gameState[move.x][move.y] === E && move.player === currentPlayer && !self.isGameOver()){
			newState[move.x][move.y] = move.player;
		}else{
			throw "INVALID_MOVE";
		}
		//console.log(newState);
		var nextPlayer = currentPlayer === X ? O : X;
		return new TicTacToeBoard(nextPlayer, newState);
		
	}

	this.getCurrentPlayer = function(){
		return currentPlayer;
	};
	
	this.getLastMovePlayer = function(){
		return currentPlayer === X ? O : X;
	}

	this.getMoveCount = function(){
		return moveCount;
	}

	this.isGameOver = function(){
		var hasAvailableMove = false;
		for(var i=0; i < gameState.length; i++){
			for(var j=0; j < gameState[i].length; j++){
				if(gameState[i][j] === E){
					hasAvailableMove = true;
					break;
				}
			}
		}
		if(!hasAvailableMove){//stalemate
			return true;
		}

		for(var i=0; i < gameState.length; i++){
			if(gameState[i][0] > 0 && (gameState[i][0] === gameState[i][1]) && (gameState[i][1] === gameState[i][2]) ){
				return true;
			}
			if(gameState[0][i] > 0 && (gameState[0][i] === gameState[1][i]) && (gameState[1][i] === gameState[2][i]) ){
				return true;
			}
		}
		return (gameState[0][0] > 0 && (gameState[0][0] === gameState[1][1]) && (gameState[1][1] === gameState[2][2])) 
		    || (gameState[0][2] > 0 && (gameState[0][2] === gameState[1][1]) && (gameState[0][2] === gameState[2][0]));

	};

	this.isWin = function(){
		//returns winning player type on win or false otherwise
		for(var i=0; i < gameState.length; i++){
			if(gameState[i][0] > 0 && (gameState[i][0] === gameState[i][1]) && (gameState[i][1] === gameState[i][2]) ){
				return gameState[i][0];
			}
			if(gameState[0][i] > 0 && (gameState[0][i] === gameState[1][i]) && (gameState[1][i] === gameState[2][i]) ){
				return gameState[0][i];
			}
		}
		if(gameState[0][0] > 0 && (gameState[0][0] === gameState[1][1]) && (gameState[1][1] === gameState[2][2])){
			return gameState[0][0];
		} 
		if(gameState[0][2] > 0 && (gameState[0][2] === gameState[1][1]) && (gameState[0][2] === gameState[2][0])){
			return gameState[0][2];
		}
		return false;
		
	}

	this.isStalemate = function(){
		return self.isGameOver() && !self.isWin();
	}

	this.getBoard = function(){
		return gameState;
	}
	
	this.clone = function(){
		return new TicTacToeBoard(currentPlayer, gameState);
	}
}
