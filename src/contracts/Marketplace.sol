pragma solidity >=0.4.21 <0.6.0;

contract Marketplace {

    string public name;
    uint public productCount;
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address owner;
        bool purchased;
    }

    constructor() public {
        name = "Marketplace";
    }

    function createProduct() public {
        //product = new Product()
        //product.purchased = false;
        //validate product is correct
        //create product
        //trigger and event 
    }
}