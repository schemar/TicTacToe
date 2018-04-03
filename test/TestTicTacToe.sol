pragma solidity ^0.4.21;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TicTacToe.sol";


contract TestTicTacToe {
    function testCreateaANewGame() public {
        TicTacToe ticTacToe = TicTacToe(DeployedAddresses.TicTacToe());

        Assert.notEqual(ticTacToe.newGame(), 0, "Game id should not be zero");
    }
}
