'use strict';

+function () {
    'use strict';
    var isArray = function (params) {
      return Object.prototype.toString.call(params).slice(8, -1) === 'Array'
    }
    var katex_answer_match = function katex_answer_match(userAnswers) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$extendedBlanks = _ref.extendedBlanks,
            extendedBlanks = _ref$extendedBlanks === undefined ? [] : _ref$extendedBlanks,
            _ref$groups = _ref.groups,
            groups = _ref$groups === undefined ? [] : _ref$groups,
            _ref$blanks = _ref.blanks,
            blanks = _ref$blanks === undefined ? [] : _ref$blanks,
            _ref$isSeq = _ref.isSeq,
            isSeq = _ref$isSeq === undefined ? false : _ref$isSeq;

        !extendedBlanks && (extendedBlanks = []);
        !groups && (groups = []);
        !blanks && (blanks = []);
        !userAnswers && (userAnswers = []);

        if (extendedBlanks.length === 0 && blanks.length === 0) {
            console.warn('extendedBlanks blanks必须传入其中一个');
        }

        if (userAnswers.length === 0) {
            console.warn('userAnswers 必传');
        }

        // 结果序列
        var rightSeq = extendedBlanks.length ? extendedBlanks.map(function (x) {
            return 0;
        }) : blanks.map(function (x) {
            return 0;
        });

        // 兼容老数据
        if (!extendedBlanks.length && blanks.length) {
            // copy blanks to extendedBlanks
            var _tempExtendedBlanks = [];
            blanks.forEach(function (val) {
                _tempExtendedBlanks.push(Array.of(val));
            });
            extendedBlanks = _tempExtendedBlanks;
        }

        // 去除字符串的前后中间的空格，防止cb录入数据错误
        extendedBlanks = extendedBlanks.map(function (extendedBlank) {
            return extendedBlank.map(function (x) {
                // 类型要求
                if (isArray(x)) {
                  return x.map(item => item.replace(/\s+/g, ''))
                }
                if (typeof x === 'undefined') {
                    x = '';
                } else if (typeof x !== 'string') {
                    throw Error('params need string or array');
                }
                return x.replace(/\s+/g, '');
            });
        });

        // 遍历用户答案
        userAnswers.forEach(function (userAnswer, userIndex) {
            // 类型要求
            if (typeof userAnswer === 'undefined') {
                userAnswer = '';
            } else if (typeof userAnswer === 'string') {
                userAnswer = userAnswer.replace(/\s+/g, '');
            } else if (isArray(userAnswer)) {
              userAnswer = userAnswer.map(answer => answer.replace(/\s+/g, ''));
            } else {
              throw Error('params need string or array');
            }
            // 去除字符串的前后中间的空格，防止cb录入数据错误
            // userAnswer = userAnswer.replace(/\s+/g, '');
            // 是否支持乱序
            var groupSameIndex = -1;
            var itUsrBlankDisOrder = groups && groups.some(function (group, groupIndex) {
                if (group.includes(userIndex)) {
                    groupSameIndex = groupIndex;
                }
                return group.includes(userIndex);
            });
            if (isArray(userAnswer)) {
              if (isArray(extendedBlanks[userIndex][0])) {
                //多选题
                if (userAnswer.length !== extendedBlanks[userIndex][0].length) { //漏选
                  rightSeq[userIndex] = 0
                } else { //全选
                  var r = userAnswer.filter(answer => extendedBlanks[userIndex][0].includes(answer));
                  rightSeq[userIndex] = r.length === userAnswer.length ? 1 : 0;
                }
              } else {
                // 单选题 exam题
                rightSeq[userIndex] = userAnswer[0] === extendedBlanks[userIndex][0] ? 1 : 0
              }
            } else if (extendedBlanks[userIndex] && extendedBlanks[userIndex].includes(userAnswer)) {
                // 直接匹配答案
                rightSeq[userIndex] = 1;
            } else if (itUsrBlankDisOrder) {
                // 支持乱序 匹配所有的答案
                var reextendedBlanks = [];
                var markIndex = -1;
                groups[groupSameIndex].forEach(function (g, gIndex) {
                    reextendedBlanks[gIndex] = {};
                    reextendedBlanks[gIndex][g] = !rightSeq[g] ? extendedBlanks[g] : [];
                });
                var ifOk = reextendedBlanks.some(function (reExtend) {
                    for (var key in reExtend) {
                        if (reExtend[key].includes(userAnswer)) {
                            markIndex = key;
                            return 1;
                        }
                        return false;
                    }
                });
                if (ifOk) {
                    // 调换extendedBlanks顺序
                    var __temp = [];
                    __temp = extendedBlanks[userIndex];
                    extendedBlanks[userIndex] = extendedBlanks[markIndex];
                    extendedBlanks[markIndex] = __temp;
                    rightSeq[userIndex] = 1;
                }
            }
        });
        return isSeq ? rightSeq : !rightSeq.includes(0);
    };
    this.katex_answer_match = katex_answer_match;
}.call(this);