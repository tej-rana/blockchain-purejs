const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../src/blockchain/blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../src/wallet');
const TransactionPool = require('../src/wallet/transaction-pool');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

app.post('/mine', (req, res) => {
   const block = bc.addBlock(req.body.data);
   console.log(`New block added ${block.toString()}`);
   res.redirect('/blocks');
   p2pServer.syncChains();
});

app.get('/transactions', (req, res) => {
   res.json(tp.transactions);
});

app.post('/transactions', (req, res) => {
   const { recipient, amount } = req.body.data;
   const transaction = wallet.createTransaction(recipient, amount, tp);
   res.redirect('/transactions');
});

app.listen(HTTP_PORT, () => {
   console.log(`listening on port ${HTTP_PORT}`);
});

p2pServer.listen();
