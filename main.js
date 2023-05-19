enchant();

const cell_size = 50;
const y_start = 50;
const x_start = 150;
const time_max = 30;
const cpu_waittime = 2;
const search_depth = 6; //偶数じゃないとバグる？<-そんなことないかも。なんでもバグる
var cpu_varsion = 2;
const font = '30px 游ゴシック';
const inf = 10000000;

var Board = Class.create(Sprite, {
  initialize: function(y, x) {
    Sprite.call(this, cell_size, cell_size);
    this.image = core.assets['board.png'];
    this.frame = stone[y][x];
    this.x = x * cell_size + x_start;
    this.y = y * cell_size + y_start;
    gamescene.addChild(this);
  }
});

function Board_update() { //stoneの値を画像フレームに適応させる
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      board[i][j].frame = stone[i][j];
    }
  }
}

function Put(stone, y, x, turn) { //指定したマスに石を置く
  stone[y][x] = turn; //指定したマスのデータを更新
  // board[y][x].frame = turn; //指定したマスの画像を更新
  count = 0; //ひっくり返すマスを数える
  for (var i = 1; i <= y; i++) {
    if (stone[y - i][x] === 3 - turn) count++;
    else if (stone[y - i][x] === turn) {
      for (var j = 1; j <= count; j++) {
        stone[y - j][x] = turn;
      }
      break;
    } else break;
  }
  count = 0;
  for (var i = 1; i <= y && i <= 7 - x; i++) {
    if (stone[y - i][x + i] === 3 - turn) count++;
    else if (stone[y - i][x + i] === turn) {
      for (var j = 1; j <= count; j++) {
        stone[y - j][x + j] = turn;
      }
      break;
    } else break;
  }
  count = 0;
  for (var i = 1; i <= 7 - x; i++) {
    if (stone[y][x + i] === 3 - turn) count++;
    else if (stone[y][x + i] === turn) {
      for (var j = 1; j <= count; j++) {
        stone[y][x + j] = turn;
      }
      break;
    } else break;
  }
  count = 0;
  for (var i = 1; i <= 7 - y && i <= 7 - x; i++) {
    if (stone[y + i][x + i] === 3 - turn) count++;
    else if (stone[y + i][x + i] === turn) {
      for (var j = 1; j <= count; j++) {
        stone[y + j][x + j] = turn;
      }
      break;
    } else break;
  }
  count = 0;
  for (var i = 1; i <= 7 - y; i++) {
    if (stone[y + i][x] === 3 - turn) count++;
    else if (stone[y + i][x] === turn) {
      for (var j = 1; j <= count; j++) {
        stone[y + j][x] = turn;
      }
      break;
    } else break;
  }
  count = 0;
  for (var i = 1; i <= 7 - y && i <= x; i++) {
    if (stone[y + i][x - i] === 3 - turn) count++;
    else if (stone[y + i][x - i] === turn) {
      for (var j = 1; j <= count; j++) {
        stone[y + j][x - j] = turn;
      }
      break;
    } else break;
  }
  count = 0;
  for (var i = 1; i <= x; i++) {
    if (stone[y][x - i] === 3 - turn) count++;
    else if (stone[y][x - i] === turn) {
      for (var j = 1; j <= count; j++) {
        stone[y][x - j] = turn;
      }
      break;
    } else break;
  }
  count = 0;
  for (var i = 1; i <= y && i <= x; i++) {
    if (stone[y - i][x - i] === 3 - turn) count++;
    else if (stone[y - i][x - i] === turn) {
      for (var j = 1; j <= count; j++) {
        stone[y - j][x - j] = turn;
      }
      break;
    } else break;
  }
}

function Turn_Change() { //ターン変更して表示
  turn = 3 - turn;
  time = time_max;
  turnLabel.text = `ターン　${player[turn - 1]}`;

}

