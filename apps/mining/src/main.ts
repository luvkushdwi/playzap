import 'dotenv/config';
import express from 'express';
import { MiningController } from './modules/module';

const app = express();
const port =  process.env.PORT || 4000;

app.use(express.json());

const miningController = new MiningController();

app.post('/api/mine/start', miningController.startMining.bind(miningController));
app.post('/api/mine/claim', miningController.claimCoins.bind(miningController));
// app.get('/api/mine/status', miningController.getMiningStatus.bind(miningController));

app.get('/api/mine/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

try {
  app.listen(port, () => {
    console.log(`Mining app is running on http://localhost:${port}`);
  });
} catch (err) {
  console.error('Server crashed:', err);
}