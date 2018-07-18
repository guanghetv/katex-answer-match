+(function() {
    'use strict';
    var katex_answer_match = function(userAnswers, {extendedBlanks = [], groups = [], blanks = [], isSeq = false} = {} ){

        // 入参异常类型处理
        let params = [extendedBlanks, groups, blanks, userAnswers];
        params = params.map(param => param === undefined || param === null ? [] : param)
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

        // 结果序列
        let rightSeq = extendedBlanks.length ? extendedBlanks.map(x => 0) : blanks.map(x => 0);

        if(extendedBlanks.length){ // 优先extendedBlanks, blankGroup匹配结果
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
        } else if (!extendedBlanks.length && blanks.length){ // originBlanks匹配结果 兼容旧的CB数据
            blanks.some((blank, index) => {
                // 类型要求
                if (typeof blank !== 'string') {
                    throw Error('params need string');
                }
                // 去除字符串的前后中间的空格，防止cb录入数据错误
                blank.replace(/\s+/g, '') === userAnswers[index].replace(/\s+/g, '') && ( rightSeq[index] = 1);
            })
        }
        return isSeq ? rightSeq : !rightSeq.includes(0);
    }
    this.katex_answer_match = katex_answer_match
}.call(this))