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
                timeout: 5000,
            });

            // Handshake
            socket.write(Buffer.from([0x00]));

            socket.on('data', (data) => {
                try {
                    const seed = data.readUInt32BE(1);
                    if (data.length >= 5 && data.readUInt8(0) === 0x01) {
                        const encryptedRequest = xorEncrypt(
                            Buffer.from([]),
                            seed,
                        );
                        socket.write(encryptedRequest);
                    } else {
                        const decrypted = xorEncrypt(data, seed);
                        const decompressed = inflateSync(decrypted);
                        const servers = this.parseServerList(decompressed);
                        resolve(servers);
                        socket.end();
                    }
                } catch (err) {
                    reject(err);
                }
            });

            socket.on('error', reject);
            socket.on('timeout', () => reject(new Error('Connection timeout')));
        });
    }
}
