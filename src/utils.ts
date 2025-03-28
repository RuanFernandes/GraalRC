import { Buffer } from 'buffer';

/**
 * Encripta/Decripta dados usando XOR com uma seed (32-bit) do servidor.
 * @param data Buffer de dados a ser processado.
 * @param seed Número de 32 bits fornecido pelo servidor.
 * @returns Buffer encriptado/decriptado.
 */
export function xorEncrypt(data: Buffer, seed: number): Buffer {
    // Converte a seed em uma chave de 4 bytes (Big-Endian)
    const key = Buffer.alloc(4);
    key.writeUInt32BE(seed, 0);

    const result = Buffer.alloc(data.length);

    for (let i = 0; i < data.length; i++) {
        // Aplica XOR byte a byte (cíclico na chave de 4 bytes)
        result[i] = data[i] ^ key[i % key.length];
    }

    return result;
}
