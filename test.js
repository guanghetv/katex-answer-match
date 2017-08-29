const chai = require('chai');
const expect = chai.expect;

const judge = require('./').katex_answer_match;

describe('', function(){

    it('normal',function() {
        expect(judge('a', 'b')).to.be.false;
        expect(judge('aaa', 'bbb')).to.be.false;
        expect(judge('aaa', 'aaa')).to.be.true;
    });

    it('left',function() {
        expect(judge(' abc', 'abc')).to.be.true;
        expect(judge('abc', '\tabc')).to.be.true; //制表符
        expect(judge('　abc', ' abc')).to.be.true; //全角空格
        expect(judge('  abc', '  abc')).to.be.true;
        expect(judge('  abc', 'abd')).to.be.false;
    });

    it('right',function() {
        expect(judge('abc ', 'abc')).to.be.true;
        expect(judge('abc', 'abc\t')).to.be.true; //制表符
        expect(judge('abc ', 'abc　')).to.be.true; //全角空格
        expect(judge('abc  ', 'abc ')).to.be.true;
        expect(judge('abc  ', 'abd')).to.be.false;
    });

    it('middle',function() {
        expect(judge('a bc', 'abc')).to.be.true;
        expect(judge('a\tb\tc', 'abc')).to.be.true; //制表符
        expect(judge('abc', 'a　bc')).to.be.true; //全角空格
        expect(judge('abc', 'a b c')).to.be.true;
    });

    it('mixed',function() {
        expect(judge(' a b c ', 'abc')).to.be.true;
        expect(judge(' a\tb   c    ', 'abc')).to.be.true; //制表符
        expect(judge('abc', ' a　b c ')).to.be.true; //全角空格
        expect(judge('abc', ' a  b   c   ')).to.be.true;
        expect(judge(' a b c ', ' a  b   c   ')).to.be.true;
    });
});