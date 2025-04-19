import 'dotenv/config';
import express from 'express';
import { MiningController } from './modules/module';
import db from 'db';

const app = express();
const port = parseInt(process.env.PORT || '4000', 10); // Ensure it's a number

app.use(express.json());

const miningController = new MiningController();

app.post('/api/mine/start', miningController.startMining.bind(miningController));
app.post('/api/mine/claim', miningController.claimCoins.bind(miningController));
// app.get('/api/mine/status', miningController.getMiningStatus.bind(miningController));

app.get('/api/mine/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 🛠️ FIX: Wrap async in try/catch properly
(async () => {
  try {
    await db.sequelize.sync();
    app.listen(port, () => {
      console.log(`Mining coin app is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
})();
