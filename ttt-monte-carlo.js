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
	var AI = new MonteCarloAI(100, aiType);//new MinimaxAI2(5,aiType);//new RandomAI();
	var AI2 = new MinimaxAI2(9,playerType);
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
	
});
