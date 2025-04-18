import 'dotenv/config';
import express from 'express';
import { EncryptionController } from './modules/module';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const encryptionController = new EncryptionController();

app.post('/encrypt', encryptionController.encryptData.bind(encryptionController));
app.post('/decrypt', encryptionController.decryptData.bind(encryptionController));

app.listen(port, () => {
  console.log(`Encryption/Decryption app is running on http://localhost:${port}`);
});