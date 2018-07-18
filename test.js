const chai = require('chai');
const expect = chai.expect;

const judge = require('./').katex_answer_match;
const blank = [' abc','　abc','\tabc','a\tb\tc',' a\tb   c    ','abc\t'];
describe('', function(){

    it(`返回boolean---兼容旧数据`,function() {
        expect(judge(
            ['a','b'],
            {
                'blanks':['a','b'],
            },
        )).to.be.true
    });
    it(`返回seq---兼容旧数据--[1,1]`,function() {
        expect(judge(
            ['a','b'],
            {
                'blanks':['a','b'],
                isSeq: true
            },

        ).toString().toString()).to.equal('1,1')
    });
    it(`返回seq---兼容旧数据--[0,1,0]`,function() {
        expect(judge(
            ['a','b','k'],
            {
                'blanks':['a1','b','a'],
                isSeq: true
            },

        ).toString().toString()).to.equal('0,1,0')
    });

    it('兼容旧数据--全角空格／制表符/空格',function() {
        expect(judge(
            blank,
            {
                'blanks':blank
            }
        )).to.be.true;
    });
    it('支持多答案',function() {
        expect(judge(
            [' abc','b'],
            {
                'blanks':['a','b'],
                'extendedBlanks':[
                    blank,
                    ['b']
                ],
                'groups': null
            }
        )).to.be.true;
    });
    var answersForSpace = function(item, index){
        it(`${index}支持多答案--全角空格／制表符/空格`,function() {
            expect(judge(
                [item,'b'],
                {
                    'extendedBlanks':[
                        ['abc'],
                        ['b']
                    ],
                    'groups': null
                }
            )).to.be.true;
        });
    }
    blank.forEach( (val,index) => {
        answersForSpace(val, index)
    })

    it('支持乱序',function() {
        expect(judge(
            ['b','abc'],
            {
                'extendedBlanks':[
                    ['abc'],
                    ['b']
                ],
                'groups': [
                    [0,1]
                ]
            }
        )).to.be.true;
    });
    var orderForSpace = function(item, index){
        it(`${index}支持乱序--全角空格／制表符/空格`,function() {
            expect(judge(
                ['b',item],
                {
                    'extendedBlanks':[
                        ['abc'],
                        ['b']
                    ],
                    'groups': [
                        [0,1]
                    ]
                }
            )).to.be.true;
        });
    }
    blank.forEach( (val,index) => {
        orderForSpace(val, index)
    })
    it('支持多答案&乱序true',function() {
        expect(judge(
            ['abc','b','f'],
            {
                'extendedBlanks':[
                    blank,
                    ['b'],
                    ['f']
                ],
                'groups': [
                    [1,2]
                ]
            }
        )).to.be.true;
    });
    it('支持多答案&乱序false',function() {
        expect(judge(
            ['b','abc','f'],
            {
                'extendedBlanks':[
                    blank,
                    ['b'],
                    ['f']
                ],
                'groups': [
                    [1,2]
                ]
            }
        )).to.be.false;
    });
    var answersOrderForSpace = function(item, index){
        it(`${index}支持多答案&乱序true--全角空格／制表符/空格`,function() {
            expect(judge(
                [item,'f','b'],
                {
                    'extendedBlanks':[
                        ['abc'],
                        ['b'],
                        ['f']
                    ],
                    'groups': [
                        [1,2]
                    ]
                }
            )).to.be.true;
        });
    }
    blank.forEach( (val,index) => {
        answersOrderForSpace(val, index)
    })
});