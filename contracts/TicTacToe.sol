pragma solidity ^0.4.19;


contract TicTacToe {

	enum Players { None, PlayerOne, PlayerTwo }
	enum Winners { None, PlayerOne, PlayerTwo, Tie }

	struct Game {
		address playerOne;
		address playerTwo;
		Winners winner;
		Players playerTurn;
		Players[3][3] board;
	}

	mapping(uint256 => Game) games;
	uint256 nrOfGames;

    function newGame() public returns (uint256 gameId) {
    	Game memory game;
    	game.playerTurn = Players.PlayerOne;

    	nrOfGames++;
    	games[nrOfGames] = game;

    	return nrOfGames;
    }

    function joinGame(uint256 _gameId) public returns (bool success, string reason) {
    	if (_gameId > nrOfGames) {
    		return (false, "No such game exists.");
    	}

    	address player = msg.sender;
    	Game storage game = games[_gameId];

    	if (game.playerOne == address(0)) {
    		game.playerOne = player;

    		return (true, "Joined as player one.");
    	}

    	if (game.playerTwo == address(0)) {
    		game.playerTwo = player;

    		return (true, "Joined as player two. Player one can make the first move.");
    	}

    	return (false, "All seats taken.");
    }

    function makeMove(uint256 _gameId, uint _xCoordinate, uint _yCoordinate) public returns (bool success, string reason) {
    	if (_gameId > nrOfGames) {
    		return (false, "No such game exists.");
    	}

    	Game storage game = games[_gameId];

    	if (game.winner != Winners.None) {
    		return (false, "The game has already ended.");
    	}

    	if (msg.sender != getCurrentPlayer(game)) {
    		// TODO: what if the player is not present in the game at all?
    		return (false, "It is not your turn.");
    	}

    	if (game.board[_xCoordinate][_yCoordinate] != Players.None) {
    		return (false, "There is already a mark at the given coordinates.");
    	}

    	game.board[_xCoordinate][_yCoordinate] = game.playerTurn;
    	// TODO: memory or storage? Or automatically on stack as uint8?
    	// Also below.
    	Winners winner = calculateWinner(game.board);
    	if (winner != Winners.None) {
    		game.winner = winner;

    		return (true, "The game is over.");
    	}

    	nextPlayer(game);

    	return (true, "");
    }

    function getGame(uint256 _gameId) public view returns (Game game) {
    	// Solidity will always return a Game at the given index.
    	// If no game exists, an initialized Game will be returned.
    	// That is due to how maps work in solidity.
    	return games[_gameId];
    }

    function getCurrentPlayer(Game storage _game) private view returns (address player) {
    	if (_game.playerTurn == Players.PlayerOne) {
    		return _game.playerOne;
    	}

    	if (_game.playerTurn == Players.PlayerTwo) {
    		return _game.playerTwo;
    	}

    	return address(0);
    }

    function calculateWinner(Players[3][3] memory _board) private pure returns (Winners winner) {
    	// TODO: enum on stack or memory/storage?
    	Players player = winnerInRow(_board);
    	if (player == Players.PlayerOne) {
    		return Winners.PlayerOne;
    	}
    	if (player == Players.PlayerTwo) {
    		return Winners.PlayerTwo;
    	}

    	player = winnerInColumn(_board);
    	if (player == Players.PlayerOne) {
    		return Winners.PlayerOne;
    	}
    	if (player == Players.PlayerTwo) {
    		return Winners.PlayerTwo;
    	}

    	player = winnerInDiagonal(_board);
    	if (player == Players.PlayerOne) {
    		return Winners.PlayerOne;
    	}
    	if (player == Players.PlayerTwo) {
    		return Winners.PlayerTwo;
    	}

    	if (isBoardFull(_board)) {
    		return Winners.Tie;
    	}

    	return Winners.None;
    }

    function winnerInRow(Players[3][3] memory _board) private pure returns (Players winner) {
    	for (uint8 x = 0; x < 3; x++) {
    		if (
    			_board[x][0] == _board[x][1]
    			&& _board[x][1]  == _board[x][2]
    			&& _board[x][0] != Players.None
    		) {
    			return _board[x][0];
    		}
    	}

    	return Players.None;
    }

    function winnerInColumn(Players[3][3] memory _board) private pure returns (Players winner) {
    	for (uint8 y = 0; y < 3; y++) {
    		if (
    			_board[0][y] == _board[1][y]
    			&& _board[1][y] == _board[2][y]
    			&& _board[0][y] != Players.None
    		) {
    			return _board[0][y];
    		}
    	}

    	return Players.None;
    }

    function winnerInDiagonal(Players[3][3] memory _board) private pure returns (Players winner) {
		if (
			_board[0][0] == _board[1][1]
			&& _board[1][1] == _board[2][2]
			&& _board[0][0] != Players.None
		) {
			return _board[0][0];
		}

		if (
			_board[0][2] == _board[1][1]
			&& _board[1][1] == _board[2][0]
			&& _board[0][2] != Players.None
		) {
			return _board[0][2];
		}

    	return Players.None;
    }

    function isBoardFull(Players[3][3] memory _board) private pure returns (bool isFull) {
    	for (uint8 x = 0; x < 3; x++) {
    		for (uint8 y = 0; y < 3; y++) {
    			if (_board[x][y] == Players.None) {
    				return false;
    			}
    		}
    	}

    	return true;
    }

    function nextPlayer(Game storage _game) private {
    	if (_game.playerTurn == Players.PlayerOne) {
    		_game.playerTurn = Players.PlayerTwo;
    	} else {
    		_game.playerTurn = Players.PlayerOne;
    	}
    }
}
