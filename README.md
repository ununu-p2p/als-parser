#### Ableton Parser
Yet another node module! Parses the Ableton Live(*als) File to extract the basic info. 

<b>"The Project is Under Construction!!"</b>

```js
const abletonParser = require('ableton-parser');

abletonParser.parseFile('PATH/TO/THE/PROJECT').then((res) => {
    console.log(res.getTracks());
})
```