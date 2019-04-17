/**
 * 库存缓存
 * @desc 从DB中取出多条数据作为缓存存储在redis中，程序消费所有数据之后则更新缓存
 * @date 2019-03-07
 * @author gavinning gavinning@qq.com
 *
 * @history
 *    created at 2019-03-07 by gavinning
 *
 */


class Stock extends Redis {
    constructor({ key, timeout }) {
        super({ key })
        this.key = key
        this.timeout = timeout
    }

    // 查询数据
    // 1、优先从缓存查询数据
    // 2、没有缓存，或者缓存数据为空时从数据库查询
    async get() {
        const docs = await super.get()
        return docs && docs.length ? docs : this.update()
    }

    // 从数据库查询数据，需要子类实现该方法
    async getFromDB() {
        return []
    }

    // 从数据库更新数据到Redis
    async update() {
        const docs = await this.getFromDB()
        this.save(docs, this.timeout)
        return docs
    }

    // 消费一条数据
    async shift() {
        const docs = await this.get()
        const data = docs.shift()
        this.save(docs, this.timeout)
        return data
    }

    // 头部添加一条数据
    async unshift(data) {
        const docs = await this.get()
        docs.unshift(data)
        await this.save(docs, this.timeout)
    }

    // 添加一条数据
    async push(data) {
        const docs = await this.get()
        docs.push(data)
        await this.save(docs, this.timeout)
    }

    async find(callback) {
        const docs = await this.get()
        return docs.find(callback)
    }

    async remove(callback) {
        const docs = await this.get()
        const val = docs.find(callback)
        const index = docs.indexOf(val)
        index < 0 || docs.splice(index, 1)
        await this.save(docs, this.timeout)
    }
}

module.exports = (redis) => {
    Stock.redis = redis
    return Stock
}
