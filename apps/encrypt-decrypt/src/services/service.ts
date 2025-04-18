import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY;

if (!key || key.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be a 32-character stirng set in the environment variables.');
}

export class EncryptionService {
  static encrypt(plaintext: string): { iv: string; encryptedData: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key!), iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return {
      iv: iv.toString('base64'),
      encryptedData: encrypted,
    };
  }

  static decrypt(iv: string, encryptedData: string): string {
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key!),
      Buffer.from(iv, 'base64')
    );

    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}