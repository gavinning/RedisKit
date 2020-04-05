/**
 * 
 * @desc Redis Kit
 * @date 2019-04-17
 * @author gavinning gavinning@qq.com
 *
 * @history
 *    created at 2019-04-17 by gavinning
 *
 */


module.exports = (redis) => {
    const Stock = require('./lib/stock')(redis)
    const Increment = require('./lib/increment')(redis)

    return {
        Stock,
        Increment,
    }
}
