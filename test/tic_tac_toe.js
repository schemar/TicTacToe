var TicTacToe = artifacts.require("TicTacToe");

const GAME_CREATED_EVENT = "GameCreated";
const PLAYER_JOINED_EVENT = "PlayerJoinedGame";
const PLAYER_MADE_MOVE_EVENT = "PlayerMadeMove";
const GAME_OVER_EVENT = "GameOver";


contract('TicTacToe', function(accounts) {
	it("should create a game", () => {
        var tic_tac_toe;
        return TicTacToe.deployed().then((instance) => {
    	    tic_tac_toe = instance;
    	    return tic_tac_toe.newGame();
        }).then((result) => {
        	eventArgs = getEventArgs(result, GAME_CREATED_EVENT);
        	assert.isTrue(eventArgs !== false);
        	
        	assert.equal(accounts[0], eventArgs.creator, "Game creator was not logged correctly.");
        	assert.notEqual(0, eventArgs.gameId, "The game was not created.");
        });
    });

    it("should accept exactly two players", () => {
        var tic_tac_toe;
        var game_id;
        return TicTacToe.deployed().then((instance) => {
    	    tic_tac_toe = instance;
    	    
    	    return tic_tac_toe.newGame();
        }).then((result) => {
        	eventArgs = getEventArgs(result, GAME_CREATED_EVENT);
        	game_id = eventArgs.gameId;

        	return tic_tac_toe.joinGame(game_id, {from: accounts[0]});
        }).then((result) => {
        	eventArgs = getEventArgs(result, PLAYER_JOINED_EVENT);
        	assert.isTrue(eventArgs !== false, "Player one did not join the game.");
        	assert.equal(accounts[0], eventArgs.player, "The wrong player joined the game.");
        	assert.equal(game_id.valueOf(), eventArgs.gameId.valueOf(), "Player one joined the wrong game.");

        	return tic_tac_toe.joinGame(game_id, {from: accounts[1]});
        }).then((result) => {
        	eventArgs = getEventArgs(result, PLAYER_JOINED_EVENT);
        	assert.isTrue(eventArgs !== false, "Player two did not join the game.");
        	assert.equal(accounts[1], eventArgs.player, "The wrong player joined the game.");
        	assert.equal(game_id.valueOf(), eventArgs.gameId.valueOf(), "Player two joined the wrong game.");

        	return tic_tac_toe.joinGame(game_id, {from: accounts[2]});
        }).then((result) => {
        	// assert that there is no event of a player that joined
        	eventArgs = getEventArgs(result, PLAYER_JOINED_EVENT);
        	assert.isTrue(eventArgs === false);
        });
    });

    it("should let the players make moves", () => {
        var tic_tac_toe;
        var game_id;
        return TicTacToe.deployed().then((instance) => {
    	    tic_tac_toe = instance;
    	    
    	    return tic_tac_toe.newGame();
        }).then((result) => {
        	eventArgs = getEventArgs(result, GAME_CREATED_EVENT);
        	game_id = eventArgs.gameId;

        	return tic_tac_toe.joinGame(game_id, {from: accounts[0]});
        }).then((result) => {
        	return tic_tac_toe.joinGame(game_id, {from: accounts[1]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[0]});
        }).then((result) => {
        	eventArgs = getEventArgs(result, PLAYER_MADE_MOVE_EVENT);
        	assert.isTrue(eventArgs !== false, "Player did not make a move.");
        	assert.equal(accounts[0], eventArgs.player, "The wrong player joined the game.");
        	assert.equal(game_id.valueOf(), eventArgs.gameId.valueOf(), "Player made move in the wrong game.");
        	assert.equal(0, eventArgs.xCoordinate.valueOf(), "Player made move in another cell.");
        	assert.equal(0, eventArgs.yCoordinate.valueOf(), "Player made move in another cell.");

        	return tic_tac_toe.makeMove(game_id, 1, 1, {from: accounts[1]});
        }).then((result) => {
        	eventArgs = getEventArgs(result, PLAYER_MADE_MOVE_EVENT);
        	assert.isTrue(eventArgs !== false, "Player did not make a move.");
        	assert.equal(accounts[1], eventArgs.player, "The wrong player joined the game.");
        	assert.equal(game_id.valueOf(), eventArgs.gameId.valueOf(), "Player made move in the wrong game.");
        	assert.equal(1, eventArgs.xCoordinate.valueOf(), "Player made move in another cell.");
        	assert.equal(1, eventArgs.yCoordinate.valueOf(), "Player made move in another cell.");

        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[0]});
        }).then((result) => {
        	eventArgs = getEventArgs(result, PLAYER_MADE_MOVE_EVENT);
        	assert.isTrue(eventArgs !== false, "Player did not make a move.");
        	assert.equal(accounts[0], eventArgs.player, "The wrong player joined the game.");
        	assert.equal(game_id.valueOf(), eventArgs.gameId.valueOf(), "Player made move in the wrong game.");
        	assert.equal(0, eventArgs.xCoordinate.valueOf(), "Player made move in another cell.");
        	assert.equal(1, eventArgs.yCoordinate.valueOf(), "Player made move in another cell.");

        	return tic_tac_toe.makeMove(game_id, 1, 2, {from: accounts[1]});
        }).then((result) => {
        	eventArgs = getEventArgs(result, PLAYER_MADE_MOVE_EVENT);
        	assert.isTrue(eventArgs !== false, "Player did not make a move.");
        	assert.equal(accounts[1], eventArgs.player, "The wrong player joined the game.");
        	assert.equal(game_id.valueOf(), eventArgs.gameId.valueOf(), "Player made move in the wrong game.");
        	assert.equal(1, eventArgs.xCoordinate.valueOf(), "Player made move in another cell.");
        	assert.equal(2, eventArgs.yCoordinate.valueOf(), "Player made move in another cell.");

        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[0]});
        }).then((result) => {
        	eventArgs = getEventArgs(result, GAME_OVER_EVENT);
        	assert.isTrue(eventArgs !== false, "Game is not over.");
        	assert.equal(1, eventArgs.winner, "The wrong player won the game (or draw).");
        	assert.equal(game_id.valueOf(), eventArgs.gameId.valueOf(), "Player won the wrong game.");
        });
    });

    it("should not let the same player make two moves in a row", () => {
        var tic_tac_toe;
        var game_id;
        return TicTacToe.deployed().then((instance) => {
    	    tic_tac_toe = instance;
    	    
    	    return tic_tac_toe.newGame();
        }).then((result) => {
        	eventArgs = getEventArgs(result, GAME_CREATED_EVENT);
        	game_id = eventArgs.gameId;

        	return tic_tac_toe.joinGame(game_id, {from: accounts[0]});
        }).then((result) => {
        	return tic_tac_toe.joinGame(game_id, {from: accounts[1]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[0]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[1]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 2, {from: accounts[1]});
        }).then((result) => {
        	// assert that there is no event of a player that made a move
        	eventArgs = getEventArgs(result, PLAYER_MADE_MOVE_EVENT);
        	assert.isTrue(eventArgs === false);
        });
    });

    it("should not let a player make a move at already filled coordinates", () => {
        var tic_tac_toe;
        var game_id;
        return TicTacToe.deployed().then((instance) => {
    	    tic_tac_toe = instance;
    	    
    	    return tic_tac_toe.newGame();
        }).then((result) => {
        	eventArgs = getEventArgs(result, GAME_CREATED_EVENT);
        	game_id = eventArgs.gameId;

        	return tic_tac_toe.joinGame(game_id, {from: accounts[0]});
        }).then((result) => {
        	return tic_tac_toe.joinGame(game_id, {from: accounts[1]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 0, {from: accounts[0]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[1]});
        }).then((result) => {
        	return tic_tac_toe.makeMove(game_id, 0, 1, {from: accounts[0]});
        }).then((result) => {
        	// assert that there is no event of a player that made a move
        	eventArgs = getEventArgs(result, PLAYER_MADE_MOVE_EVENT);
        	assert.isTrue(eventArgs === false);
        });
    });
});

// getEventArgs returns the event args from the transaction result,
// filtered by event_name.
// Returns the boolean `false` if no event with the given name was found.
function getEventArgs(transaction_result, event_name) {
	for (var i = 0; i < transaction_result.logs.length; i++) {
        var log = transaction_result.logs[i];

        if (log.event == event_name) {
            return log.args;
        }
    }

    return false;
}
