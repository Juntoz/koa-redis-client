const restclient = require('../index');
const process = require('process');

const redis_host = process.env['REDIS_HOST'];
const redis_port = process.env['REDIS_PORT'];
const redis_key = process.env['REDIS_KEY'];

test('if it connects to redis', async () => {
    var rc = restclient.create({
        host: redis_host,
        port: redis_port,
        key: redis_key,
    });

    var dummy = await rc.getAsync('dummy');
    expect(dummy).toBe(null);

    // always quit so open handle does not leave jest open
    rc.quit();
});

test('if methods were injected', () => {
    var rc = restclient.create({
        host: redis_host,
        port: redis_port,
        key: redis_key,
    });

    expect(rc.getAsync).toBeDefined();
    expect(rc.setAsync).toBeDefined();
    expect(rc.getAsyncObj).toBeDefined();
    expect(rc.setAsyncObj).toBeDefined();

    // always quit so open handle does not leave jest open
    rc.quit();
});
