const Transaction = require('./transaction');
class TransactionPool {

    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        let transactionWithId = this.transactions.find(x => x.id === transaction.id);
        if(transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        } else {
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address) {
        return this.transactions.find(t => t.input.address === address);
    }

    validTransactions() {
        return this.transactions.filter(trans => {
            // get total of each transaction
            const outputTotal = trans.outputs.reduce((total, output) => {
               return total + output.amount
            }, 0);

            // verify the amount in input (what the wallet has) is equal to sum of all outputs for this wallet
            if(trans.input.amount !== outputTotal) {
                console.log(`Invalid transaction from ${trans.input.address}.`);
                return; //skip this transaction
            }
            // verifies signature
            if(!Transaction.verifyTransaction(trans)) {
                console.log(`Invalid signature from ${trans.input.address}.`);
                return;
            }

            return trans;
        });
    }
}

module.exports = TransactionPool;
