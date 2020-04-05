class App {
    constructor({ key, redis }) {
        this.key = key
        this.redis = redis
    }

    async get() {
        return App.encode(await this.redis.get(this.key))
    }

    set(value, time) {
        value = App.stringify(value)
        return time ? this.redis.set(this.key, value, 'EX', time) : this.redis.set(this.key, value)
    }

    save(value, time) {
        return this.set(value, time)
    }

    clear() {
        return this.redis.del(this.key)
    }

    expire(time = 0) {
        return this.redis.expire(this.key, time)
    }

    static encode(value) {
        try {
            return JSON.parse(value)
        } catch (err) {
            return value
        }
    }

    static stringify(value) {
        return 'object' === typeof value ? JSON.stringify(value) : value.toString()
    }

    static getKey() {
        return Array.from(arguments).join(':')
    }
}

module.exports = App
