import tap from 'tap';
import EikNodeClient from '../src/index.js';

tap.test('test', async (t) => {
    const client = new EikNodeClient({
        development: false,
        base: '/public',
    });
    await client.load();

    t.same('X', 'X');
    t.end();
});
