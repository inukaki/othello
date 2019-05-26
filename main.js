enchant();

const cell_size = 50;
const y_start = 50;
const x_start = 50;

var Board = Class.create(Sprite, {
	initialize: function (y, x) {
		Sprite.call(this, cell_size, cell_size);
		this.image = core.assets['board.png'];
		this.frame = stone[y][x];
		this.x = x * cell_size + x_start;
		this.y = y * cell_size + y_start;
		core.rootScene.addChild(this);
	}
});
function Turn(y, x) {
	if (stone[y][x] === 3) {
		stone[y][x] = turn;
		board[y][x].frame = turn;
		var flag = 0;
		for (var i = 1; i <= y; i++) {
			if (stone[y - i][x] === 3 - turn) flag++;
			else if (stone[y - i][x] === turn) {
				for (var j = 1; j <= flag; j++) {
					stone[y - j][x] = turn;
					board[y - j][x].frame = turn;
				}
				break;
			}
			else break;
		}
		var flag = 0;
		for (var i = 1; i <= y && i <= 7 - x; i++) {
			if (stone[y - i][x + i] === 3 - turn) flag++;
			else if (stone[y - i][x + i] === turn) {
				for (var j = 1; j <= flag; j++) {
					stone[y - j][x + j] = turn;
					board[y - j][x + j].frame = turn;
				}
				break;
			}
			else break;
		}
		var flag = 0;
		for (var i = 1; i <= 7 - x; i++) {
			if (stone[y][x + i] === 3 - turn) flag++;
			else if (stone[y][x + i] === turn) {
				for (var j = 1; j <= flag; j++) {
					stone[y][x + j] = turn;
					board[y][x + j].frame = turn;
				}
				break;
			}
			else break;
		}
		var flag = 0;
		for (var i = 1; i <= 7 - y && i <= 7 - x; i++) {
			if (stone[y + i][x + i] === 3 - turn) flag++;
			else if (stone[y + i][x + i] === turn) {
				for (var j = 1; j <= flag; j++) {
					stone[y + j][x + j] = turn;
					board[y + j][x + j].frame = turn;
				}
				break;
			}
			else break;
		}
		var flag = 0;
		for (var i = 1; i <= 7 - y; i++) {
			if (stone[y + i][x] === 3 - turn) flag++;
			else if (stone[y + i][x] === turn) {
				for (var j = 1; j <= flag; j++) {
					stone[y + j][x] = turn;
					board[y + j][x].frame = turn;
				}
				break;
			}
			else break;
		}
		var flag = 0;
		for (var i = 1; i <= 7 - y && i <= x; i++) {
			if (stone[y + i][x - i] === 3 - turn) flag++;
			else if (stone[y + i][x - i] === turn) {
				for (var j = 1; j <= flag; j++) {
					stone[y + j][x - j] = turn;
					board[y + j][x - j].frame = turn;
				}
				break;
			}
			else break;
		}
		var flag = 0;
		for (var i = 1; i <= x; i++) {
			if (stone[y][x - i] === 3 - turn) flag++;
			else if (stone[y][x - i] === turn) {
				for (var j = 1; j <= flag; j++) {
					stone[y][x - j] = turn;
					board[y][x - j].frame = turn;
				}
				break;
			}
			else break;
		}
		var flag = 0;
		for (var i = 1; i <= y && i <= x; i++) {
			if (stone[y - i][x - i] === 3 - turn) flag++;
			else if (stone[y - i][x - i] === turn) {
				for (var j = 1; j <= flag; j++) {
					stone[y - j][x - j] = turn;
					board[y - j][x - j].frame = turn;
				}
				break;
			}
			else break;
		}
		turn = 3 - turn;
		for (var i = 0; i < 8; i++) {
			label: for (var j = 0; j < 8; j++) {
				if (stone[i][j] == 0 || stone[i][j] === 3) {
					flag = 0;
					for (var k = 1; k <= i; k++) {
						if (stone[i - k][j] === 3 - turn) flag = 1;
						else if (stone[i - k][j] === turn && flag === 1) {
							stone[i][j] = 3;
							board[i][j].frame = 3;
							continue label;
						}
						else {
							stone[i][j] = 0;
							board[i][j].frame = 0;
							break;
						}
					}
					flag = 0;
					for (var k = 1; k <= i && k <= 7 - j; k++) {
						if (stone[i - k][j + k] === 3 - turn) flag = 1;
						else if (stone[i - k][j + k] === turn && flag === 1) {
							stone[i][j] = 3;
							board[i][j].frame = 3;
							continue label;
						}
						else {
							stone[i][j] = 0;
							board[i][j].frame = 0;
							break;
						}
					}
					flag = 0;
					for (var k = 1; k <= 7 - j; k++) {
						if (stone[i][j + k] === 3 - turn) flag = 1;
						else if (stone[i][j + k] === turn && flag === 1) {
							stone[i][j] = 3;
							board[i][j].frame = 3;
							continue label;
						}
						else {
							stone[i][j] = 0;
							board[i][j].frame = 0;
							break;
						}
					}
					flag = 0;
					for (var k = 1; k <= 7 - i && k <= 7 - j; k++) {
						if (stone[i + k][j + k] === 3 - turn) flag = 1;
						else if (stone[i + k][j + k] === turn && flag === 1) {
							stone[i][j] = 3;
							board[i][j].frame = 3;
							continue label;
						}
						else {
							stone[i][j] = 0;
							board[i][j].frame = 0;
							break;
						}
					}
					flag = 0;
					for (var k = 1; k <= 7 - i; k++) {
						if (stone[i + k][j] === 3 - turn) flag = 1;
						else if (stone[i + k][j] === turn && flag === 1) {
							stone[i][j] = 3;
							board[i][j].frame = 3;
							continue label;
						}
						else {
							stone[i][j] = 0;
							board[i][j].frame = 0;
							break;
						}
					}
					flag = 0;
					for (var k = 1; k <= 7 - i && k <= j; k++) {
						if (stone[i + k][j - k] === 3 - turn) flag = 1;
						else if (stone[i + k][j - k] === turn && flag === 1) {
							stone[i][j] = 3;
							board[i][j].frame = 3;
							continue label;
						}
						else {
							stone[i][j] = 0;
							board[i][j].frame = 0;
							break;
						}
					}
					flag = 0;
					for (var k = 1; k <= j; k++) {
						if (stone[i][j - k] === 3 - turn) flag = 1;
						else if (stone[i][j - k] === turn && flag === 1) {
							stone[i][j] = 3;
							board[i][j].frame = 3;
							continue label;
						}
						else {
							stone[i][j] = 0;
							board[i][j].frame = 0;
							break;
						}
					} flag = 0;
					for (var k = 1; k <= i && k <= j; k++) {
						if (stone[i - k][j - k] === 3 - turn) flag = 1;
						else if (stone[i - k][j - k] === turn && flag === 1) {
							stone[i][j] = 3;
							board[i][j].frame = 3;
							continue label;
						}
						else {
							stone[i][j] = 0;
							board[i][j].frame = 0;
							break;
						}
					}
				}
			}
		}
		for (var k = 0; k < 8; k++)console.log(stone[k]);
		a = 5;
		console.log(a);
		console.log();
	}
}
window.onload = function () {
	core = new Core(cell_size * 8 + y_start, cell_size * 8 + x_start);
	core.preload("board.png");
	core.onload = function () {
		stone = [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 3, 0, 0, 0, 0],
			[0, 0, 3, 1, 2, 0, 0, 0],
			[0, 0, 0, 2, 1, 3, 0, 0],
			[0, 0, 0, 0, 3, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0]
		];
		turn = 2;
		board = [];
		for (var i = 0; i < 8; i++) board[i] = [];
		for (var y = 0; y < 8; y++) {
			for (var x = 0; x < 8; x++) {
				board[y][x] = new Board(y, x);
				board[y][x].addEventListener("touchstart", function (e) {
					console.log(this.y / cell_size, this.x / cell_size);
					if (stone[this.y / cell_size][this.x / cell_size] === 3) Turn(this.y / cell_size, this.x / cell_size);
				});
			}
		}
	}
	core.start();
}
