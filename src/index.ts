import { ServerLister } from './serverLister';
import { GraalRCConfig } from './types';

import { config } from 'dotenv';

const env = config({ path: './.env' });

async function main() {
    const config: GraalRCConfig = {
        host: 'listserver.graalonline.com',
        port: 14922,
        account: env.parsed?.ACCOUNT || '',
        password: env.parsed?.PASSWORD || '',
        nickname: 'Ruan',
    };

    console.log('Config:', config);

    // const serverlister = new ServerLister(config);
    // const servers = await serverlister.fetchServerList();
    // console.log('Servers:', servers);
}

main();
