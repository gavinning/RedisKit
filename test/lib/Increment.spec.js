const assert = require('assert')
const redis = require('../mock/redis')
const { Increment } = require('../../index')(redis)


describe('Class Increment test', async() => {

    it('test isRepeat', async() => {
        const incr = Increment.init('test:Increment', 'isRepeat')
        await incr.increment()
        assert.ok(await incr.isRepeat())
        incr.expire()
    })

    it('test isNotRepeat', async() => {
        const incr = Increment.init('test:Increment', 'isNotRepeat')
        assert.ok(await incr.isNotRepeat())
        incr.expire()
    })

    it('test isOutRange', async() => {
        const incr = Increment.init('test:Increment', 'isOutRange')
        await incr.increment()
        assert.ok(await incr.isOutRange(1))
        incr.expire()
    })

    it('test isInRange', async() => {
        const incr = Increment.init('test:Increment', 'isInRange')
        assert.ok(await incr.isInRange(1))
        incr.expire()
    })

    it('test getTimes', async() => {
        const incr = Increment.init('test:Increment', 'getTimes')
        await incr.increment(1)
        assert.ok(await incr.getTimes() === 1)
        incr.expire()
    })

    it('test clear', async() => {
        const incr = Increment.init('test:Increment', 'clear')
        await incr.increment()
        await incr.clear()
        assert.ok(await incr.getTimes() === 0)
        incr.expire()
    })

    it('test hasHistory', async() => {
        const incr = Increment.init('test:Increment', 'hasHistory')
        await incr.increment(1)
        assert.ok(await incr.hasHistory())
        incr.expire()
    })
})
