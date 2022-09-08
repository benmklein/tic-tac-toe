"use strict";
const gameState = (() => {
    const player = { token: 'X' };
    const computer = { token: 'O' };
    let _gameArray = Array(9).fill(null);
    const makeMove = (playerToken, i) => {
        if (gameState.getWinnerToken())
            return;
        _gameArray[i] = _gameArray[i] || playerToken;
        displayController.updateBoard(gameState.showGameArray());
        if (gameState.getWinnerToken())
            gameDriver.declareWinner("Player");
        else
            computerMove();
    };
    const computerMove = () => {
        if (checkTie()) {
            gameDriver.declareWinner('tie');
            return;
        }
        let compPlayed = false;
        while (compPlayed === false) {
            const compChoice = Math.floor(Math.random() * 9);
            if (_gameArray[compChoice] === null) {
                _gameArray[compChoice] = computer.token;
                compPlayed = true;
            }
        }
        displayController.updateBoard(gameState.showGameArray());
        if (gameState.getWinnerToken())
            gameDriver.declareWinner("Computer");
    };
    const checkTie = () => {
        for (let space of _gameArray) {
            if (space === null)
                return false;
        }
        return true;
    };
    const getWinnerToken = () => {
        if (_gameArray[0] && (_gameArray[0] === _gameArray[1] && _gameArray[1] === _gameArray[2]))
            return _gameArray[0];
        if (_gameArray[0] && (_gameArray[0] === _gameArray[3] && _gameArray[3] === _gameArray[6]))
            return _gameArray[0];
        if (_gameArray[0] && (_gameArray[0] === _gameArray[4] && _gameArray[4] === _gameArray[8]))
            return _gameArray[0];
        if (_gameArray[1] && (_gameArray[1] === _gameArray[4] && _gameArray[4] === _gameArray[7]))
            return _gameArray[1];
        if (_gameArray[2] && (_gameArray[2] === _gameArray[5] && _gameArray[5] === _gameArray[8]))
            return _gameArray[2];
        if (_gameArray[2] && (_gameArray[2] === _gameArray[4] && _gameArray[4] === _gameArray[6]))
            return _gameArray[2];
        if (_gameArray[3] && (_gameArray[3] === _gameArray[4] && _gameArray[4] === _gameArray[5]))
            return _gameArray[3];
        if (_gameArray[6] && (_gameArray[6] === _gameArray[7] && _gameArray[7] === _gameArray[8]))
            return _gameArray[6];
        return null;
    };
    const showGameArray = () => structuredClone(_gameArray);
    const resetBoard = () => _gameArray = Array(9).fill(null);
    return {
        makeMove,
        showGameArray,
        resetBoard,
        getWinnerToken,
        checkTie
    };
})();
const playerFactory = (token, name) => {
    const makeMove = (i) => {
        gameState.makeMove(token, i);
        console.log(`Player: ${name} placed a ${token} on position ${i}`);
    };
    return {
        makeMove
    };
};
const displayController = ((doc) => {
    let _boardSpaces = [];
    const createGameInDOM = () => {
        var _a;
        if (!!_boardSpaces && _boardSpaces.length > 0)
            return console.error('Board is already created in DOM');
        const container = doc.createElement('div');
        container.classList.add('container');
        (_a = doc.querySelector('body')) === null || _a === void 0 ? void 0 : _a.appendChild(container);
        for (let i = 0; i < 9; i++) {
            const boardSpaceDiv = doc.createElement('div');
            boardSpaceDiv.classList.add('board-space');
            boardSpaceDiv.setAttribute('data-position', String(i));
            boardSpaceDiv.setAttribute('onclick', `player.makeMove(${String(i)})`);
            container.appendChild(boardSpaceDiv);
        }
        _boardSpaces = Array.from(doc.querySelectorAll('.board-space'));
    };
    const updateBoard = (board) => {
        var _a;
        for (let node of _boardSpaces) {
            const id = Number.parseInt((_a = node.getAttribute('data-position')) !== null && _a !== void 0 ? _a : 'Null');
            if (isNaN(id)) {
                console.error(`Attribute:data-position is not parsable to a number on ${node}`);
                continue;
            }
            node.textContent = board[id];
        }
    };
    const displayResetButton = () => {
        const formbg = doc.querySelector('.reset-bg');
        formbg.style.display = 'block';
    };
    const hideResetButton = () => {
        const formbg = doc.querySelector('.reset-bg');
        formbg.style.display = 'none';
    };
    const setResultText = (result) => {
        doc.querySelector('.result-text').textContent = result;
    };
    return {
        createGameInDOM,
        updateBoard,
        displayResetButton,
        hideResetButton,
        setResultText
    };
})(document);
const gameDriver = (() => {
    const reset = () => {
        displayController.hideResetButton();
        gameState.resetBoard();
        displayController.updateBoard(gameState.showGameArray());
    };
    const declareWinner = (winner) => {
        let result = '';
        if (winner === 'tie') {
            result = 'It\'s a tie.';
        }
        else
            result = winner + ' has won the game!';
        displayController.displayResetButton();
        displayController.setResultText(result);
    };
    return {
        reset,
        declareWinner
    };
})();
const player = playerFactory('X', 'Ben');
const computer = playerFactory('O', 'Computer');
displayController.createGameInDOM();
displayController.updateBoard(gameState.showGameArray());
