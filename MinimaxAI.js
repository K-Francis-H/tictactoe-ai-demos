function MinimaxAI2(difficulty, type){
	const MAX_DEPTH = difficulty;
	const TYPE = type;

	this.getMove = function(game){
		return minimaxInit(game);
	}

	function minimaxInit(game){
		var isMaximizing = game.getCurrentPlayer() === TYPE;
		var bestScore = isMaximizing ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
		var bestMove = 0;
		var moves = game.getMoves();
		for(var i=0; i < moves.length; i++){
			//return moves[i];
			var score = minimax(game.makeMove(moves[i]), 1, MAX_DEPTH, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
			if(isMaximizing){
				if(score > bestScore){
					bestScore = score;
					bestMove = moves[i];	
				}
			}else{
				if(score < bestScore){
					bestScore = score;
					bestMove = moves[i];
				}
			}
		}
		return bestMove;
	}

	function minimax(game, depth, maxDepth, alpha, beta){
		if(game.isGameOver() || depth === maxDepth){
			return evaluate(game, game.getLastMovePlayer());//TODO maybe use last player
		}

		var isMaximizing = game.getCurrentPlayer() === TYPE;
		var bestScore = isMaximizing ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
		//var bestMove = 0;
		var moves = game.getMoves();
		for(var i=0; i < moves.length; i++){
			var score = minimax(game.makeMove(moves[i]), depth+1, maxDepth, alpha, beta);
			if(isMaximizing){
				bestScore = Math.max(score, bestScore);
				alpha = Math.max(alpha, bestScore);
				if(beta <= alpha){
					console.log("alpha break");
					break;
				}
			}else{
				bestScore = Math.min(score, bestScore);
				beta = Math.min(beta, bestScore);
				if(beta <= alpha){
					console.log("beta break");
					break;
				}
			}
		}
		return bestScore;
	}

	//TODO this is fine for a symmetric goaled game, but will need tweaking for tafl or other asymmetric games
	function evaluate(game, type){
		var sign = type === TYPE ? 1 : -1;

		score = isWin(game.getBoard(), type);
		score += game.getMoveCount();
		return score * sign;
	}

	function isWin(gameState, type){
		var score = 0;
		for(var i=0; i < gameState.length; i++){
			if(gameState[i][0] === type && (gameState[i][0] === gameState[i][1]) && (gameState[i][1] === gameState[i][2]) ){
				score += 10000;
			}
			if(gameState[0][i] === type && (gameState[0][i] === gameState[1][i]) && (gameState[1][i] === gameState[2][i]) ){
				score += 10000;
			}
		}
		if((gameState[0][0] === type && (gameState[0][0] === gameState[1][1]) && (gameState[1][1] === gameState[2][2])) 
		    || (gameState[0][2] === type && (gameState[0][2] === gameState[1][1]) && (gameState[0][2] === gameState[2][0]))){
			score += 10000;
		}
		return score;
	}
}
