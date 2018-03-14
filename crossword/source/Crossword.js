;(function(){
    "use strict";

    var game = window.game || {},
        PADDING    = 10,
        HORIZONTAL = 0,
        VERTICAL   = 1,
        DEFAULT_CELL_SIZE=20,

        BACKWARD = -1,
        FORWARD  =  1,
        isMobile = /android|ios/i.test(navigator.userAgent),
        IS_ANDROID = /android/i.test(navigator.userAgent),
        IS_STOCK   = !/firefox|chrome|opera/i.test(navigator.userAgent),

        IS_ROMAN = /^(es|en)/.test(navigator.language),

        /* Game styles */
        cellStyle  = {
            fillStyle: 'white',
            shadowColor: '#333',
            shadowOffsetX: 3,
            shadowOffsetY: Modernizr.shadowBlurBug ? -3 : 3,
            shadowBlur: 4
        },
        borderStyle = {
            fillStyle: 'black',
            shadowBlur: 0,
            shadowOffsetY: 0,
            shadowOffsetX: 0
        },
        fontStyle  = {
            fillStyle: "black",
            textBaseline: "middle",
            textAlign: "center"
        };

function Crossword(options) {
    this.options  = options;
    this.ui       = new game.UI(options.container);
    this.keyboard = new MobileKeyboardEvents(this.ui.getBoard());
    this.pointer  = new PointerTracker(this.ui.canvas, this.keyboard.input);

    this.options.congratMsg = (options.container.getAttribute("msg") ||
                                "You solved it in {time}");
    
    this.keyboard.on("close", game.$.bind(function(){
        this.ui.hideClue();
        this.keyboard.input.style.paddingTop = 0;
        this.clearLastSelection();
        drawBoard.call(this);
    }, this));

    game.$.bindAll(this, "pointerHandler",
                         "keyboarHandler",
                         "keydownHandler",
                         "solve");

    this.pointer.on('down', this.pointerHandler);
    this.keyboard.on('key', this.keyboarHandler);
    this.keyboard.input.addEventListener("keydown", this.keydownHandler);
    window.addEventListener("resize", this.resize);
    this.ui.on('solve', this.solve);
    var self = this;
    this.ui.on('download', function(){
        var base = self.options.baseURL.split("/").slice(0, -1).join("")||".";

        if (! self.form ) {
            self.form = document.createElement("form"),
            self.textarea = document.createElement("textarea");
            self.form.action = base+"/download/index.php";
            self.textarea.name = "data";
            self.form.method = "post";
            self.form.appendChild(self.textarea);
            self.form.style.display = "none";
            document.body.appendChild(self.form);
        }

        var json = JSON.stringify({
            board: self.solution,
            clues: self.clues,
            title: self.options.title || "Crossword"
        });

        if (IS_ANDROID && IS_STOCK) {
            location.href = base+"/download/index.php?data=" + encodeURI(json);
        } else {
            self.textarea.value = json;
            self.form.submit();
        }
    });

    if (options.board) {this.board = options.board; return; }
    this.createBoard(options.words);
}

Crossword.prototype.createBoard = function(words) {
    var self = this;
    new game.Board({
        words: game.$.values(words),
        size: this.options.size,
        callback: function(board, words) {
            self.solution = board;
            self.board    = game.$.cloneBoard(board);
            self.clues    = self.getClues(words);
            self.width    = board.width  || self.options.size;
            self.height   = board.height || self.options.size;
            resize.call(self);
        }
    });
}

/**
 * Handle keyboard navigation on desktop
 * @param  {event} event
 */
Crossword.prototype.keydownHandler = function(event){
    var keyCode = event.keyCode,
        vx = 0, vy = 0, self = this;

             if (keyCode === 37) vx = -1;
        else if (keyCode === 39) vx =  1;
        else if (keyCode === 38) vy = -1;
        else if (keyCode === 40) vy =  1;
        else return;

    if (! this.cellExists(this.col+vx, this.row+vy)) return;

    setTimeout(function() {
        self.startTracking(self.col+vx, self.row+vy);
    });
}

/**
 * Calcula la posición de la celda seleccionado por el usuario
 * @param  {Object} points posición del mouse
 */
Crossword.prototype.pointerHandler = function (points){
    game.IS_MOBILE = isMobile = points.isTouch;

    var start = points.start,
        ty    = this.getTranslation(),
        col   = (start.x - PADDING) / this.CELL_SIZE | 0,
        row   = (start.y - PADDING + ty) / this.CELL_SIZE | 0;

    if (! this.cellExists(col, row)) {
        return this.keyboard.close();
    }

    if (this.__finish){
        this.col = col;
        this.row = row;
        this.highlightSelection();
        drawBoard.call(this);
        return;
    }
    this.keyboard.open();
    if (game.IS_MOBILE) {
        window.scrollTo(this.pointer._pos.x, this.pointer._pos.y-60);
        this.keyboard.input.style.paddingTop = (this.getTranslation())+"px";
    }
    this.startTracking(col, row);
}

/**
 * Maneja la entrada de texto
 * Nota:
 *       La entrada de texto es emulada
 *       consultando el valor de un textarea a intervalos regulares
 *       
 * @param  {Object} event contiene el valor actual del textarea
 */
Crossword.prototype.keyboarHandler = function (event){
    if (this.__finish) return;

    var chars = game.$.splitString((event.string || "").toUpperCase()),
        len   = chars.length,
        text  = [];

    this.clearText();

    text = this.insertChars(chars);
    
    // only clear if using roman letters
    if (IS_ROMAN && event.BACKSPACE && len > text.length) {
        this.getCurrentCell().char = "";
        this.keyboard.setText(text.join(""));
    }

    this.highlightSelection(true);
    drawBoard.call(this);

    if (this.isSolved()) {
        this.ui.hideClue();
        this.ui.showModal({
            title: "Congratulations",
            message: this.options.congratMsg.replace("{time}",
                    game.$.format((new Date).getTime() - this.__start))
        });
        this.__finish = true;
    }
}

Crossword.prototype.startTracking = function(col, row) {
    this.col = col;
    this.row = row;
    this.highlightSelection();
    this.showClue();
    this.keyboard.setText( this.getText() );
    drawBoard.call(this);
}

/**
 * Borra el texto de la columna/fila actual
 */
Crossword.prototype.clearText = function() {
    this.setVelocity(BACKWARD);

    while (this.canGetNextCell()) {
        this.getCurrentCell().char = " ";
        this.advanceToNextCell();
    }
}

/**
 * Inserta los caracteres en la fila/columna actual
 * Si hay mas caracteres que celdas, descarta todos los caracteres despues del penultimo
 * menos el ultimo 
 * @param  {Array} chars caracteres a insertar
 * @return {Array}       caracteres insertados
 */
Crossword.prototype.insertChars = function(chars) {
    var text = [], char;

    this.setVelocity(1);

    while (chars.length) {
        char = chars.shift() || "";
        this.getCurrentCell().char = char;

        if (this.canGetNextCell()) {
            text.push(char);
            this.advanceToNextCell();
        }
    }

    return text;
}

Crossword.prototype.advanceToNextCell = function() {
    this.col += this.vx;
    this.row += this.vy;
}

function resize() {
    this.CELL_SIZE = this.options.cellStyle || DEFAULT_CELL_SIZE;
    var width = Math.max(this.width, this.height, 14);

    var size = width  * this.CELL_SIZE + PADDING * 2;
    if (size > window.innerWidth) {
        var cell_size = (window.innerWidth-PADDING*2)/width;
        size = width  * cell_size + PADDING * 2;
        this.CELL_SIZE = ~~cell_size
    }

    this.fontSize = this.CELL_SIZE * .9 | 0;
    this.fontFamily = this.ui.canvas.style.fontFamily || "Arial";
    this.ui.setSize(~~size);
    drawBoard.call(this);
}

/**
 * Obtiene el texto que hay desde el inicio de la fila/columna
 * hasta la celda actual
 * @return {String}
 */
Crossword.prototype.getText = function() {
    var text = [];

    this.savePosition();

    this.setVelocity(BACKWARD);

    while (this.getCurrentCell()) {
        text.push(this.getCurrentCell().char || " ");
        this.advanceToNextCell();
    }

    this.restorePosition();

    return text.reverse().slice(0, -1).join("");
};

Crossword.prototype.setVelocity = function(v) {
    this.vx = this.curDir == HORIZONTAL ? v : 0;
    this.vy = this.curDir == VERTICAL   ? v : 0;
}

Crossword.prototype.savePosition = function() {
    this._col = this.col;
    this._row = this.row;
};

Crossword.prototype.restorePosition = function() {
    this.col = this._col;
    this.row = this._row;
}

Crossword.prototype.getClues = function(wordsUsed) {
    var clues = game.$.inverse(this.options.words),
        cluesUsed = {};

    for (var i = 0; i < wordsUsed.length; i++) {
        var w = wordsUsed[i];
        cluesUsed[w.x + "," + w.y + "," + w.dir] = clues[w.word];
    }

    return cluesUsed;
}

Crossword.prototype.solve = function() {
    var attr, attr2, char;
    this.__finish = true;
    for (attr in this.board) {
        for (attr2 in this.board[attr]) {
            if (! this.solution[attr][attr2]) continue;
            char = this.solution[attr][attr2].char.toUpperCase();
            this.board[attr][attr2].char = char;
        }
    }

    drawBoard.call(this);
}

/**
 * Is the current cell an intersection
 * @return {Boolean}
 */
Crossword.prototype.isIntersection = function () {
    return this.isAcross() && this.isDown();
}

/**
 * Is the current cell across
 * @return {Boolean}
 */
Crossword.prototype.isAcross = function () {
    return !!(this.getCell(this.col+1, this.row) || this.getCell(this.col-1, this.row));
}

/**
 * Is the current cell down
 * @return {Boolean}
 */
Crossword.prototype.isDown = function () {
    return !!(this.getCell(this.col, this.row+1) || this.getCell(this.col, this.row-1));
}

// es posible avansar a la siguiente celda?
Crossword.prototype.canGetNextCell = function() {
    return this.getCell(this.col + this.vx, this.row + this.vy);
}

// existe una celda en la posición especicada?
Crossword.prototype.cellExists = function(col, row) {
    return !! this.getCell(col, row);
};

/**
 * Returns the cell under (col, row) or null if position is empty
 * @param  {Number} col column
 * @param  {Number} row row
 * @return {Object|null}
 */
Crossword.prototype.getCell = function(col, row) {
    return this.board[row] && this.board[row][col] ? this.board[row][col] : null;
}

Crossword.prototype.getCurrentCell = function() {
    return this.getCell(this.col, this.row);
}

/**
 * Calculate the translation needed to center the selected cell in mobile devices 
 * @return {Number}
 */
Crossword.prototype.getTranslation = function() {
    if (! isMobile || ! this.keyboard.isOpen()) {
        return 0;
    }
    //if (this.row * this.CELL_SIZE > this.CELL_SIZE * 3 )
        return ~~( (this.row * this.CELL_SIZE)-(this.CELL_SIZE * 7) );
    return 0;
}

/**
 * Show the clue for the current cell
 * @return {undefined}
 */
Crossword.prototype.showClue = function() {
    var index;

    this.savePosition();

    this.setVelocity(BACKWARD);

    while (this.canGetNextCell()) {
        this.advanceToNextCell();
    }

    index = this.col + "," + this.row + "," + this.curDir;

    this.restorePosition();

    if (!this.__start) {
        this.__start = (new Date).getTime();
    }

    this.ui.changeClue(this.clues[index]);
}

/**
 * Compare the board with the solution
 * @return {Boolean}
 */
Crossword.prototype.isSolved = function() {
    var row, col, char1, char2;

    for (row in this.board) {
        if (!this.board[row]) continue;
        for (col in this.board[row]) {
            if (!this.board[row][col]) continue;
            char1 = this.board[row][col].char.toLowerCase(),
            char2 = this.solution[row][col].char.toLowerCase();
            if (char1 !== char2) {
                return false;
            }
        }
    }

    return true;
}

/**
 * [highlightSelection description]
 * @param  {Number} col
 * @param  {Number} row
 */
Crossword.prototype.highlightSelection = function (isW) {
    if (! isW)
    this.setDirection();

    var vx   = this.curDir == HORIZONTAL ? 1 : 0,
        vy   = this.curDir == VERTICAL   ? 1 : 0,
        currentCell = this.getCurrentCell();

    this.clearLastSelection();
    this.changeCellsColor(this.col, this.row, vx, vy, "orange");

    if (currentCell)
    currentCell.color = "aqua";

    this.saveState(vx, vy);
}

/**
 * Saves current state so we can clear the selection the next time
 * @param  {number} vx
 * @param  {Number} vy
 */
Crossword.prototype.saveState = function(vx, vy) {
    this.lastCol = this.col;
    this.lastRow = this.row;

    this._lastSelection = {
        vx: vx,
        vy: vy,
        col: this.col,
        row: this.row
    };
}

Crossword.prototype.clearLastSelection = function() {
    if (! this._lastSelection) return;

    var ls = this._lastSelection;

    this.changeCellsColor(ls.col, ls.row, ls.vx, ls.vy, '');
}

/**
 * Changes direction of selection only if:
 *     - is not posible to maintain the direction of the selection
 *     - click/tap two times in the same cell
 */
Crossword.prototype.setDirection = function() {
    var isSameCell = this.lastCol == this.col && this.lastRow == this.row;

    if (isSameCell && this.isIntersection()) {
        this.curDir = this.curDir === VERTICAL ? HORIZONTAL : VERTICAL;
    } else if (this.curDir === VERTICAL) {
        this.curDir =  this.isDown() ? VERTICAL : HORIZONTAL;
    } else {
        this.curDir = this.isAcross() ? HORIZONTAL : VERTICAL;
    }
}

Crossword.prototype.changeCellsColor = function (col, row, vx, vy, color) {
    if (vx > 0 || vy > 0)
        this.changeCellsColor(col, row, -vx, -vy, color);

    var cell;

    while (this.cellExists(col, row)) {
        this.getCell(col, row).color = color;
        col += vx;
        row += vy;
    }
}

function drawBoard(ctx) {
    var width  = this.width,
        height = this.height,
        board  = this.board,
        ctx    = this.ui.canvas.getContext('2d'),
        CELL_SIZE = this.CELL_SIZE,
        cell, y, x, posX, posY;

    ctx.canvas.width = ctx.canvas.width;
    ctx.font = this.fontSize + "px " + this.fontFamily;

    if (this.getTranslation())
        ctx.translate(0, -this.getTranslation());

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            if (! (board[y] && board[y][x]))
                continue;

            posX = (PADDING + x * CELL_SIZE)|0;
            posY = (PADDING + y * CELL_SIZE)|0;
            cell = board[y][x];
            drawCell.call(this, ctx, posX, posY, cell);
        }
    }
}

function drawCell(ctx, col, row, cell) {
    game.$.applyStyle(ctx, cellStyle);

    ctx.fillStyle = cell.color || ctx.fillStyle;
    ctx.fillRect(col, row, this.CELL_SIZE, this.CELL_SIZE);

    game.$.applyStyle(ctx, borderStyle);
    game.$.applyStyle(ctx, fontStyle);
    ctx.fillText(cell.char, col + ~~(this.fontSize*.6), row+~~(this.fontSize*.6)+1);
    ctx.strokeRect(col, row, this.CELL_SIZE, this.CELL_SIZE);
}

game.Crossword = Crossword;
}());