function Count_Display() { //盤面の石の数を数えて表示
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

function Count(stone) { //盤面の石の数を数える
  var count = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (stone[i][j] === 1 || stone[i][j] === 2) count++;
    }
  }
  return count;
}

function Value(stone, turn) { //盤面の価値を返す

  var value_return = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (stone[i][j] === turn) {
        if (Count(stone) <= 40) value_return += value[cpu_varsion][i][j];
        else value_return += last_value[cpu_varsion][i][j];
      }
    }
  }
  return value_return;
}

function Put_Value(stone, y, x, turn) { //(x,y)に石を置いた時の盤面の価値を返す

  if (Count(stone) === 31) {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        value[cpu_varsion][i][j] = last_value[cpu_varsion][i][j];
      }
    }
  }
  var value_check = []; //stoneのコピーを作成
  for (var i = 0; i < 8; i++) value_check[i] = [];
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      value_check[i][j] = stone[i][j];
    }
  }

  Put(value_check, y, x, turn);

  return Value(value_check, turn);
}

function Put_Max_Value(stone, turn) {
  var value_max = -10000;
  var x, y;
  var can_put_flag = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (stone[i][j] === 3) {
        var value = Put_Value(stone, i, j, turn);
        console.log(value);
        can_put_flag = 1;
        if (value_max < value) {
          value_max = value;
          x = j;
          y = i;
        }
      }
    }
  }
  if (can_put_flag == 0) return 0;
  console.log(y, x);
  Put(stone, y, x, turn);
  Prepare(stone);
  return value_max;
}

function Board_cheak(cannotput_flag) {
  var stone_flag = 1;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (stone[i][j] === 3) {
        stone_flag = 0;
        cannotput_flag = 0;
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
      Prepare(stone);
      Board_cheak(1);
    }
  }

}

function Prepare(stone) {
  var stone_flag = 1;
  for (var i = 0; i < 8; i++) {
    label: for (var j = 0; j < 8; j++) {
      if (stone[i][j] === 0 || stone[i][j] === 3) {
        flag = 0;
        for (var k = 1; k <= i; k++) {
          if (stone[i - k][j] === 3 - turn) flag = 1;
          else if (stone[i - k][j] === turn && flag === 1) {
            stone[i][j] = 3;
            // board[i][j].frame = 3;
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
            stone[i][j] = 0;
            // board[i][j].frame = 0;
            break;
          }
        }
        flag = 0;
        for (var k = 1; k <= i && k <= 7 - j; k++) {
          if (stone[i - k][j + k] === 3 - turn) flag = 1;
          else if (stone[i - k][j + k] === turn && flag === 1) {
            stone[i][j] = 3;
            // board[i][j].frame = 3;
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
            stone[i][j] = 0;
            // board[i][j].frame = 0;
            break;
          }
        }
        flag = 0;
        for (var k = 1; k <= 7 - j; k++) {
          if (stone[i][j + k] === 3 - turn) flag = 1;
          else if (stone[i][j + k] === turn && flag === 1) {
            stone[i][j] = 3;
            // board[i][j].frame = 3;
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
            stone[i][j] = 0;
            // board[i][j].frame = 0;
            break;
          }
        }
        flag = 0;
        for (var k = 1; k <= 7 - i && k <= 7 - j; k++) {
          if (stone[i + k][j + k] === 3 - turn) flag = 1;
          else if (stone[i + k][j + k] === turn && flag === 1) {
            stone[i][j] = 3;
            // board[i][j].frame = 3;
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
            stone[i][j] = 0;
            // board[i][j].frame = 0;
            break;
          }
        }
        flag = 0;
        for (var k = 1; k <= 7 - i; k++) {
          if (stone[i + k][j] === 3 - turn) flag = 1;
          else if (stone[i + k][j] === turn && flag === 1) {
            stone[i][j] = 3;
            // board[i][j].frame = 3;
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
            stone[i][j] = 0;
            // board[i][j].frame = 0;
            break;
          }
        }
        flag = 0;
        for (var k = 1; k <= 7 - i && k <= j; k++) {
          if (stone[i + k][j - k] === 3 - turn) flag = 1;
          else if (stone[i + k][j - k] === turn && flag === 1) {
            stone[i][j] = 3;
            // board[i][j].frame = 3;
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
            stone[i][j] = 0;
            // board[i][j].frame = 0;
            break;
          }
        }
        flag = 0;
        for (var k = 1; k <= j; k++) {
          if (stone[i][j - k] === 3 - turn) flag = 1;
          else if (stone[i][j - k] === turn && flag === 1) {
            stone[i][j] = 3;
            // board[i][j].frame = 3;
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
            stone[i][j] = 0;
            // board[i][j].frame = 0;
            break;
          }
        }
        flag = 0;
        for (var k = 1; k <= i && k <= j; k++) {
          if (stone[i - k][j - k] === 3 - turn) flag = 1;
          else if (stone[i - k][j - k] === turn && flag === 1) {
            stone[i][j] = 3;
            // board[i][j].frame = 3;
            stone_flag = 0;
            cannotput_flag = 0;
            continue label;
          } else {
            stone[i][j] = 0;
            // board[i][j].frame = 0;
            break;
          }
        }
      }
    }
  }
}

