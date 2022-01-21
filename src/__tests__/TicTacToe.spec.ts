import {
	TicTacToeGame,
	TicTacToeManualPlayer,
	TicTacToeMoveResult,
	TicTacToeOutput,
	TicTacToeState,
} from '..';

class TicTacToeTestOutput implements TicTacToeOutput {
	public movesMade = 0;
	public gamesStarted = 0;
	public gamesEnded = 0;

	public onMove() {
		this.movesMade++;
	}

	public onGameOver() {
		this.gamesEnded++;
	}

	public onGameStart() {
		this.gamesStarted++;
	}
}

export = () => {
	const playerX = new TicTacToeManualPlayer('PlayerX', false);
	const playerO = new TicTacToeManualPlayer('PlayerO', false);
	const output = new TicTacToeTestOutput();

	const tttGame = new TicTacToeGame(playerX, playerO, undefined, output);

	it('announces start when a game is constructed', () => {
		expect(output.gamesStarted).to.equal(1);
	});

	it('announces end when a game is over', () => {
		tttGame.cancel();
		expect(output.gamesEnded).to.equal(1);
	});

	it('does not allow any moves when the game is over', () => {
		const result = tttGame.nextMove();
		expect(result).to.equal(TicTacToeMoveResult.GAME_UNAVAILABLE);
		expect(output.movesMade).to.equal(0);
	});

	it('announces start when a game is reset', () => {
		tttGame.reset();
		expect(output.gamesStarted).to.equal(2);
	});

	it('registers moves on the board', () => {
		const symbol = tttGame.getCurrentPlayerSymbol();

		tttGame.getCurrentPlayer().setNext(0, 0);
		const result = tttGame.nextMove();
		expect(result).to.equal(TicTacToeMoveResult.SUCCESS);
		expect(output.movesMade).to.equal(1);
		expect(tttGame.getBoard().getCell(0, 0)?.getSymbol()).to.equal(symbol);
	});

	it('does not allow invalid moves', () => {
		tttGame.getCurrentPlayer().setNext(0, 0);
		const result = tttGame.nextMove();
		expect(result).to.equal(TicTacToeMoveResult.INVALID);
		expect(output.movesMade).to.equal(1);
	});

	it('detects wins if a line is filled', () => {
		tttGame.reset();

		const player = tttGame.getCurrentPlayer();

		tttGame.getCurrentPlayer().setNext(0, 0);
		tttGame.nextMove();

		tttGame.getCurrentPlayer().setNext(1, 0);
		tttGame.nextMove();

		tttGame.getCurrentPlayer().setNext(0, 1);
		tttGame.nextMove();

		tttGame.getCurrentPlayer().setNext(1, 1);
		tttGame.nextMove();

		tttGame.getCurrentPlayer().setNext(0, 2);
		tttGame.nextMove();

		expect(output.gamesEnded).to.equal(2);
		expect(tttGame.isOver()).to.equal(true);
		expect(tttGame.getLastMove()?.getPlayer()).to.equal(player);
		expect(tttGame.getWinningCells()).to.never.equal(undefined);
	});

	it('cancels a game if no move is returned', () => {
		tttGame.reset();
		tttGame.nextMove();
		expect(tttGame.getState()).to.equal(TicTacToeState.CANCELLED);
		expect(output.gamesEnded).to.equal(3);
	});
};
