function MonteCarloAI(maxDepth, type){

	var self = this;
	const TYPE = type;
	const MAX_DEPTH = maxDepth;

	this.getMove = function(game){
		var moves = game.getMoves();
		var bestScore = Number.MIN_SAFE_INTEGER;
		var bestMove = moves[i];
		for(var i=0; i < moves.length; i++){
			var score = simulateGames(game.makeMove(moves[i]), MAX_DEPTH);
			console.log(moves[i]);
			console.log(score);
			if(score > bestScore){
				bestScore = score;
				bestMove = moves[i];
			}
		}
		return bestMove;
	};

	function simulateGames(startState, numGames){
		var score = 0; 
		for(var i=0; i < numGames; i++){
			var newGame = startState.clone();
			while(!newGame.isGameOver()){
				var moves = newGame.getMoves();
				newGame = newGame.makeMove(moves[getRandomInt(0,moves.length)]); 
			}
			if(newGame.isWin() === TYPE){
				score += 2;
			}else if(newGame.isStalemate()){
				score++;
			}
		}
		return score;
	}

	function getRandomInt(min, max) {
	  	min = Math.ceil(min);
	  	max = Math.floor(max);
	  	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}
}
