import { Request, Response } from 'express';
import { MiningService } from '../services/service';


const miningService = new MiningService();

export class MiningController {
 
  startMining(req: Request, res: Response): void {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'User ID is required.' });
      return;
    }

    miningService.startMining(userId);
    res.status(200).json({ message: 'Mining started or updated successfully.' });
  }

  async claimCoins(req: Request, res: Response): Promise<void> {
    console.log('Claiming coins...');
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'User ID is required.' });
      return;
    }

    try {
      const result =await miningService.claimCoins(userId);
      console.log('result:', result);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json('User has not started mining.');
    }
  }


}