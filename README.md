# katex-answer-match

[![Build Status](https://travis-ci.org/guanghetv/katex-answer-match.svg?branch=master)](https://travis-ci.org/guanghetv/katex-answer-match)

npm install katex-answer-match

```javascript
/**
 * 判断用户做题结果（Boolean）
 * katex_answer_match
 * @date 2018-07-05
 * @description
 * 入参
 * extendedBlanks: 单空有多种答案，即等值情况  二维数组
 * groups: 多空之间支持乱序 二维数组
 * blanks 问题对应的正确答案（旧的CB数据，即字段blanks） 一维数组
 * userAnswers: 用户输入的答案 一维数组(必须传)
 * isSeq: boolean。true：结果返回由01构成的一维数组，表示每个空的正误，false:结果返回布尔值，表示该题的正误
 * 参数传入规则：1.仅兼容旧数据：userAnswers & blanks；2. 支持多答案乱序 userAnswers & extendedBlanks & groups （blanks可不传）
 *
 * @returns {boolean | arr} - 默认返回布尔值（isSeq：false）。
*/
```

### 前端

```javascript
import judge from 'katex-answer-match'
judge.katex_answer_match(
    [' 123', '123'],
    {
        extendedBlanks: [
            ['1/2', '0.5'],
            ['red', 'r'],
        ],
        groups:[
            [0, 1]
        ],
        blanks:['1/2', 'red'],
        isSeq: true
    }
);
```


### 后端

```javascript
const judge = require('katex-answer-match')
judge.katex_answer_match(
    [' 123', '123'],
    {
        extendedBlanks: [
            ['1/2', '0.5'],
            ['red', 'r'],
        ],
        groups:[
            [0, 1]
        ],
        blanks:['1/2', 'red'],
        isSeq: true
    }
);
```
