import { config } from 'dotenv';
import { ServerlistConfig } from './types';
import { Serverlist } from './serverLister';

const env = config({ path: './.env' });

async function main() {
    const config: ServerlistConfig = {
        host: 'listserver.graalonline.com',
        port: 14922,
        account: env.parsed?.ACCOUNT || '',
        password: env.parsed?.PASSWORD || '',
        nickname: 'Ruan',
    };

    try {
        const servers = await Serverlist.request(config);
        console.log(`Servers:`, servers);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
