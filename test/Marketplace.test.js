const Marketplace = artifacts.require('Marketplace.sol');

//Implement test within here
contract('Marketplace', (accounts) => {
    let marketplaceContract;

    beforeEach(async ()=> {
        marketplaceContract = await Marketplace.deployed();
    });

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await marketplaceContract.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, '');
            assert.notEqual(address, undefined);
        });
    });
});