function Random() { //ランダムに石をおく
  Machine(1);
  // for (var i = 0; i < 8; i++) {
  //   for (var j = 0; j < 8; j++) {
  //     if (stone[i][j] === 3)
  //       can_put_count++;
  //   }
  // }
  // var put_place = Math.floor(Math.random() * can_put_count);
  //
  // label: for (var y = 0; y < 8; y++) {
  //   for (var x = 0; x < 8; x++) {
  //     if (stone[y][x] === 3) {
  //       if (put_place-- === 0) {
  //
  //         Put(stone, y, x, turn);
  //         Turn_Change();
  //         Count_Display();
  //         Prepare(stone);
  //         Board_update();
  //         Board_cheak(0);
  //         can_put_count = 0;
  //         break label;
  //       }
  //     }
  //   }
  // }
}

var value_max_x;
var value_max_y;

function Search(received_stone, depth, turn, passed) {
  //底まで探索したら評価関数を実行
  if (depth === 0) return Value(received_stone, turn);

  //最大の価値を無限小に設定
  var max_value = -inf;

  //すべてのマスを探索
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      //もし石をおける場所なら
      if (received_stone[i][j] === 3) {

        //received_stoneをstoneにコピー
        var stone_copy = [];
        for (var k = 0; k < 8; k++) {
          stone_copy[k] = [];
        }
        for (var k = 0; k < 8; k++) {
          for (var l = 0; l < 8; l++) {
            stone_copy[k][l] = received_stone[k][l];
          }
        }

        Put(stone_copy, i, j, turn); //石を置いたとする
        Prepare(stone_copy); //stoneを整える
        var value = Search(stone_copy, depth - 1, 3 - turn, false);
        value = -value; //negamax法
        if (max_value < value) {
          max_value = value;

          //最上位ノードだったら石を置く場所を保存
          if (depth === search_depth) {
            console.log(value);
            console.log(value_max_y, value_max_x);
            value_max_x = j;
            value_max_y = i;
          }
        }
      }
    }
  }
  if (max_value === -inf) {
    if (passed) return Value(received_stone, turn);
    return (-Search(received_stone, depth, 3 - turn, true))
  }
  return max_value;
}

