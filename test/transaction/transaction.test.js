const Transaction = require('../../src/wallet/transaction');
const Wallet = require('../../src/wallet');
const { MINING_REWARD } = require('../../config');

describe('Transaction', () => {
   let transaction, wallet, recipient, amount;

   beforeEach(() => {
      wallet = new Wallet();
      amount = 50;
      recipient = '4ddr355';
      transaction = Transaction.newTransaction(wallet, recipient, amount);
   });

   it('outputs the `amount` subtracted from the wallet balance', () => {
      expect(transaction.outputs.find(x => x.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - amount);
   });

   it('outputs the `amount` added to the recipient', () => {
       expect(transaction.outputs.find(x => x.address === recipient).amount)
           .toEqual(amount);
   });

   it('transaction exceeding the available amount fails', () => {
      let newAmount = 5000000;
      let transaction2 = Transaction.newTransaction(wallet, recipient, newAmount);

      expect(transaction2).toEqual(undefined);
   });

   it('inputs the balance of the wallet', () => {
      expect(transaction.input.amount).toEqual(wallet.balance);
   });

   it('validates a valid transaction', () => {
      expect(Transaction.verifyTransaction(transaction)).toBe(true);
   });

   it('invalidates a corrupt transaction', () => {
      transaction.outputs[0].amount = 99999; //it is actually 450 as 50 is transferred.
      expect(Transaction.verifyTransaction(transaction)).toBe(false);
   });


   describe('Updating a transaction', () => {
      let nextAmount, nextRecipient;

      beforeEach(() => {
         nextAmount = 20;
         nextRecipient = 'n3xt-4ddr355';
         transaction = transaction.update(wallet, nextRecipient, nextAmount);
      });

      it(`subtracts the next amount from the sender's output`, () => {
         // original wallet balance (with INITIAL_AMOUNT) - original amount - nextAmount
         expect(transaction.outputs.find(x => x.address === wallet.publicKey).amount).toBe(wallet.balance - amount - nextAmount);
      });

      it(`outputs an amount for the next recipient`, () => {
         // original wallet balance (with INITIAL_AMOUNT) - original amount - nextAmount
         expect(transaction.outputs.find(x => x.address === nextRecipient).amount).toBe(nextAmount);
      });

   });
   describe('Creating a reward transaction', () => {
      beforeEach(() => {
         // wallet = miner's wallet
          transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
      });

      it(`reward the miner's wallet`, () => {
         expect(transaction.outputs.find(o => o.address === wallet.publicKey). amount).toEqual(MINING_REWARD);
      });

   });
});
