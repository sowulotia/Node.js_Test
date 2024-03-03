# Node.js_Test

---
### BinaryUtil 
#### 위치
./utils/BinaryUtil.js
#### 사용예제
```javascript
BinaryUtil = require('./utils/BinaryUtil.js');
const bin2util = new BinaryUtil();
buf = bin2util.num2bin([10562243, 64]);
// buf = bin2util.num2bin(10562243);
console.log(buf);
num = bin2util.bin2num(buf);
console.log(num);
```