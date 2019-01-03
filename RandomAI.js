function RandomAI(){
	this.getMove = function(game){//game is type TicTacToeBoard
		var moves = game.getMoves();
		return moves[getRandomInt(0,moves.length)];
	}

	function getRandomInt(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}
}
