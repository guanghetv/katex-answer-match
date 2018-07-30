+(function() {
    'use strict';
    var katex_answer_match = function(userAnswers, {extendedBlanks = [], groups = [], blanks = [], isSeq = false} = {} ){

        !extendedBlanks && ( extendedBlanks = [] );
        !groups && ( groups = [] );
        !blanks && ( blanks = [] );
        !userAnswers && ( userAnswers = [] );

        if (extendedBlanks.length === 0 && blanks.length === 0) {
            console.warn('extendedBlanks blanks必须传入其中一个');
        }

        if (userAnswers.length === 0) {
            console.warn('userAnswers 必传');
        }


        // 结果序列
        let rightSeq = extendedBlanks.length ? extendedBlanks.map(x => 0) : blanks.map(x => 0);

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
        extendedBlanks = extendedBlanks.map((extendedBlank)=>{
            return extendedBlank.map(x=>{
                // 类型要求
                if (typeof x !== 'string') {
                    throw Error('params need string');
                }
                return x.replace(/\s+/g, '')
            })
        })

        // 遍历用户答案
        userAnswers.forEach((userAnswer, userIndex) => {
            // 去除字符串的前后中间的空格，防止cb录入数据错误
            userAnswer = userAnswer.replace(/\s+/g, '');
            // 类型要求
            if (typeof userAnswer !== 'string') {
                throw Error('params need string');
            }
            // 是否支持乱序
            let groupSameIndex = -1;
            let itUsrBlankDisOrder = groups && groups.some((group, groupIndex) => {
                    if (group.includes(userIndex)) {
                        groupSameIndex = groupIndex;
                    }
                    return group.includes(userIndex);
                });
            if (extendedBlanks[userIndex].includes(userAnswer)) { // 直接匹配答案
                rightSeq[userIndex] = 1
            } else if (itUsrBlankDisOrder) { // 支持乱序 匹配所有的答案
                let reextendedBlanks = [];
                let markIndex = -1;
                groups[groupSameIndex].forEach((g, gIndex) => {
                    reextendedBlanks[gIndex] = {};
                    reextendedBlanks[gIndex][g] = !rightSeq[g] ? extendedBlanks[g] : [];
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
                    __temp = extendedBlanks[userIndex];
                    extendedBlanks[userIndex] = extendedBlanks[markIndex]
                    extendedBlanks[markIndex] = __temp;
                    rightSeq[userIndex] = 1;
                }
            }
        });
        return isSeq ? rightSeq : !rightSeq.includes(0);
    }
    this.katex_answer_match = katex_answer_match
}.call(this))