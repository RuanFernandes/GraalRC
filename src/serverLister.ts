import { createConnection } from 'net';
import { GraalRCConfig } from './types';
import { inflateSync } from 'zlib';
import { xorEncrypt } from './utils';

export class ServerLister {
    private readonly Config: GraalRCConfig;

    constructor(config: GraalRCConfig) {
        this.Config = config;
    }

    parseServerList(buffer: Buffer) {
        const servers = [];
        let offset = 0;

        while (offset < buffer.length) {
            const ipLength = buffer.readUInt8(offset);
            offset += 1;
            const ip = buffer.toString('utf8', offset, offset + ipLength);
            offset += ipLength;
            const port = buffer.readUInt16BE(offset);
            offset += 2;
            const nameLength = buffer.readUInt8(offset);
            offset += 1;
            const name = buffer.toString('utf8', offset, offset + nameLength);
            offset += nameLength;
            const players = buffer.readUInt16BE(offset);
            offset += 2;

            servers.push({ ip, port, name, players });
        }

        return servers;
    }

    async fetchServerList() {
        return new Promise((resolve, reject) => {
            const socket = createConnection({
                host: this.Config.host,
                port: this.Config.port,
                timeout: 10000,
            });

            socket.setKeepAlive(true, 60000);
            socket.setNoDelay(true);

            // Handshake
            socket.write(Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00])); // 5 null bytes

            socket.on('connect', () => {
                console.log('TCP connection established');
            });

            socket.on('ready', () => {
                console.log('Socket ready for data');
            });

            socket.on('end', () => {
                console.log('Server ended connection');
            });

            socket.on('data', (data) => {
                console.log('Data received from server:', data.length, 'bytes');
            });

            socket.on('error', reject);
            socket.on('timeout', () => reject(new Error('Connection timeout')));
        });
    }
}
