+(function() {
    'use strict';
    var katex_answer_match = function(origin, dest){
        if (origin === undefined || origin === null) {
            origin = ''
        }
        if (dest === undefined || dest === null) {
            dest = ''
        }
        if (typeof origin !== 'string' || typeof dest !== 'string') {
            throw Error('params need string')
        }
        return origin.replace(/\s+/g, '') === dest.replace(/\s+/g, '')
    }
    this.katex_answer_match = katex_answer_match
}.call(this))
