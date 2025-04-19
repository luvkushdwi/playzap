import { Request, Response } from 'express';
import { EncryptionService } from '../services/service';
import db from 'db';


export class EncryptionController {
  async encryptData(req: Request, res: Response) {
    try {
      const { plaintext } = req.body;
      if (!plaintext) {
        return res.status(400).json({ error: 'Missing plaintext' });
      }

      const encrypted = EncryptionService.encrypt(plaintext);

      // Save to DB
      const user = await db.User.create({
        name: encrypted.encryptedData,
        iv: encrypted.iv
      });

      return res.status(201).json({
        message: 'Data encrypted and saved successfully',
        userId: user.id,
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  async decryptData(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
      }

      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const decrypted = EncryptionService.decrypt(user.iv, user.name);

      return res.status(200).json({
        userId: user.id,
        iv: user.iv,
        encryptedName: user.name,
        decryptedName: decrypted,

      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
