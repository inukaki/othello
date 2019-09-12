enchant();

const cell_size = 50;
const y_start = 50;
const x_start = 150;
const time_max = 1;
const font = '30px イカモドキ';

var Board = Class.create(Sprite, {
  initialize: function (y, x) {
    Sprite.call(this, cell_size, cell_size);
    this.image = core.assets['board.png'];
    this.frame = stone[y][x];
    this.x = x * cell_size + x_start;
    this.y = y * cell_size + y_start;
    gamescene.addChild(this);
  }
});

function Turn(y, x) {
  stone[y][x] = turn;
  board[y][x].frame = turn;
  flag = 0;
  for (var i = 1; i <= y; i++) {
    if (stone[y - i][x] === 3 - turn) flag++;
    else if (stone[y - i][x] === turn) {
      for (var j = 1; j <= flag; j++) {
        stone[y - j][x] = turn;
        board[y - j][x].frame = turn;
      }
      break;
    } else break;
  }
  flag = 0;
  for (var i = 1; i <= y && i <= 7 - x; i++) {
    if (stone[y - i][x + i] === 3 - turn) flag++;
    else if (stone[y - i][x + i] === turn) {
      for (var j = 1; j <= flag; j++) {
        stone[y - j][x + j] = turn;
        board[y - j][x + j].frame = turn;
      }
      break;
    } else break;
  }
  flag = 0;
  for (var i = 1; i <= 7 - x; i++) {
    if (stone[y][x + i] === 3 - turn) flag++;
    else if (stone[y][x + i] === turn) {
      for (var j = 1; j <= flag; j++) {
        stone[y][x + j] = turn;
        board[y][x + j].frame = turn;
      }
      break;
    } else break;
  }
  flag = 0;
  for (var i = 1; i <= 7 - y && i <= 7 - x; i++) {
    if (stone[y + i][x + i] === 3 - turn) flag++;
    else if (stone[y + i][x + i] === turn) {
      for (var j = 1; j <= flag; j++) {
        stone[y + j][x + j] = turn;
        board[y + j][x + j].frame = turn;
      }
      break;
    } else break;
  }
  flag = 0;
  for (var i = 1; i <= 7 - y; i++) {
    if (stone[y + i][x] === 3 - turn) flag++;
    else if (stone[y + i][x] === turn) {
      for (var j = 1; j <= flag; j++) {
        stone[y + j][x] = turn;
        board[y + j][x].frame = turn;
      }
      break;
    } else break;
  }
  flag = 0;
  for (var i = 1; i <= 7 - y && i <= x; i++) {
    if (stone[y + i][x - i] === 3 - turn) flag++;
    else if (stone[y + i][x - i] === turn) {
      for (var j = 1; j <= flag; j++) {
        stone[y + j][x - j] = turn;
        board[y + j][x - j].frame = turn;
      }
      break;
    } else break;
  }
  flag = 0;
  for (var i = 1; i <= x; i++) {
    if (stone[y][x - i] === 3 - turn) flag++;
    else if (stone[y][x - i] === turn) {
      for (var j = 1; j <= flag; j++) {
        stone[y][x - j] = turn;
        board[y][x - j].frame = turn;
      }
      break;
    } else break;
  }
  flag = 0;
  for (var i = 1; i <= y && i <= x; i++) {
    if (stone[y - i][x - i] === 3 - turn) flag++;
    else if (stone[y - i][x - i] === turn) {
      for (var j = 1; j <= flag; j++) {
        stone[y - j][x - j] = turn;
        board[y - j][x - j].frame = turn;
      }
      break;
    } else break;
  }

  turn = 3 - turn;
  time = time_max;
  turnLabel.text = `ターン　${player[turn - 1]}`;
  black_count = 0;
  white_count = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (stone[i][j] === 1) white_count++;
      if (stone[i][j] === 2) black_count++;
    }
  }
  scoreLabel.text = `${black_count}:${white_count}`;
}

function Prepare() {
  var stone_flag = 1;
  for (var i = 0; i < 8; i++) {
    label: for (var j = 0; j < 8; j++) {
      if (stone[i][j] === 0 || stone[i][j] === 3) {
        flag = 0;
        for (var k = 1; k <= i; k++) {
          if (stone[i - k][j] === 3 - turn) flag = 1;
          else if (stone[i - k][j] === turn && flag === 1) {
            stone[i][j] = 3;
            board[i][j].frame = 3;
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
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
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
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
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
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
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
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
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
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
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
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
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
            stone[i][j] = 0;
            board[i][j].frame = 0;
            break;
          }
        }
        flag = 0;
        for (var k = 1; k <= i && k <= j; k++) {
          if (stone[i - k][j - k] === 3 - turn) flag = 1;
          else if (stone[i - k][j - k] === turn && flag === 1) {
            stone[i][j] = 3;
            board[i][j].frame = 3;
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
            stone[i][j] = 0;
            board[i][j].frame = 0;
            break;
          }
        }
      }
    }
  }
  if (stone_flag === 1) {
    if (cannotput_flag === 1) {
      alert("2人とも置けないので、ゲームを終了します。");
      cannotput_flag = 0;
      core.pushScene(ResultScene());
    } else {
      alert("置ける場所がないので、ターンが変わります。");
      turn = 3 - turn;
      time = time_max;
      turnLabel.text = `ターン　${player[turn - 1]}`;
      cannotput_flag = 1;
      Prepare();
    }
  }
}

