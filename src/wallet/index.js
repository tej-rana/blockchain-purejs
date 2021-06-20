const { INITIAL_BALANCE } = require('../../config');
const Transaction = require('./transaction');
const ChainUtil = require('../chain-util');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return `Wallet - 
        public key: ${this.publicKey.toString()}
        balance   : ${this.balance}`
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool) {
        this.balance = this.calculateBalance(blockchain);

        if (amount > this.balance) {
            console.log(`Amount: ${amount} exceeds the wallet's balance: ${this.balance}`);
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);
        if(transaction) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }

        return transaction;
    }

    /**
     * Get balance by
     * 1. Get all transactions in the blockchain
     * 2a. Extract all transactions where input address is this wallet
     * 2b. Get the latest input transaction based on 2a
     * 2c. Set the balance to sum of all outputs of the 2b where address is this wallet
     * 2d. Set the StartTime to 2b's input's timestamp.
     * 3a. From the entire transaction history extract transactions where timestamp is after 2d.
     * 3b. Within 3a, get all output transactions and add to balance if the wallet address of the output is this wallet.
     * @param blockchain
     * @returns {number}
     */
    calculateBalance(blockchain) {
        let balance = this.balance;
        let transactions = [];
        // all transactions in each block in the blockchain .. entire history
        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction);
        }));

        const walletInputTs = transactions
            .filter(transaction => transaction.input.address === this.publicKey);

        let startTime = 0;

        if (walletInputTs.length > 0) {
            const recentInputT = walletInputTs.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
            );

            balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentInputT.input.timestamp;
        }

        // we only add the outputs from entire history of transactions
        // that have come after this wallet's most recent input transaction's outputs
        // where the public key matches this wallets public key.
        transactions.forEach(transaction => {
            if (transaction.input.timestamp > startTime) {
                transaction.outputs.find(output => {
                    if (output.address === this.publicKey) {
                        balance += output.amount;
                    }
                });
            }
        });

        return balance;
    }

    static blockchainWallet() {
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;
