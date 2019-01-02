document.addEventListener("DOMContentLoaded", function(){
	const E = 0x0;
	const X = 0x1;
	const O = 0x2;

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var gameState = [[E, E, E],
			 [E, E, E],
			 [E, E, E]];

	var playerType = O//new Date().getMilliseconds()%3+1;
	var aiType = X//playerType === X ? O : X;
	var currentType = X;

	//var AI = new MinimaxAI(aiType, playerType, 5);
	var game = new TicTacToeBoard(aiType);
	var AI2 = new MonteCarloAI(100, playerType);//new MinimaxAI2(5,aiType);//new RandomAI();
	var AI = new MinimaxAI2(9,aiType);
	function gameLoop(){
		//console.log("currentPlayer: "+game.getCurrentPlayer());
		//console.log("human type: "+playerType);
		//check current turn get move if AI, wait for player to move otherwise
		if(!game.isGameOver() && aiType === game.getCurrentPlayer()){
			var move = AI.getMove(game);
			console.log(move);
			game = game.makeMove(move);
			draw(game.getBoard());
		}
	}

	setInterval(gameLoop, 500);

	function draw(gameState){
		console.log("drawing");
		//draw lines
		var widthSpace = canvas.width/3;
		var heightSpace = canvas.height/3;
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0,0,canvas.width, canvas.height);
		for(var i=1; i < 3; i++){
			ctx.moveTo(widthSpace*i,0);
			ctx.lineTo(widthSpace*i,canvas.height);
			ctx.stroke();

			ctx.moveTo(0,heightSpace*i);
			ctx.lineTo(canvas.width,heightSpace*i);
			ctx.stroke(); 
		}

		//draw the state
		var tictacWidth = widthSpace * 0.70;
		var tictacHeight = heightSpace * 0.70;

		for(var i=0; i < gameState.length; i++){
			for(var j=0; j < gameState.length; j++){
				if(gameState[i][j] === X){
					//find top corner of X
					var offsetWidth = (widthSpace * 0.15) + (widthSpace * i);
					var offsetHeight = (heightSpace * 0.15) + (heightSpace * j);
					ctx.moveTo(offsetWidth, offsetHeight);
					ctx.lineTo(widthSpace*(i+1) - (widthSpace * 0.15),
						   heightSpace*(j+1) - (heightSpace * 0.15));
					ctx.stroke();
					
					//ctx.moveTo(widthSpace*(i+1) - widthSpace*0.15, offsetHeight);
					//ctx.lineTo(widthSpace*(i) + widthSpace*0.15, heightSpace*(i+1)
					ctx.moveTo(widthSpace*(i+1) - (widthSpace * 0.15), offsetHeight);
					ctx.lineTo(widthSpace*(i) + (widthSpace * 0.15), heightSpace*(j+1) - (heightSpace * 0.15));
					ctx.stroke();
				}
				else if(gameState[i][j] === O){
					var centerWidth = widthSpace*i + widthSpace*0.5;
					var centerHeight = heightSpace*j + heightSpace*0.5;
					ctx.beginPath()
					ctx.arc(centerWidth, centerHeight,  tictacWidth*0.5, 0, 2*Math.PI);
					ctx.stroke();
				}
				//otherwise empty
			}
		}
	}
	draw(game.getBoard());

	//TODO AI, user input
	canvas.onclick = function(event){
		//if its not human turn ignore
		/*if(currentType !== playerType){
			console.log(gameState);
			var move = AI.getMove(gameState);
			gameState[move.x][move.y] = aiType;
			draw(gameState);
			currentType = currentType === playerType ? aiType : currentType;
			return;
		}*/

		//otherwise determine click and place tictac
		var x = event.pageX - offset(canvas).left;
		var y = event.pageY - offset(canvas).top;

		var widthSpace = canvas.width/3;
		var heightSpace = canvas.height/3;

		var tileX = Math.floor(x / widthSpace);
		var tileY = Math.floor(y / heightSpace);

		/*if(gameState[tileX][tileY] === E){
			gameState[tileX][tileY] = playerType;
			currentType = currentType === playerType ? aiType : currentType;
		}*/
		var move = {
			//have to flip them cause of row major bs
			x : tileX,
			y : tileY,
			player : playerType
		};
		try{
			game = game.makeMove(move);
		}catch(err){
			console.log("invalid move: ");
		}
		draw(game.getBoard());
	};

	document.getElementById("ai2-play").onclick = function(){
		if(!game.isGameOver() && playerType === game.getCurrentPlayer()){
			var move = AI2.getMove(game);
			console.log(move);
			game = game.makeMove(move);
			draw(game.getBoard());
		}
	};
	

	function offset(el){
		if(!el) el = this;
		
		var x = el.offsetLeft;
		var y = el.offsetTop;
		
		while(el = el.offsetParent){
			x += el.offsetLeft;
			y += el.offsetTop;
		}
		return { left: x, top : y};
	}

	

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

		//TODO this is fine for a symmetric goaled game, but will need tweaking for tafl
		function evaluate(game, type){
			var sign = type === TYPE ? 1 : -1;

			//TODO score
			//var score = /*connectivity(game.getBoard(), type)*/ +*/ isWin(game.getBoard(), type);
			score = isWin(game.getBoard(), type) ? 10000 : 0;
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

		//TODO not the best scoring mechanism, try winnable rows added or empty rows, or rows cols with no opponent
		function connectivity(gameState, type){
			var score = 0;
			//console.log("TYPE: "+type);
			for(var i=0; i < gameState.length; i++){
				for(var j=0; j < gameState[i].length; j++){
					//console.log(gameState[i][j]);
					if(gameState[i][j] === type){		
						if(gameState[i-1] && (gameState[i-1][j] === type || gameState[i-1][j] === E) ){
							score++;
						}
						if(gameState[i+1] && (gameState[i+1][j] === type || gameState[i+1][j] === E) ){
							score++;
						}
						if(gameState[i+1] && gameState[i+1][j+1] >= 0 && (gameState[i+1][j+1] === type || gameState[i+1][j+1] === E) ){
							score++;
						}
						if(gameState[i-1] && gameState[i-1][j-1] >= 0 && (gameState[i-1][j-1] === type || gameState[i-1][j-1] === E) ){
							score++;
						}
						if(gameState[i+1] && gameState[i+1][j-1] >= 0 && (gameState[i+1][j-1] === type || gameState[i+1][j-1] === E) ){
							score++;
						}
						if(gameState[i-1] && gameState[i-1][j+1] >= 0 && (gameState[i-1][j+1] === type || gameState[i-1][j+1] === E) ){
							score++;
						}
						if(gameState[i][j-1] >= 0 && (gameState[i][j-1] === type || gameState[i][j-1] === E) ){
							score++;
						} 
						if(gameState[i][j+1] >= 0 && (gameState[i][j+1] === type || gameState[i][j+1] === E) ){
							score++;
						}
					}
				}
			}
			return score;
		}
	}

	function MonteCarloAI(maxDepth, type){

		var self = this;
		const TYPE = type;
		const MAX_DEPTH = maxDepth;

		this.getMove = function(game){
			var moves = game.getMoves();
			var bestScore = Number.MIN_SAFE_INTEGER;
			var bestMove = moves[i];
			//return moves[i];
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
	
});
