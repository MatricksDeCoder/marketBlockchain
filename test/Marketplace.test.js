const Marketplace = artifacts.require('Marketplace.sol');
require('chai').use(require('chai-as-promised'))
               .should();

//Implement test within here
contract('Marketplace', (accounts) => {
    let marketplaceContract;
    let deployer = accounts[0];
    let seller1   = accounts[1];
    let buyer1   = accounts[2];
    let seller2  = accounts[3];

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

    describe('products', async () => {

        let product, productCount, productName;
        let prod1_name  = 'Androidbox';
        let prod1_price = web3.utils.toWei('1', 'ether');
        let prod2_name = 'Applebox';
        let prod2_price = web3.utils.toWei('3', 'ether');

        beforeEach(async ()=>{
            product = await marketplaceContract.createProduct(prod1_name, prod1_price, {from: seller1});
            productCount = await marketplaceContract.productCount();
        });

        it('creates product', async () => {
            assert.equal(productCount,1, 'Product Count is Correct!');
            const event = product.logs[0].args;
            assert.equal(event.id.toNumber(),productCount.toNumber(),'Product id is Correct!');
            assert.equal(event.name,prod1_name, 'Product Name is Correct!');
            assert.equal(event.price,prod1_price,'Product Price is Correct!');
            assert.equal(event.owner,seller1, 'Owner address is Correct!');
            assert.equal(event.purchased, false,'Product is not yet Purchased!');
        });

        it('rejects product with no name or price not right', async() => {
               //FAILURES:
            //Product must have a name 
            await marketplaceContract.createProduct('',prod1_price,{from:seller1}).should
                                                                                          .be
                                                                                          .rejected;
            //Product no price must be rejected
            await marketplaceContract.createProduct(prod1_name,0,{from:seller1}).should 
                                                                                          .be
                                                                                          .rejected;
        });

        it('lists products', async () => {

            const product = await marketplaceContract.products(productCount);
            assert.equal(product.id,productCount.toNumber(),'Product id is Correct!');
            assert.equal(product.name,prod1_name, 'Product Name is Correct!');
            assert.equal(product.price,prod1_price,'Product Price is Correct!');
            assert.equal(product.owner,seller1, 'Owner address is Correct!');
            assert.equal(product.purchased, false,'Product is not yet Purchased!');
        });

        it('sells product', async () => {

            //track sellers balance before purchase 
            let seller1FundsBefore = await web3.eth.getBalance(seller1);
            seller1FundsBefore = new web3.utils.BN(seller1FundsBefore);

            const sale = await marketplaceContract.purchaseProduct(productCount,{from:buyer1,value:prod1_price});
            //check logs are correct
            const event = sale.logs[0].args;
            assert.equal(event.id.toNumber(),productCount.toNumber(),'Product id is Correct!');
            assert.equal(event.name,prod1_name, 'Product Name is Correct!');
            assert.equal(event.price,prod1_price,'Product Price is Correct!');
            assert.equal(event.owner,buyer1, 'New Owner is Buyer, address is Correct!');
            assert.equal(event.purchased, true,'Product is Purchased!');

            //check that seller receives funds
            let seller1FundsAfter = await web3.eth.getBalance(seller1);
            seller1FundsAfter     = new web3.utils.BN(seller1FundsAfter);
            let price = new web3.utils.BN(prod1_price);
            assert.equal(seller1FundsAfter.toString(),seller1FundsBefore.add(price).toString());
        });

       

    });

});