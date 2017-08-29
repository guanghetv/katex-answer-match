+(function() {
    'use strict';
    var katex_answer_match = function(origin, dest){
        origin = origin || ''
        dest = dest || ''
        return origin.replace(/\s+/g, '') === dest.replace(/\s+/g, '')
    }
    this.katex_answer_match = katex_answer_match
}.call(this))
