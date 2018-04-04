# TicTacToe
TicTacToe is a solidity implementation of the tic tac toe game.
You can find the rules at https://en.wikipedia.org/wiki/Tic-tac-toe.

## Testing
To test, run
```
npm install
./node_modules/.bin/truffle test
```

It is important to use the pinned version `4.1.4` of truffle, as version `4.1.5` cannot run the tests written in solidity.

## Thoughts
### Tests
There are definitely still tests missing.
Also JS tests, but especially tests written as contracts.

### Code Duplication
There is still duplicate code inside the contract and the tests. That code should be refactored/extracted.

### Separation of concerns
Right now, the whole game is written in a single contract.
It would be better to split the contract.
At least storage of games and contract management should be extracted.

Using a separate contract for storage allows to exchange the game logic without losing the existing games.
Reasons for that could be for example a bugfix or an implementation that requires less gas.

Contract management would be required to be able to swap the game logic without changing the address of where the game can be found.
(Theoretirally also the storage, etc.).

### Management
In its current state, the contract can not be deleted or updated.
Some managament should be included after the separation of concerns is done.
It should allow to swap application logic or delete contracts (for authorized accounts only).

### Libraries
The code does not include any external libraries, be it via npm or EthPM. There are probably viable packages available, but as I am new to solidity, I don't have any experience with that, yet.

### Betting
An extension to the current contract would be the option to play for ether.
When opening the game, an amount should be fixed and players that want to join a game must pay that amount.
The winner takes all, a draw returns the funds.
