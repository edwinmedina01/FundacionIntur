import client from '../../lib/redis';


export default async function handler(req, res) {
    try {
        await client.set('test', '¡Redis en Upstash funciona en localhost!');
        const value = await client.get('test');
        return res.status(200).json({ message: value });
    } catch (error) {
        return res.status(500).json({ error: 'Error conectando a Redis' });
    }
}
