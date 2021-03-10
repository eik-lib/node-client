import EikNodeClient from '../index.js';
import tap from 'tap';

tap.test('test', async (t) => {
    const client = new EikNodeClient({
        development: false,
        base: '/public'
    });
    await client.load();

    t.same('X', 'X');
    t.end();
});
