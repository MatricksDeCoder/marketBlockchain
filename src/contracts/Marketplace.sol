pragma solidity >=0.4.21 <0.6.0;

contract Marketplace {
    //state variable stored/written on blockchain
    //public called from any place
    string public name;
    constructor() public {
        name = "Marketplace";
    }
}