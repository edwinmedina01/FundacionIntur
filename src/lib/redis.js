import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL, // Redis remoto o local
});

client.on('error', (err) => console.error('❌ Error en Redis:', err));

(async () => {
    if (!client.isOpen) {
        await client.connect();
    }
})();

export default client;
