/**
 * 库存管理
 */

const App = require('./app')

class Stock extends App {
    constructor({ key }) {
        super({ key, redis: Stock.redis })
    }

    // 查询数据
    // 1、优先从缓存查询数据
    // 2、没有缓存，或者缓存数据为空时从数据库查询
    async get() {
        const sequence = await super.get()
        return sequence && sequence.length ? sequence : []
    }

    // 头部添加一条数据
    async prepend(item) {
        const sequence = await this.get()
        sequence.unshift(item)
        await this.save(sequence)
    }

    // 尾部添加一条数据
    async append(item) {
        const sequence = await this.get()
        sequence.push(item)
        await this.save(sequence)
    }

    // 消费一条数据
    async pop() {
        const sequence = await this.get()
        const item = sequence.pop()
        this.save(sequence)
        return item
    }

    // 消费一条数据
    async shift() {
        const sequence = await this.get()
        const item = sequence.shift()
        this.save(sequence)
        return item
    }

    async find(callback) {
        return (await this.get()).find(callback)
    }

    async findIndex(callback) {
        return (await this.get()).findIndex(callback)
    }

    async map(callback) {
        return (await this.get()).map(callback)
    }

    async each(callback) {
        return (await this.get()).forEach(callback)
    }

    async slice(start, end) {
        return (await this.get()).slice(start, end)
    }

    async remove(item) {
        if ('string' === typeof item) {
            const callback = item
            const sequence = await this.get()
            const index = this.findIndex(callback)
            index < 0 || sequence.splice(index, 1)
            await this.save(sequence)
        }
        else {
            const sequence = await this.get()
            const index = sequence.indexOf(item)
            index < 0 || sequence.splice(index, 1)
            await this.save(sequence)
        }
    }

    static init() {
        const key = this.getKey(...arguments)
        return new Stock({ key })
    }
}

module.exports = (redis) => {
    Stock.redis = redis
    return Stock
}
