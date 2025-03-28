import { ServerLister } from './serverLister';
import { GraalRCConfig } from './types';

async function main() {
    const config: GraalRCConfig = {
        host: 'listserver.graalonline.com',
        port: 14922,
        account: 'ruanf',
        password: 'randrandbr',
        nickname: 'Ruan',
    };

    const serverlister = new ServerLister(config);
    const servers = await serverlister.fetchServerList();
    console.log('Servers:', servers);
}

main();
