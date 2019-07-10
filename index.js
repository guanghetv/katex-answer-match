+(function() {
    'use strict';
    const COMPARE_ALGORITHM = {
        DIFFERENT: 1
    }
    var katex_answer_match = function(userAnswers = [], {extendedBlanks = [], groups = [], blanks = [], isSeq = false} = {}, type){
        if (extendedBlanks.length === 0 && blanks.length === 0) {
            console.warn('extendedBlanks blanks必须传入其中一个');
            return false
        }
        if (userAnswers.length === 0) {
            console.warn('userAnswers 必传');
            return false
        }
        const correctAnswers = handleBlanks(extendedBlanks, blanks)
        userAnswers = handleUserAnswers(userAnswers)
        if (type === COMPARE_ALGORITHM.DIFFERENT) {
            return different(userAnswers, correctAnswers, isSeq)
        }
        // 结果序列
        let rightSeq = correctAnswers.map(x => 0)
        // 遍历用户答案
        userAnswers.forEach((userAnswer, userIndex) => {
            // 是否支持乱序
            let groupSameIndex = -1;
            let itUsrBlankDisOrder = groups && groups.some((group, groupIndex) => {
                    if (group.includes(userIndex)) {
                        groupSameIndex = groupIndex;
                    }
                    return group.includes(userIndex);
                });
            if (correctAnswers[userIndex] && correctAnswers[userIndex].includes(userAnswer)) { // 直接匹配答案
                rightSeq[userIndex] = 1
            } else if (itUsrBlankDisOrder) { // 支持乱序 匹配所有的答案
                let reextendedBlanks = [];
                let markIndex = -1;
                groups[groupSameIndex].forEach((g, gIndex) => {
                    reextendedBlanks[gIndex] = {};
                    reextendedBlanks[gIndex][g] = !rightSeq[g] ? correctAnswers[g] : [];
                });
                let ifOk = reextendedBlanks.some((reExtend) => {
                    for(let key in reExtend){
                        if(reExtend[key].includes(userAnswer)){
                            markIndex = key;
                            return 1;
                        }
                        return false
                    }
                });
                if (ifOk) {  // 调换extendedBlanks顺序
                    let __temp = [];
                    __temp = correctAnswers[userIndex];
                    correctAnswers[userIndex] = correctAnswers[markIndex]
                    correctAnswers[markIndex] = __temp;
                    rightSeq[userIndex] = 1;
                }
            }
        });
        return isSeq ? rightSeq : !rightSeq.includes(0);
    }
    const handleBlanks = (extendedBlanks, blanks) => {
        // 兼容老数据
        if (!extendedBlanks.length && blanks.length){
            // copy blanks to extendedBlanks
            let _tempExtendedBlanks = [];
            blanks.forEach( (val) => {
                _tempExtendedBlanks.push(Array.of(val));
            })
            extendedBlanks = _tempExtendedBlanks;
        }

        // 去除字符串的前后中间的空格，防止cb录入数据错误
        return extendedBlanks.map((extendedBlank)=>{
            return extendedBlank.map(x=>{
                // 类型要求
                if(typeof x === 'undefined'){
                    x = '';
                } else if (typeof x !== 'string'){
                    throw Error('params need string');
                }
                return x.replace(/\s+/g, '')
            })
        })
    }
    const handleUserAnswers = (userAnswers) => {
        return userAnswers.map(userAnswer => {
            // 类型要求
            if (typeof userAnswer === 'undefined') {
                return '';
            } else if (typeof userAnswer !== 'string') {
                throw Error('params need string');
            }
            // 去除字符串的前后中间的空格，防止cb录入数据错误
            return userAnswer.replace(/\s+/g, '');
        })
    }
    const different = (userAnswers, correctAnswers, isSeq) => {
        let rightSeq = correctAnswers.map(x => 0)
        const userCorrectAnswers = correctAnswers.filter((correctAnswerArray, index) => {
            const isCorrect = correctAnswerArray.some(correctAnswer => userAnswers.includes(correctAnswer))
            rightSeq[index] = isCorrect ? 1 : 0
            return isCorrect
        })
        return isSeq ? rightSeq : userCorrectAnswers.length === correctAnswers.length
    }
    this.katex_answer_match = katex_answer_match
}.call(this))
