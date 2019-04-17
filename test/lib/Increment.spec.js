const assert = require('assert')
const redis = require('../mock/redis')
const { Increment } = require('../../src/app')(redis)


describe('Class Increment test', async() => {

    it('test isRepeat', async() => {
        const incr = Increment.create('test:Increment', 'isRepeat')
        await incr.incrememt()
        assert.ok(await incr.isRepeat(60))
    })

    it('test isNotRepeat', async() => {
        const incr = Increment.create('test:Increment', 'isNotRepeat')
        assert.ok(await incr.isNotRepeat(1))
    })

    it('test isOutRange', async() => {
        const incr = Increment.create('test:Increment', 'isOutRange')
        await incr.incrememt()
        assert.ok(await incr.isOutRange({ max: 1 }))
    })

    it('test isInRange', async() => {
        const incr = Increment.create('test:Increment', 'isInRange')
        assert.ok(await incr.isInRange({ max: 1, timeout: 1 }))
    })

    it('test getTimes', async() => {
        const incr = Increment.create('test:Increment', 'getTimes')
        await incr.incrememt(1)
        assert.ok(await incr.getTimes() === 1)
    })

    it('test clear', async() => {
        const incr = Increment.create('test:Increment', 'clear')
        await incr.incrememt()
        await incr.clear()
        assert.ok(await incr.getTimes() === 0)
    })

    it('test hasHistory', async() => {
        const incr = Increment.create('test:Increment', 'hasHistory')
        await incr.incrememt(1)
        assert.ok(await incr.hasHistory())
    })
})
