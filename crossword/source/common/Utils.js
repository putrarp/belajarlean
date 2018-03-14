;(function(){
"use strict";
var toString = Object.prototype.toString,
    hasOwn   = Object.prototype.hasOwnProperty;

function addClass(elem, klass) {
    if (!hasClass(elem, klass))
    elem.className += " " + klass;
}

function hasClass(elem, klass) {
    return (" "+elem.className+" ").indexOf(" "+klass+" ") !== -1;
}

function toggleClass(elem, klass) {
    if (hasClass(elem, klass))
        removeClass(elem, klass);
    else
        addClass(elem, klass);
}

function removeClass(elem, klass) {
    if (hasClass(elem, klass))
    elem.className = trim((" "+elem.className+" ").replace(" "+klass, ""));
}

function $(id) { return document.getElementById(id); }

function is(o, t) { return toString.call(o).toLowerCase() == "[object "+t+"]"; }

function trim(s) { return s.replace(/^\s+|\s+$/g, ""); }

// convierte una lista de palabras en un objeto {key: value}
function parseData(data, sep) {
    data = data.split(/\r\n|\n/g);
    sep  = sep || ":";

    var R = {}, i, l = data.length, item, line,
        options = {};

    for (var i = 0; i < l; i++)
    {
        line = trim(data[i]);
        if (!line) continue;

        item = data[i].split(sep);

        if (line.charAt(0) === "#") {
            var key = trim(item[0]||item[1]||"").slice(1)
            options[key] = trim(item[1] || "");
        } else {
            R[trim(item[1]||item[0]||"")] = trim(item[0] || "");
        }

    }

    return {
        list: R,
        options: options
    };
}

function bind(fn, context) {
    return function() {
        return fn.apply(context, arguments);
    }
}

function bindAll(context) {
    var methods = [].slice.call(arguments, 1);

    for (var i = 0; i < methods.length; i++) {
        context[methods[i]]=bind(context[methods[i]], context);
    }
}

// extrae keys de un objeto
function values(obj) {
    var R = [], i;
    for (i in obj) if (obj.hasOwnProperty(i)) R.push(obj[i]);
    return R; 
}

// invierte los atributos de un objeto {key: value} => {value: key}
function inverse(obj) {
    var R = {}, i;
    for (i in obj) if (obj.hasOwnProperty(i)) R[obj[i].replace(" ", "")] = i;
    return R;
}

function cloneBoard(obj) {
    var clon = [];

    for (var attr in obj) {
        if (! obj.hasOwnProperty(attr)) continue;

        if (is(obj[attr], "array"))
            clon.push(cloneBoard(obj[attr]));
        else if (attr !== "width" && attr !== "height")
            clon.push(!obj[attr] ? 0 : {char: ""});
    }

    return clon;
}

function applyStyle(ctx, style) {
    for (var attr in style) {
        if (style.hasOwnProperty(attr))
            ctx[attr] = style[attr]
    }
}

// unicode combining marks
    var rMarks = /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F\u0483-\u0489\u0591-\u05BD]/;
    
    function stringLength(string) {
        var length = string.length,
            count  = length,
            i;
        
        for (i = 0; i < length; i++) {
            if (rMarks.test(string.charAt(i))) {
                count--;
            }
        }
            
        return count;
    }
    
    function splitString(string) {
        var length = string.length,
            chars  = [],
            i;
        
        for (i = 0; i < length; i++) {
            if (rMarks.test(string.charAt(i))) {
                chars[chars.length-1] += string.charAt(i);      
            } else {
                chars.push(string.charAt(i));
            }
        }
        
        return chars;
    }

    function parseQueryString() {
        if (location.query) { return; }
        
        var parts = location.search.replace(/^[?]/, "").split("&"),
            i     = 0,
            l     = parts.length,
            part,
            GET   = {};

        for (; i < l; i++) {
            if (!parts[i]) { continue; }
            part = parts[i].split("=");
            GET[unescape(part[0])] = decodeURI(part[1]);
        }

        return GET;
    }

function format(t) {
if (typeof t !== 'number') return "--:--";

t = ~~(t/1000);
var s = t%60,
    m = ~~(t/60),
    h = ~~(m/60);
    m %= 60;

return (h ? (h > 9 ? h : '0' + h) + ':' : '') +
       (m > 9 ? m : '0' + m%60) + ':' +
       (s > 9 ? s : '0' + s)
}

function merge(left, right, key) {
    var result = [],
        i = 0,
        j = 0;
        
    while (left.length || right.length)
    {
        if ((left.length && key(left[0]) >= key(right[0])) || !right.length) result.push(left.shift());
        else result.push(right.shift());
    }

    return result;
}

function identity(a) { return a; }

function mergeSort(array, key) {
    if (array.length < 2) { return array; }
    
    key = key || identity;

    var mid   = Math.ceil(array.length / 2),
        left  = mergeSort(array.slice(0, mid), key),
        right = mergeSort(array.slice(mid), key);
    
    return merge(left, right, key);
}

window.game = window.game || {};
game.$ = {
    $: $,
    trim: trim,
    applyStyle: applyStyle,
    cloneBoard: cloneBoard,
    parseData: parseData,
    values: values,
    bind: bind,
    bindAll: bindAll,
    inverse: inverse,
    addClass: addClass,
    format: format,
    is: is,
    sort: mergeSort,
    removeClass: removeClass,
    toggleClass: toggleClass,
    hasClass: hasClass,
    stringLength: stringLength,
    splitString: splitString,
    parseQueryString: parseQueryString
};
}());
