import { Request, Response } from 'express';
import { EncryptionService } from '../modules/module';


export class EncryptionController {
  encryptData(req: Request, res: Response): void {
    try {
      const { plaintext } = req.body;
      if (!plaintext) {
        res.status(400).json({ error: 'Plaintext is required' });
        return;
      }

      const result = EncryptionService.encrypt(plaintext);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  decryptData(req: Request, res: Response): void {
    try {
      const { iv, encryptedData } = req.body;
      if (!iv || !encryptedData) {
        res.status(400).json({ error: 'IV and encryptedData are required' });
        return;
      }

      const plaintext = EncryptionService.decrypt(iv, encryptedData);
      res.status(200).json({ plaintext });
    } catch (error) {
      res.status(500).json({ error});
    }
  }
}