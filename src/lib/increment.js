/**
 * increment
 * @desc 安全线程计数
 * @date 2019-01-23
 * @author gavinning gavinning@qq.com
 *
 * @history
 *    created at 2019-01-23 by gavinning
 *
 */

class Increment {
    constructor({ key }) {
        this.key = key
        this.redis = Increment.redis
    }

    // 重复消费
    async isRepeat(timeout) {
        return this.isOutRange({ max: 1, timeout })
    }

    // 未重复消费
    async isNotRepeat(timeout) {
        return !(await this.isRepeat(timeout))
    }

    // 检查是否超出消费额度
    async isOutRange({ max, timeout }) {
        const times = await this.increment(timeout)
        return times > max
    }

    // 检查消费是否在库存之内
    async isInRange({ max, min = 0, timeout }) {
        const times = await this.increment(timeout)
        return times >= min && times <= max
    }

    // 新增一次消费计数
    async increment(timeout) {
        const times = await this.redis.incr(this.key)
        this.expire(timeout)
        return times
    }

    // 清理消费记录
    async clear() {
        return this.redis.del(this.key)
    }

    // 过期消费记录
    async expire(time) {
        return time ? this.redis.expire(this.key, time) : null
    }

    // 查询历史消费记录
    async getTimes() {
        const times = await this.redis.get(this.key)
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

    static create() {
        return this.init(...arguments)
    }
}

module.exports = (redis) => {
    Increment.redis = redis
    return Increment
}
