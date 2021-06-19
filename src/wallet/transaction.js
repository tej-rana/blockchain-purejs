const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../../config');

class Transaction {
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(senderWallet, recipient, amount) {
        const senderOutput = this.outputs.find(x => x.address === senderWallet.publicKey);
        if(amount > senderOutput.amount) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount; // this updates an existing output (this sender's output)
        this.outputs.push({amount, address: recipient}); // this adds a new output
        Transaction.signTransaction(this, senderWallet); // this will be the new input

        return this;
    }

    static transactionWithOutputs(senderWallet, outputs) {
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);

        return transaction;
    }

    /**
     * Creates new transaction, and returns it
     * @param senderWallet Public Key and balance
     * @param recipient Recipient Address
     * @param amount Amount to send
     */
    static newTransaction(senderWallet, recipient, amount) {
        if(amount > senderWallet.balance) {
            console.log(`Amount; ${amount} exceeds balance.`);
            return;
        }

        return Transaction.transactionWithOutputs(senderWallet,[
            {amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            {amount, address: recipient}
        ]);
    }

    /**
     * Rewards Transaction to miner
     * @param minerWallet Miner's Wallet
     * @param blockchainWallet Special wallet that will generate signatures to confirm and authenticate reward transactions
     * @returns {Transaction}
     */
    static rewardTransaction(minerWallet, blockchainWallet) {
        return Transaction.transactionWithOutputs(blockchainWallet, [{amount: MINING_REWARD, address: minerWallet.publicKey}])
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
          timestamp: Date.now(),
          amount   : senderWallet.balance,
          address  : senderWallet.publicKey,
          signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        };
    }

    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }
}

module.exports = Transaction;
