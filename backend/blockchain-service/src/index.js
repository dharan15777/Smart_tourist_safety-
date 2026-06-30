const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index; this.timestamp = timestamp; this.data = data;
    this.previousHash = previousHash || ''; this.nonce = 0; this.hash = this.calculateHash();
  }
  calculateHash() { return crypto.createHash('sha256').update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).digest('hex'); }
  mineBlock(difficulty) { const target = '0'.repeat(difficulty); while (this.hash.substring(0, difficulty) !== target) { this.nonce++; this.hash = this.calculateHash(); } }
}
class Blockchain {
  constructor() { this.chain = [new Block(0, new Date().toISOString(), { message: 'Genesis Block' }, '0')]; this.difficulty = 2; this.touristRegistry = new Map(); }
  getLatestBlock() { return this.chain[this.chain.length - 1]; }
  addBlock(data) { const newBlock = new Block(this.chain.length, new Date().toISOString(), data, this.getLatestBlock().hash); newBlock.mineBlock(this.difficulty); this.chain.push(newBlock); return newBlock; }
  registerTourist(touristId, touristData) { const block = this.addBlock({ type: 'TOURIST_REGISTRATION', touristId, ...touristData }); this.touristRegistry.set(touristId, { ...touristData, blockHash: block.hash, blockIndex: block.index, registeredAt: block.timestamp, status: 'active' }); return block; }
  verifyTourist(touristId) { const record = this.touristRegistry.get(touristId); if (!record) return null; const block = this.chain[record.blockIndex]; if (!block) return null; return { valid: block.hash === record.blockHash, record, block }; }
  isChainValid() { for (let i = 1; i < this.chain.length; i++) { const curr = this.chain[i]; const prev = this.chain[i-1]; if (curr.hash !== curr.calculateHash()) return false; if (curr.previousHash !== prev.hash) return false; } return true; }
}
const touristBlockchain = new Blockchain();
app.post('/api/blockchain/register', (req, res) => {
  try {
    const { touristId, name, email, phone, nationality, passportNumber, validUntil } = req.body;
    if (!touristId || !name) return res.status(400).json({ error: 'touristId and name required' });
    const block = touristBlockchain.registerTourist(touristId, { name, email, phone, nationality, passportNumber, validUntil });
    res.json({ success: true, touristId, blockHash: block.hash, blockIndex: block.index, timestamp: block.timestamp });
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.get('/api/blockchain/verify/:touristId', (req, res) => {
  try {
    const result = touristBlockchain.verifyTourist(req.params.touristId);
    if (!result) return res.status(404).json({ valid: false, message: 'Tourist ID not found' });
    res.json({ valid: result.valid, touristId: req.params.touristId, name: result.record.name, nationality: result.record.nationality, validUntil: result.record.validUntil, status: result.record.status, blockHash: result.record.blockHash, registeredAt: result.record.registeredAt, blockchainVerified: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});
app.get('/api/blockchain/status', (req, res) => res.json({ chainLength: touristBlockchain.chain.length, isValid: touristBlockchain.isChainValid(), registeredTourists: touristBlockchain.touristRegistry.size }));
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'Blockchain Service', chainLength: touristBlockchain.chain.length, timestamp: new Date().toISOString() }));
app.get('/', (req, res) => res.json({ message: 'Blockchain Service Running' }));
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log('🔗 Blockchain Service running on port ' + PORT));
module.exports = app;