function Machine(cpu_varsion) { //CPUが石をおく。
  if (cpu_varsion === 0) { //盤面価値変動なし
    var value_max = 0;
    for (var i = 0; i < 8; i++)
      for (var j = 0; j < 8; j++)
        if (stone[i][j] === 3) {
          if (value[0][i][j] >= value_max) {
            if (value[0][i][j] > value_max) {
              value_max = value[0][i][j];
              can_put_count = 0;
            }
            can_put_count++;
          }
        }
    var put_place = Math.floor(Math.random() * can_put_count);

    label: for (var y = 0; y < 8; y++) {
      for (var x = 0; x < 8; x++) {
        if (stone[y][x] === 3 && value[0][y][x] === value_max) {
          if (put_place-- === 0) {

            Put(stone, y, x, turn);
            Turn_Change();
            Count_Display();
            Prepare(stone);
            Board_update();
            Board_cheak(0);
            can_put_count = 0;
            break label;
          }
        }
      }
    }
  }

  if (cpu_varsion === 1) { //盤面価値変動あり
    var value_max = -1000;
    var put_x, put_y;
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (stone[i][j] === 3) {
          if (Put_Value(stone, j, i, turn) > value_max) {
            value_max = Put_Value(stone, j, i, turn);
            put_x = j;
            put_y = i;
          }
        }
      }
    }

    Put(stone, put_y, put_x, turn);
    Turn_Change();
    Count_Display();
    Prepare(stone);
    Board_update();
    Board_cheak(0);
  }

  if (cpu_varsion === 2) { //盤面価値変動ありに加え、先読み

    console.log(Search(stone, search_depth, turn, false));
    // console.log(Search(stone, 2 * search_depth, turn));
    console.log(value_max_y, value_max_x);
    Put(stone, value_max_y, value_max_x, turn);
    Turn_Change();
    Count_Display();
    Prepare(stone);
    Board_update();
    Board_cheak(0);

  }
}

