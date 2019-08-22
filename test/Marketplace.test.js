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

        it('has a name', async () => {
            const name = await marketplaceContract.name();
            assert.notEqual(name, null);
            assert.notEqual(name,undefined);
            assert.notEqual(name, '');
            assert.equal(name, 'Marketplace');
        })
    });

    describe('product creation', async () => {

        let product, productCount;
        beforeEach(async ()=>{
            product = await marketplaceContract.createProduct();
            productCount = await marketplaceContract.productCount();
        });

        it('changes productCount', async () => {

        });
    });

});