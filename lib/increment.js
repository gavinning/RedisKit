class Increment {
    constructor({ key }) {
        this.key = key
    }

    // 重复消费
    async isRepeat() {
        return this.isOutRange(1)
    }

    // 未重复消费
    async isNotRepeat() {
        return !(await this.isRepeat())
    }

    // 检查是否超出消费额度
    async isOutRange(max) {
        const times = await this.increment()
        return times > max
    }

    // 检查消费是否在库存之内
    async isInRange(max, min = 0) {
        const times = await this.increment()
        return times >= min && times <= max
    }

    // 新增一次消费计数
    async increment() {
        const times = await Increment.redis.incr(this.key)
        return times
    }

    // 减去一次消费计数
    async decrement() {
        const times = await Increment.redis.decr(this.key)
        return times
    }

    // 清理消费记录
    async clear() {
        return Increment.redis.del(this.key)
    }

    // 过期消费记录
    expire(time = 0) {
        return Increment.redis.expire(this.key, time)
    }

    // 查询历史消费记录
    async getTimes() {
        const times = await Increment.redis.get(this.key)
        return isNaN(times) ? 0 : Number(times)
    }

    async hasHistory() {
        return (await this.getTimes()) > 0
    }

    static getKey() {
        return Array.from(arguments).join(':')
    }

    static init() {
        const key = this.getKey(...arguments)
        return new Increment({ key })
    }
}

module.exports = (redis) => {
    Increment.redis = redis
    return Increment
}
