RedisKit
---
依赖Redis的一些常用工具

### Install
```sh
npm i god-redis-kit --save
```

### Usage
```js
// redis client需支持promise
// 推荐使用ioredis创建redis client
const redis = require('./your-redis-client')
const { Increment } = require('god-redis-kit')(redis)
const assert = require('assert')
```

### Increment API
Redis安全线程，后端为集群部署时常用于检查某项行为或消费是否符合预期

**isRepeat**  
<font color=#777 size=2>检查重复消费</font>
```js
const incr = Increment.create('test:Increment', 'isRepeat')
await incr.incrememt()
assert.ok(await incr.isRepeat(60))
```

**isNotRepeat**  
<font color=#777 size=2>检查重复消费</font>
```js
const incr = Increment.create('test:Increment', 'isNotRepeat')
assert.ok(await incr.isNotRepeat(1))
```

**isOutRange**  
<font color=#777 size=2>检查库存</font>
```js
const incr = Increment.create('test:Increment', 'isOutRange')
await incr.incrememt()
assert.ok(await incr.isOutRange({ max: 1 }))
```

**isInRange**  
<font color=#777 size=2>检查库存</font>
```js
const incr = Increment.create('test:Increment', 'isInRange')
assert.ok(await incr.isInRange({ max: 1, timeout: 1 }))
```

**getTimes**  
<font color=#777 size=2>查询消费次数</font>
```js
const incr = Increment.create('test:Increment', 'getTimes')
await incr.incrememt(1)
assert.ok(await incr.getTimes() === 1)
```

**clear**  
<font color=#777 size=2>清理消费记录</font>
```js
const incr = Increment.create('test:Increment', 'clear')
await incr.incrememt()
await incr.clear()
assert.ok(await incr.getTimes() === 0)
```

**hasHistory**  
<font color=#777 size=2>是否存在消费历史</font>
```js
const incr = Increment.create('test:Increment', 'hasHistory')
await incr.incrememt(1)
assert.ok(await incr.hasHistory())
```

&nbsp;
---
> npm test