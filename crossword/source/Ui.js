;(function(){

var game = window.game || {},
    uuid = 0,
    APPNAME = "html5-crossword";

// this template is too tiny to use a complex library
function template(id) {
var tmpl = ['',
    '<article id="{APPNAME}-topbar-{id}">',
    '    <p id="{APPNAME}-clue-{id}"><b>Select one cell to start</b></p>',
    '    <button data-cevent="toggle-options">options</button>',
    '</article>',
    '<div id="{APPNAME}-board-{id}" class="{APPNAME}-board">',
    '<div id="{APPNAME}-clue2-{id}" class="{APPNAME}-clue2 hide"></div>',
    '<canvas></canvas>',
    '    <div class="{APPNAME}-overlay" data-cevent="toggle-options"></div>',
    '    <div class="{APPNAME}-options">',
    '    <ul>',
    '        <li><button data-cevent="download">Download</button></li>',
    '        <li><button data-cevent="confirm">Solve</button></li>',
    '        <li class="{APPNAME}-confirm">',
    '        <button class="{APPNAME}-no"data-cevent="confirm">No</button>',
    '        <button class="{APPNAME}-yes" data-cevent="solve">Yes</button></li>',
    '        <li><button data-cevent="toggle-options">Close</button></li>',
    '    </ul>',
    '<div class="{APPNAME}-modal" id="{APPNAME}-modal-{id}"></div>',
    '    </div>',
    '</div>'].join("\n");

    return tmpl.replace(/\{APPNAME\}/g, APPNAME).replace(/\{id\}/g, id);
}

var modalTemplate = ['<h3>{title}</h3>','<p>{message}</p>'].join("\n");

function UI(container) {
    this.id = ++uuid;
    this.container = container;
    container.className = APPNAME;
    container.innerHTML = template(this.id);

    this.canvas = container.getElementsByTagName("canvas")[0];
    this.clueE  = this.getElement("clue");
    this.clue2  = this.getElement("clue2");
    this.board  = this.getElement("board");

    var toggleOptions = game.$.bind(this.toggleOptions, this);
    this.on("toggle-options", toggleOptions);
    this.on("solve", toggleOptions);

    var self = this;
    this.on("confirm", function(event){
        game.$.toggleClass(self.board, "confirm");
    });

    initEvents(this);
}

game.EventEmitter.mixin(UI.prototype);

UI.prototype.getElement = function(partialId) {
    return game.$.$("html5-crossword-"+partialId+"-"+this.id);
};

UI.prototype.getCanvas = function() {
    return this.canvas;
};

UI.prototype.changeClue = function(clue) {
    this.clueE.innerHTML = clue;
    this.clue2.innerHTML = clue;
    if (game.IS_MOBILE) {
        var self = this;
        setTimeout(function(){
            game.$.removeClass(self.clue2, "hide");
        }, 1000);
    }
};

UI.prototype.hideClue = function() {
    game.$.addClass(this.clue2, "hide");
}

UI.prototype.toggleOptions = function() {
    var self = this;
    game.$.toggleClass(this.board, "show-options");
    if (game.$.hasClass(this.board, "show-modal"))
    setTimeout(function(){
        game.$.removeClass(self.board, "show-modal");
    }, 1000);

    setTimeout(function(){
        game.$.removeClass(self.board, "confirm");
    }, 600);
};

UI.prototype.getBoard = function() {
    return this.board;
};

UI.prototype.setSize = function(size) {
    this.canvas.width  = size;
    this.canvas.height = size;
    this.board.style.width  = size + "px";
    this.board.style.height = size + "px";
    this.container.style.width = size + "px";
};

UI.prototype.showModal = function(options) {
    var tag, text = modalTemplate;

    for (var tag in options) {
        if (options.hasOwnProperty(tag))
            text = text.replace('{'+tag+'}', options[tag]);
    }

    this.getElement("modal").innerHTML = text;

    this.toggleOptions();
    game.$.addClass(this.board, "show-modal");
}

function initEvents(self) {
    self.container.addEventListener("click", function(event){
        var customEvent = event.target.getAttribute("data-cevent");
        if (customEvent) {
            event.preventDefault();
            self.emit(customEvent);
        }
    });
}

game.UI = UI;
}());