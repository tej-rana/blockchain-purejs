const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

class Miner {

    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }


    /**
     * Gets Valid Transactions and rewards for the miner.
     * Then create a block consisting of the valid transactions.
     * Synchronizes chains in the peer to peer server.
     * Clears the transaction pool, since they are included in the blockchain
     * Broadcasts to every miner to clear their transactions pools
     */
    mine() {
        const validTransactions = this.transactionPool.validTransactions();
        validTransactions.push(
            Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
        );
        const block = this.blockchain.addBlock(validTransactions);
        this.p2pServer.syncChains();
        this.transactionPool.clear();
        this.p2pServer.broadcastClearTransaction();

        return block;
    }
}

module.exports = Miner;
