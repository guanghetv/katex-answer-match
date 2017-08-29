# katex-answer-match

npm install katex-answer-match

### 前端

import judge from 'katex-answer-match'

```javascript
judge.katex_answer_match(' 123', '123') // ('课程内容', '用户输入')
```


### 后端

const judge = require('katex-answer-match')

```javascript
judge.katex_answer_match(' 1 23 ', '123') // ('课程内容', '用户输入')
```