window.onload = function() {
  core = new Core(900, 500);
  core.preload("close.png", "board.png", "one_person.png", "two_person.png", "result_background.png", "setting_background.png", "title.png", "setting.png");
  core.fps = 30;
  core.onload = function() {
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
  value = [
    [
      [5, 1, 4, 4, 4, 4, 1, 5],
      [1, 1, 2, 2, 2, 2, 1, 1],
      [4, 2, 3, 3, 3, 3, 2, 4],
      [4, 2, 3, 0, 0, 3, 2, 4],
      [4, 2, 3, 0, 0, 3, 2, 4],
      [4, 2, 3, 3, 3, 3, 2, 4],
      [1, 1, 2, 2, 2, 2, 1, 1],
      [5, 1, 4, 4, 4, 4, 1, 5]
    ],

    [
      [30, -12, 0, -1, -1, 0, -12, 30],
      [-12, -15, -3, -3, -3, -3, -15, -12],
      [0, -3, 0, -1, -1, 0, -3, 0],
      [-1, -3, -1, -1, -1, -1, -3, -1],
      [-1, -3, -1, -1, -1, -1, -3, -1],
      [0, -3, 0, -1, -1, 0, -3, 0],
      [-12, -15, -3, -3, -3, -3, -15, -12],
      [30, -12, 0, -1, -1, 0, -12, 30]
    ],

    [
      [30, -5, 0, -1, -1, 0, -5, 30],
      [-5, -10, -3, -3, -3, -3, -10, -5],
      [0, -3, 0, -1, -1, 0, -3, 0],
      [-1, -3, -1, -1, -1, -1, -3, -1],
      [-1, -3, -1, -1, -1, -1, -3, -1],
      [0, -3, 0, -1, -1, 0, -3, 0],
      [-5, -10, -3, -3, -3, -3, -10, -5],
      [30, -5, 0, -1, -1, 0, -5, 30]
    ]
  ];
  last_value = [
    [
      [5, 1, 4, 4, 4, 4, 1, 5],
      [1, 1, 2, 2, 2, 2, 1, 1],
      [4, 2, 3, 3, 3, 3, 2, 4],
      [4, 2, 3, 0, 0, 3, 2, 4],
      [4, 2, 3, 0, 0, 3, 2, 4],
      [4, 2, 3, 3, 3, 3, 2, 4],
      [1, 1, 2, 2, 2, 2, 1, 1],
      [5, 1, 4, 4, 4, 4, 1, 5]
    ],

    [
      [150, 5, 30, 20, 20, 30, 5, 150],
      [5, 7, 10, 10, 10, 10, 7, 5],
      [30, 10, 10, 10, 10, 10, 10, 30],
      [20, 10, 10, 10, 10, 10, 10, 20],
      [20, 10, 10, 10, 10, 10, 10, 20],
      [30, 10, 10, 10, 10, 10, 10, 30],
      [5, 7, 10, 10, 10, 10, 7, 5],
      [150, 5, 30, 20, 20, 30, 5, 150]
    ],

    [
      [80, 10, 30, 20, 20, 30, 10, 80],
      [10, 5, 10, 10, 10, 10, 5, 10],
      [30, 10, 10, 10, 10, 10, 10, 30],
      [20, 10, 10, 10, 10, 10, 10, 20],
      [20, 10, 10, 10, 10, 10, 10, 20],
      [30, 10, 10, 10, 10, 10, 10, 30],
      [10, 5, 10, 10, 10, 10, 5, 10],
      [80, 10, 30, 20, 20, 30, 10, 80]
    ]
  ]
  can_put_count = 0
  player = ['シロ', 'クロ'];
  if (mode === true) player = ['CPU', 'クロ'];
  // cannotput_flag = 0;
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
  gamescene.addEventListener('enterframe', function(e) {
    frame++;
    if (frame === 30) {
      frame = 0;
      timeLabel.text = (time);
      // Prepare();←何のためかわからない。過去の自分に聞きたい。
      gamescene.removeChild(timeLabel);
      gamescene.addChild(timeLabel);
      if (time === 0) /*Random();*/ Machine(1);
      time--;
      if (mode === true && time === time_max - cpu_waittime && turn === 1) {
        Machine(cpu_varsion);
      }
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
      board[y][x].addEventListener("touchstart", function(e) {
        if (stone[(this.y - y_start) / cell_size][(this.x - x_start) / cell_size] === 3) {

          Put(stone, (this.y - y_start) / cell_size, (this.x - x_start) / cell_size, turn);
          Turn_Change();
          Count_Display();
          Prepare(stone);
          Board_update();
          Board_cheak(0);
        }
      });
    }
  }
  return gamescene;
}

function StartScene() {
  mode = false;
  startscene = new Scene();
  startscene.backgroundColor = "#00ced1";
  var button1 = new Sprite(150, 50);
  button1.image = core.assets['one_person.png'];
  button1.x = 375;
  button1.y = 350;
  var button2 = new Sprite(150, 50);
  button2.image = core.assets['two_person.png'];
  button2.x = 375;
  button2.y = 420;
  var title = new Sprite(820, 275);
  title.image = core.assets['title.png'];
  title.x = 40;
  title.y = 40;
  var setting = new Sprite(50, 50);
  setting.image = core.assets['setting.png'];
  setting.x = 10;
  setting.y = 10;
  startscene.addChild(button1);
  startscene.addChild(button2);
  startscene.addChild(title);
  startscene.addChild(setting);
  button1.addEventListener("touchstart", function(e) {
    mode = true;
    core.replaceScene(GameScene());
  });
  button2.addEventListener("touchstart", function(e) {
    core.replaceScene(GameScene());
  });
  setting.addEventListener("touchstart", function(e) {
    core.pushScene(SettingScene());
  });
  return startscene;
}

function SettingScene() {
  settingscene = new Scene();
  var background = new Sprite(600, 400);
  background.image = core.assets["setting_background.png"];
  background.x = 150;
  background.y = 50;
  var close = new Sprite(50, 50);
  close.image = core.assets["close.png"];
  close.x = 150;
  close.y = 50;
  settingscene.addChild(background);
  settingscene.addChild(close);
  close.addEventListener("touchstart", function(e) {
    core.replaceScene(StartScene());
  });

  return settingscene;
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
  winerLabel.font = font;
  resultscene.addChild(winerLabel);

  return resultscene;
}
