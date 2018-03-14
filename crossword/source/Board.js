;(function() {
"use strict";
var SPACES = /\s|\r\n|\n/,
    HORIZONTAL = 0,
    $ = game.$,
    VERTICAL   = 1,
    H = 0,
    V = 0,
    min = Math.min,
    max = Math.max;

function Board(options) {
    this.options = options;
    this.callback = options.callback;
    this.board  = [];
    this._words = [];
    this.chars  = {};
    this.size   = options.size;
    V = 0;
    H = 0;
    
    for (var i = 0; i < this.size; i++)
    {
        this.board.push({});
    }

    var w = [];
    for (var i = 0; i < options.words.length; i++) {
        w.push(options.words[i].replace(" ", ""));
    }

    options.words = w.join(" ");

    this.addWords(options.words);
    this.fillBoard();
}

var proto = Board.prototype;

// calcular puntaje de palabras y almacenarlas en this.words
proto.addWords = function(words) {
    var freq = {};
    
    this.words  = [];
    var _words = words.split(" ");
    
    for (var i = 0; i < words.length; i++)
    {
        freq[words[i]] = (freq[words[i]] || 0) + 1;
    }
    
    for (var i in freq)
    {
        this.chars[i] = [];
    }
    
    var score = 0,
        words = words.split(SPACES),
        curW, word;
    
    for (var i = 0; i < words.length; i++)
    {
        curW = $.splitString($.trim(words[i]));
        for (var j = 0; j < words.length; j++)
        {
            if (words[j] === words[i]) continue;

            word = $.splitString($.trim(words[j]));

            for (var ii = 0; ii < curW.length; ii++)
                if (curW[ii] === word[0]) {
                    score += 1;break;
                }
        }

        curW.score = score;
        this.words.push(curW);
        score = 0;
    }

    this.words = game.$.sort(this.words, function(a){
        return a ? a.length : -1;
    })
};

proto.fillBoard = function() {
    var bestScore = 0,
        bestIndex = -1,
        bestRatio = 0,
        words     = this.words.slice(0),
        bestRound = words.length,
        index     = 0,
        word,
        self      = this;
    
    ;(function f(){
        self.putFirstWord(words.splice(index++, 1)[0]);

        while (words.length)
        {
            for (var i = 0; i < words.length; i++)
            {
                var score = self.getBestScore(words[i]);
                
                if (score > bestScore) {
                    bestScore = score;
                    bestIndex = i;
                }
            }

            if (bestIndex != -1)  {
                word = words.splice(bestIndex, 1)[0];
                self.insertWord(word, word.x, word.y, word.direction);
            } else {
                break;
            }

            bestScore = 0;
            bestIndex = -1;
        }
        
        var width = self.board.endx - self.board.inix;
        var height = self.board.endy - self.board.iniy;
        var ratio = min(width, height)/max(width, height);

        if (words.length < bestRound) {
            bestRatio = ratio;
            self.bestBoard = self.board;
            self.bestWords = self._words;
            bestRound = words.length;
        }
        
        if (index >= self.words.length) {
            self.makeGrid();
            return;
        }
        
        self.board  = [];
        self._words = [];
        self.chars  = {};
        for (var i = 0; i < self.size; i++) { self.board.push({}); }
        words = self.words.slice(0);
        
        setTimeout(f, 1);
    }());
};

proto.getBestScore = function(word) {
    var bestScore = 0;
    for (var i = 0; i < word.length; i++)
    {
        var char = word[i];
        
        if (!this.chars[char]) continue;
        
        for (var j = 0; j < this.chars[char].length; j+=2)
        {
            
            var score = this.calcScore(word, i, this.chars[char][j], this.chars[char][j+1]);
            if (score > bestScore)
            {
                bestScore = score;
            }            
        }
    }
    
    return bestScore;
};

var lst = VERTICAL;
proto.calcScore = function(word, at, x, y) {
    var hScore = this.horizontalScore(word, at, x, y);
    var vScore = this.verticalScore(word, at, x, y);
    
    if (vScore && vScore > hScore) {
        word.x = x;
        word.y = y-at;
        word.direction = VERTICAL;
        return vScore
    } else if (hScore) {
        word.x = x-at;
        word.y = y;
        word.direction = HORIZONTAL;
        return hScore
    }
    
    return 0;
};

proto.horizontalScore = function(word, at, x, y) {
    var ini   = x - at,
        end   = x + word.length - 1 - at,
        score = 0,
        board = this.board;

    // cabe?board.
    if (ini < 0 || end >= this.size) return 0;

    
    // inicia/termina enseguida celdas ocupadas
    if ((board[ini-1] && board[ini-1][y]) || 
        (board[end+1] && board[end+1][y])) {
            return 0;
    }
    
    var i, length = word.length;
    
    for (i = 0; i < length; i++)
    {
        if (board[ini+i][y] && board[ini+i][y] === word[i]) score++;
        else if (board[ini+i][y] && board[ini+i][y] != word[i]) return 0;
        else if (!board[ini+i][y] && (board[ini+i][y+1] || board[ini+i][y-1])) return 0;
    }
    
    var width  = max(board.endx, end) - min(board.inix, ini),
        height = max(board.endy, y)  - min(board.iniy, y);

    return score+word.score;
};

proto.verticalScore = function(word, at, x, y) {
    var ini = y - at,
        end = y + word.length - at - 1,
        score = 0,
        board = this.board;
        
    // palabra no cabe
    if (ini < 0 || end >= this.size) return 0;

    // inicia/termina enseguida de una celda ocupada
    if (board[x][ini-1] || board[x][end+1]) return 0;

    var i, length = word.length;

    for (i = 0; i < length; i++)
    {
        if (board[x][ini+i] && board[x][ini+i] === word[i]) score++;
        else if (board[x][ini+i] && board[x][ini+i] != word[i]) return 0;
        else if (!board[x][ini+i] && ((board[x-1] && board[x-1][ini+i]) || (board[x+1] && board[x+1][ini+i]))) return 0;
    }
    
    var width  = max(board.endx, x) - min(board.inix, x),
        height = max(board.endy, end) - min(board.iniy, ini);

    return score+word.score;
};

proto.putFirstWord = function(word) {
    this.board.inix = this.board.iniy = this.size;
    this.board.endx = this.board.endy = 0;
    this.insertWord(word, 2, 0, VERTICAL);
};

proto.insertWord = function(word, x, y, direction) {
    var length = word.length,
        board  = this.board,
        chars  = this.chars,
        i;
    
    this._words.push({
        word: word.join(""),
        x: x,
        y: y,
        dir: direction
    });
    board.inix = min(board.inix, x);
    board.iniy = min(board.iniy, y);
    
    if (direction == HORIZONTAL)
    {   
        board.endx = max(board.endx, x + length);
        board.endy = max(board.endy, y);
        for (i = 0; i < length; i++)
        {
            board[x+i][y] = word[i];
            (chars[word[i]] || (chars[word[i]] = [])).push(x+i, y);
        }
        H++;
    }
    else
    {
        board.endx = max(board.endx, x);
        board.endy = max(board.endy, y + length);
        for (i = 0; i < length; i++)
        {
            board[x][y + i] = word[i];
            (chars[word[i]] || (chars[word[i]] = [])).push(x, y+i);
        }
        V++;
    }
};

proto.makeGrid = function() {
    var grid  = [],
        board = this.bestBoard;

    for (var i = board.iniy; i < board.endy; i++)
    {
        var row = [];

        for (var j = board.inix; j < board.endx; j++)
        {
            if (board[j][i]){
                row.push(createCell(board[j][i]));
            } else {
                row.push(0);
            }
        }
        grid.push(row);
    }

    grid.width =  board.endx;
    grid.height = board.endy;

    for (var i = 0; i < this.bestWords.length; i++) {
        this.bestWords[i].x -= board.inix;
        this.bestWords[i].y -= board.iniy;
    }

    this.callback(grid, this.bestWords);
};

function createCell(char) {
    return {
        char: char
    }
}

window.game = window.game || {};
game.Board = Board;
}());
