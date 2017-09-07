pragma solidity ^0.4.15;

import "./immla.utils.sol";
import "./immla.offers.sol";

/* @title - Deal between Client and Supplier */
contract Deal is LiveCycle {
    
    using Preconditions for *;
    
    Offer public offer;
    address public customer;
    
    byte constant public SUPPLIER = 0x1;
    byte constant public CLIENT   = 0x2;
    
    byte public status = byte(0);
    
    ClaimInterface private recallClaim;
    
    /**
     *  @dev - new deal instance between Client and Supplier
     * 
     *  TODO need to change customer to 'Order'
     */
    function Deal(address _customer, Offer _offer) {
        require(!_offer.isInvalidAddr() && _offer.isRunning());
        require(!_customer.isInvalidAddr());
        
        offer = _offer;
        customer = _customer;
        
        // default state is Running
        changeState(Running);
    }
    
    /* @dev - get joint Deal content */
    function getData() public constant
        returns (address, address, bool, byte) {
            return (offer, customer, isCompleted(), status);
    }
    
    /* @dev - complete the Order by the Supplier side */
    function compete() public 
        atState(Running) 
        only(offer.getOwner()) 
    {
        status |= SUPPLIER;
        if(isCompleted()) {
            changeState(Paused);
            close();
        }
    }
    
    /* @dev - complete the Order by the Client side */
    function confirm() public 
        atState(Running) 
        only(customer) 
    {
        status |= CLIENT;
        if(isCompleted()) {
            changeState(Paused);
            close();
        }
    }
    
    /* @dev - check is Order is completed */
    function isCompleted() public constant 
        returns (bool) {
            return (status == (SUPPLIER | CLIENT));
    }
    
    /**
    *   @dev   recall the deal by some reasons
    *   @param _recallClaim reason why the Deal was closed
    */
    function recall(ClaimInterface _recallClaim) public
        atState(Running|Paused) 
        anyOfTwo([offer.getOwner(), customer]) 
    {
        require(!_recallClaim.isInvalidAddr());
        recallClaim = _recallClaim;
        interrupt();
    }
    
    /* @dev - Get details why Offer was closed */
    function getRecallClaim() public constant
        atState(Interrupted)
        returns(ClaimInterface) {
            return recallClaim;
    }
    
    /* @dev - direct change state is not allowed */
    function switchTo(byte _state) public { revert(); }
    
    // Contact Modifiers
    modifier only(address _who) { 
        require(!_who.isInvalidAddr()); 
        require(msg.sender == _who); 
        _; 
    }
    
    modifier anyOfTwo(address[2] memory _who) { 
        bool res = false;
        for(uint i = 0; i < _who.length; i++) {
            require(!_who[i].isInvalidAddr());
            if(msg.sender == _who[i]) {
                res = true;
                break;
            }
        }
        if(!res) revert();
        _; 
    }
}

/* @title - Registry of the created Deals */
contract DealsRegistry {
    
    using Preconditions for *;
    
    mapping(address => Deal[]) private byOwners;
    mapping(address => Deal[]) private bySuppliers;
    
    function DealsRegistry() {}
    
    function newDeal(Offer _offer) public {
        require(!_offer.isInvalidAddr());
        
        Deal deal = new Deal(msg.sender, _offer);
        require(!deal.isInvalidAddr());
        
        bySuppliers[_offer.getOwner()].push(deal);
        byOwners[msg.sender].push(deal);
    }
    
    function getMyOwnedDeal(uint _pos) public constant 
        returns (Deal) {
            require(byOwners[msg.sender].length > _pos);
            return byOwners[msg.sender][_pos];
    }
    
    function getMyOwnedDeals() public constant 
        returns (Deal[]) {
            return byOwners[msg.sender];
    }
    
    function getMyOwnedDealCount() public constant 
        returns (uint) {
            return byOwners[msg.sender].length;
    }
    
    function getMySupplyingDeal(uint _pos) public constant 
        returns (Deal) {
            require(bySuppliers[msg.sender].length > _pos);
            return bySuppliers[msg.sender][_pos];
    }
    
    function getMySupplyingDeals() public constant 
        returns (Deal[]) {
            return bySuppliers[msg.sender];
    }
    
    function getMySupplyingDealCount() public constant 
        returns (uint) {
            return bySuppliers[msg.sender].length;
    }
}