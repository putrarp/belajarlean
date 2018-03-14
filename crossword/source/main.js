;(function(){
Modernizr.addTest("shadowBlurBug", function(){
    var ctx = document.createElement("canvas").getContext("2d");
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 4;
    ctx.shadowColor = "red";
    ctx.fillRect(100, 100, 30, 30);
    var data = ctx.getImageData(107, 96, 1, 1).data;
    return data[3] !== 0;
});

var baseURL = (function(){
    var scripts = document.getElementsByTagName("script");
    var src = scripts[scripts.length-1].getAttribute("src");
    return src.split("/").slice(0, -1).join("/");
}());

Modernizr.load({
    load: [
        baseURL+'/common/Utils.js',
        baseURL+'/common/MKEvents.min.js',
        baseURL+'/common/EventEmitter.js',
        baseURL+'/common/reqwest.min.js',
        baseURL+'/common/PointerTracker.min.js',
        baseURL+'/Board.js',
        baseURL+'/Ui.js',
        baseURL+'/Crossword.js'
    ],

    complete: function(e) {
        var crosswords = document.getElementsByTagName("crossword"),
            GET = game.$.parseQueryString(),
            crossword, url;

        for (var i = 0; i < crosswords.length; i++) {
            crossword = crosswords[i];
            if (GET.puzzle)
                url = "lists/"+GET.puzzle+".txt"
            else
                url = crossword.getAttribute("src");
            getCluesFromURL(crossword, url);
        }
    }
});

function getCluesFromURL(crossword, url) {
reqwest({
    url: url+"?"+(new Date).getTime(),
    type: "text",
    success: (function(crossword){
        return function(req) {
            var data = game.$.parseData(req.response||req.responseText);
            var cross = new game.Crossword({
                size: 17,
                baseURL: baseURL,
                words: data.list,
                title: data.options.title,
                container: crossword
            });
        }}(crossword)),
    error: function() {
        throw new Error("Can't load");
    }
});
}
}());
