const Block = require('../../src/blockchain/block');

describe('Block', () => {
    let data, lastBlock, block;
    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

   it('sets the `data` to match the input', () => {
       expect(block.data).toEqual(data);
   });

    it('sets the `lasthHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('generates a hash that matches the difficulty', () => {
        console.log('Block is: ', block);
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    });

    it('it lowers difficulty for slowly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 3600000))
            .toEqual(block.difficulty - 1);
    });

    it('it raises difficulty for quickly mined blocks', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 1))
            .toEqual(block.difficulty + 1);
    });
});