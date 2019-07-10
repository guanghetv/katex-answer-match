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
            }
        )).to.be.true
    });
    it(`返回seq---兼容旧数据--[1,1]`,function() {
        expect(judge(
            ['a','b'],
            {
                'blanks':['a','b'],
                isSeq: true
            }

        ).toString().toString()).to.equal('1,1')
    });
    it(`返回seq---兼容旧数据--[0,1,0]`,function() {
        expect(judge(
            ['a','b','k'],
            {
                'blanks':['a1','b','a'],
                isSeq: true
            }

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
    it('1支持多选题, 验证答案乱序', function () {
        expect(judge(
            ["一个角的余角一定是钝角", "锐角的余角一定是锐角"],
            {
                blanks: ["一个角的余角一定是钝角", "锐角的余角一定是锐角"]
            },
            1
        )).to.be.true
    })
    it('2支持多选题, 验证答案正序', function () {
        expect(judge(
            ['a', 'b'],
            {
                blanks: ['a', 'b']
            },
            1
        )).to.be.true
    })
    it('3支持多选题, 验证漏选+答案乱序', function () {
        expect(judge(
            ['a', 'b'],
            {
                blanks: ['b', 'a', 'c'],
                isSeq: true
            },
            1
        ).toString().toString()).to.equal('1,1,0')
    })
    it('4支持多选题, 验证漏选+答案正序', function () {
        expect(judge(
            ['a', 'b'],
            {
                blanks: ['a', 'b', 'c'],
                isSeq: true
            },
            1
        ).toString().toString()).to.equal('1,1,0')
    })
    it('5支持多选题, 验证漏选超过一个', function () {
        expect(judge(
            ['b'],
            {
                blanks: ['a', 'b', 'c'],
                isSeq: true
            },
            1
        ).toString().toString()).to.equal('0,1,0')
    })
    it('6支持多选题, 验证答案为空', function () {
        expect(judge(
            [],
            {
                blanks: ['a', 'b', 'c']
            },
            1
        )).to.be.false
    })
    it('7支持多选题, 验证空格', function () {
        expect(judge(
            ['a ', 'b', 'c'],
            {
                blanks: ['a', 'b', ' c']
            },
            1
        )).to.be.true
    })
});
