;(function (root, factory) {
    if ( typeof module === "object" && module.exports ) {
        // Node, or CommonJS-Like environments
        module.exports = factory();
    } else if ( typeof define === "function" && define.amd ) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        var game = this.game || {};
        game.EventEmitter = factory();
    }
}(this, function() {
    'use strict';

var hasOwnProperty = ({}).hasOwnProperty;
function EventEmitter() {}

EventEmitter.mixin = function(obj) {
    var proto = EventEmitter.prototype;

    for (var attr in EventEmitter.prototype) {
        if (hasOwnProperty.call(proto, attr)) {
            obj[attr] = proto[attr]
        }
    }
}

EventEmitter.prototype = {
    on: function(eventType, listener) {
        this._events = this._events || {};
        this._events[eventType] = this._events[eventType] || [];
        this._events[eventType].push(listener);
    },

    once: function(eventType, listener) {
        var self = this;
        function wrap() {
            listener.apply(null, arguments);
            self.off(eventType, listener);
        }

        wrap.fn = listener;
        return this.on(eventType, listener);
    },


    off: function(eventType, listener) {
        this._events = this._events || {};
        if (! listener) {
            delete this._events[eventType];
            return;
        } else if (! this._events[eventType]) {
            return;
        }

        var listeners = this._events[eventType],
            i, l;

        for (i = 0, l = listeners.length; i < l; i++) {
            if (listener === listeners[i] || listener === listeners[i].fn) {
                return !!listeners.splice(i, 1);
            }
        }
    },

    emit: function(eventType) {
        if (! this._events || ! this._events[eventType]) {
            return;
        }

        var listeners = this._events[eventType],
            args = [].slice.call(arguments, 1),
            i, l;

        for (i = 0, l = listeners.length; i < l; i++) {
            listeners[i].apply(null, args);
        }
    }
}

return EventEmitter;

}));
