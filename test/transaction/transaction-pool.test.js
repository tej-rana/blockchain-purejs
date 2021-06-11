const TransactionPool = require('../../src/wallet/transaction-pool');
const Transaction = require('../../src/wallet/transaction');
const Wallet = require('../../src/wallet');

describe('TransactionPool', () =>{

    let tp, wallet, transaction;

    beforeEach(() => {
       tp = new TransactionPool();
       wallet = new Wallet();
       transaction = Transaction.newTransaction(wallet, 'r4nd-4dr355', 30);
       tp.updateOrAddTransaction(transaction);
    });

    it('adds a transaction to the pool', () => {
        expect(tp.transactions.find(x => x.id === transaction.id)).not.toBeNull();
    });

    it('it updates a transaction in the pool', () => {
        const transactionCopy = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'foo-4ddr355',40);
        tp.updateOrAddTransaction(newTransaction);
        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(transactionCopy);
    });
});