function Random() {
  for (var i = 0; i < 8; i++)
    for (var j = 0; j < 8; j++)
      if (stone[i][j] === 3)
        can_put_count++;
  var put_place = Math.floor(Math.random() * can_put_count);

  label: for (var y = 0; y < 8; y++) {
    for (var x = 0; x < 8; x++) {
      if (stone[y][x] === 3) {
        if (put_place-- === 0) {
          Turn(y, x);
          Prepare();
          can_put_count = 0;
          break label;
        }
      }
    }
  }
}
window.onload = function () {
  core = new Core(900, 500);
  core.preload("board.png", "start.png", "result_background.png");
  core.fps = 30;
  core.onload = function () {
    core.replaceScene(StartScene());
  }
  core.start();
}

function GameScene() {
  gamescene = new Scene();
  gamescene.backgroundColor = "#00ced1";
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
  can_put_count = 0
  player = ['シロ', 'クロ'];
  cannotput_flag = 0;
  turn = 2;
  turnLabel = new Label(`ターン　${player[turn - 1]}`);
  turnLabel.x = 10;
  turnLabel.y = 10;
  turnLabel.color = 'black';
  turnLabel.font = font;
  gamescene.addChild(turnLabel);
  time = time_max;
  timeLabel = new Label();
  timeLabel.x = 430;
  timeLabel.y = 10;
  timeLabel.color = 'black';
  timeLabel.font = font;
  gamescene.addChild(timeLabel);
  frame = 0;
  gamescene.addEventListener('enterframe', function (e) {
    frame++;
    if (frame === 30) {
      frame = 0;
      timeLabel.text = (time);
      Prepare();
      gamescene.removeChild(timeLabel);
      gamescene.addChild(timeLabel);
      if (time === 0) Random();
      time--;
    }
  });
  black_count = 0;
  white_count = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (stone[i][j] === 1) white_count++;
      if (stone[i][j] === 2) black_count++;
    }
  }
  bwLabel = new Label("クロ:シロ");
  bwLabel.x = 650;
  bwLabel.y = 10;
  bwLabel.color = 'black';
  bwLabel.font = font;
  gamescene.addChild(bwLabel);
  scoreLabel = new Label(`${black_count}:${white_count}`);
  scoreLabel.x = 680;
  scoreLabel.y = 50;
  scoreLabel.color = 'black';
  scoreLabel.font = font;
  gamescene.addChild(scoreLabel);
  board = [];
  for (var i = 0; i < 8; i++) board[i] = [];
  for (var y = 0; y < 8; y++) {
    for (var x = 0; x < 8; x++) {
      board[y][x] = new Board(y, x);
      board[y][x].addEventListener("touchstart", function (e) {
        if (stone[(this.y - y_start) / cell_size][(this.x - x_start) / cell_size] === 3) {
          Turn((this.y - y_start) / cell_size, (this.x - x_start) / cell_size);
          Prepare();
        }
      });
    }
  }
  return gamescene;
}

function StartScene() {
  startscene = new Scene();
  var button = new Sprite(150, 50);
  button.image = core.assets['start.png'];
  button.x = 400;
  button.y = 220;
  startscene.addChild(button);
  button.addEventListener("touchstart", function (e) {
    core.replaceScene(GameScene());
  });
  return startscene;
}

function ResultScene() {
  resultscene = new Scene();
  var background = new Sprite(400, 300);
  background.image = core.assets["result_background.png"];
  background.x = 560;
  background.y = 100;
  resultscene.addChild(background);
  var black = 0;
  var white = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (stone[i][j] === 1) white++;
      if (stone[i][j] === 2) black++;
    }
  }
  var winerLabel = new Label();
  if (white > black) winerLabel.text = "白の勝ち！";
  else if (black > white) winerLabel.text = "黒の勝ち！";
  else winerLabel.text = "引き分け！";
  winerLabel.x = background.x + 110;
  winerLabel.y = background.y + 145;
  winerLabel.color = "#800000";
  winerLabel.font = '30px イカモドキ';
  resultscene.addChild(winerLabel);

  return resultscene;
}
