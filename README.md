# simple-redis-client
Simple wrapper for redis client.

Some of the functionalities we have added are:
- Async methods (using bluebird)
- getAsyncObj and setAsyncObj to deal with JSON objects

# How to use?

To install
`npm install @juntoz/simple-redis-client`

To use
```
    var rc = restclient.create({
        host: redis_host,
        port: redis_port,
        key: redis_key,
    });

    var v = await rc.getAsync('MyKey');

    /// ...

    rc.quit();
```

Options:
```
{
    host: null, // the redis host name, use https.
    port: 63XX, // the redis port.
    key: null, // the redis key or password.
    onconnect: null, // insert listener redis for 'connect' event.
    onready: null, // insert listener redis for 'ready' event.
    onend: null, // insert listener redis for 'end' event.
    onreconnecting: null, // insert listener redis for 'reconnecting' event.
    onwarning: null, // insert listener redis for 'warning' event.
    onerror: null, // insert listener redis for 'error' event.
    parseError: "throw" // when using getAsyncObj, what to do if there is a parse error. Possible: throw (throw error), ignore (return null). Default: throw.
}
```

NOTE: do not forget to always call `quit` method so there are no open handles.
