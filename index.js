const _merge = require('lodash.merge');

// create redis async methods
var redis = require('redis');
require('bluebird').promisifyAll(redis.RedisClient.prototype);

function _defaultOptions() {
    return {
        host: null,
        port: null,
        key: null,
        onconnect: null,
        onready: null,
        onend: null,
        onreconnecting: null,
        onwarning: null,
        onerror: null,
        parseError: "throw"
    };
}

function create(options) {
    options = _merge(_defaultOptions(), options);

    var redisClient = redis.createClient(
        options.port,
        options.host,
        {
            auth_pass: options.key,
            tls: {
                servername: options.host
            }
        }
    );

    // insert all listeners to redis client
    // NOTE: add more events when needed (see doc in https://www.npmjs.com/package/redis)
    var events = {
        'connect': options.onconnect,
        'ready': options.onready,
        'end': options.onend,
        'reconnecting': options.onreconnecting,
        'warning': options.onwarning,
        'error': options.onerror,
    };

    for (var eventName in events) {
        var listener = events[eventName];
        if (listener) {
            redisClient.on(eventName, function () {
                if (listener) {
                    listener(...arguments);
                }
            });
        }
    }

    // add async methods for get object and set object
    redisClient.getAsyncObj = async function () {
        var str = await this.getAsync(...arguments);

        if (!str) {
            return null;
        }

        try {
            var o = JSON.parse(str);
            return o;
        } catch (error) {
            if (options.parseError === "throw") {
                throw error;
            }
            else {
                return null;
            }
        }
    };

    redisClient.setAsyncObj = async function () {
        // arguments: 0 key, 1 value, ...
        // stringify arg1 as json
        arguments[1] = JSON.stringify(arguments[1]);
        await this.setAsync(...arguments);
    };

    return redisClient;
}

module.exports = {
    create: create
};
