pragma solidity ^0.4.15;

import './immla.utils.sol';
import './immla.claims.sol';

contract Offer is AC, LiveCycle {
    
    address private supplier;
    
    string public details;
    string public from;
    string public to;
    
    /**
    *   @dev - The new Offer
    *   @param _supplier Offer's real owner (supplier)
    *   @param _manager  administrative person responsible for the Offer management
    *   @param _details  additional Offer's params (e.g cost, some sort of data)
    *   @param _from     Offer's route source
    *   @param _to       Offer's route destination
    * 
    *   NOTE  The Offer's owner is a OffersRegistry, it allows to prevet not sync 
    *         data if supplier will be changed by some reasons (e.g lost keys)
    */
    function Offer(
        address _supplier,
        address _manager,
        string  _details,
        string  _from,
        string  _to
    ) 
        AC(_manager)
    {
        supplier = _supplier;
        details = _details;
        from    = _from;
        to      = _to;
        state   = Running;
    }
    
    /* @dev - get joint Offer content */
    function getData() public constant
        returns (address, string, string, string, byte) {
            return (supplier, details, from, to, state);
    }
    
    /* @dev - get the Offer's owner (supplier) */
    function getOwner() public constant
        returns (address) {
            return supplier;
    }
    
    /* @dev - get the Offer's manager */
    function getManager() public constant
        returns(address) {
            return manager;
    }
    
    /**
    *   @dev - Update Offer's details. 
    *          Method emits LogUpdated
    *   @param _details Json with list of the Offer's options
    * 
    *   NOTE  Method can be invoked only by Offer's Manager at 'Paused' state
    */
    function update(string _details) public
        atState(Paused)
        onlyManager 
    {
        details = _details;
        LogUpdated(msg.sender, details);
    }
    
    /**
    *   @dev - change Offer's state. 
    *          list of available states can find in LiveCycle
    *   @param _state new state
    * 
    *   NOTE  Method can be invoked only by Offer's Manager at non final states
    */
    function switchTo(byte _state) public
        atState(Running|Paused) 
        onlyManager 
    {
        changeState(_state);
    }
    
    /* @dev - close the Offer */
    function recall() public
        atState(Paused) 
        onlyManager
    {
        close();
    }
    
    /* @dev - manager changing is not allowed yet */
    function changeManager(address _manager) public { revert(); }
    
    // Contract Events
    event LogUpdated(address _who, string _what);
}

/* @title - cache of the newest Offers */
contract OffersCache {
    
    using Preconditions for *;
    
    uint public constant MAX_DEPTH = 20;
    uint private top = MAX_DEPTH;
    uint private currentDepth = 0;
    
    Offer[] cache;

    function OffersCache() {
        cache = new Offer[](MAX_DEPTH);
    }
    
    function push(Offer _offer) internal {
        require(!_offer.isInvalidAddr());

        if(++top >= MAX_DEPTH) {
            top = 0;
        }
        if(currentDepth < MAX_DEPTH)
            currentDepth++;
        cache[top] = _offer;
    }
    
    function peek(uint _maxDepth) public constant
        returns(Offer[]) {
            require(currentDepth > 0);
            require((_maxDepth <= MAX_DEPTH) && (_maxDepth > 0));
            
            uint recordsCount = (currentDepth < _maxDepth) 
                ? currentDepth : _maxDepth;
                
            Offer[] memory res = new Offer[](recordsCount);
            for(uint8 i = 0; i < recordsCount; i++)
                res[i] = cache[i];
                
            return res;
    }
    
    function peekTop() public constant
        returns(Offer) {
            return cache[top];
    }
}

/* @title - Offers management Contact */
contract OffersRegistry is OffersCache {
    
    mapping(uint    => Offer[]) private byRoute;
    mapping(address => Offer[]) private bySupplier;
    
    function OffersRegistry() {}
    
    using Preconditions for *;
    
    /**
     *  @dev - Create new offers depends where 
     *         src and dst are the keys for further filtering
     * 
     *  TODO Contract needs to prevent access to entity other
     *        than Suppliers 
     */
    function newOffer(
        string _details,
        string _from,
        string _to
    ) 
        public 
        //TODO: add AC
    {
        require(!_details.isEmpty());
        require(!_from.isEmpty() && !_to.isEqual(_from));
        
        //TODO: supplier ID and manager have to be recieved from the SuppliersRegistry
        address supplier = msg.sender;
        address manager  = msg.sender;
        
        Offer offer = new Offer(supplier, manager, _details, _from, _to);
        require(!offer.isInvalidAddr());
        
        uint route = uint(keccak256(_from, _to));
        byRoute[route].push(offer);
        bySupplier[supplier].push(offer);
        
        push(offer);
        LogNewOffer(offer);
    }
    
    function getOffers() public constant
        returns (Offer[]) {
            return bySupplier[msg.sender];
    }
    
    function getBySupplier(address _supplier) public constant
        returns (Offer[]) {
            require(!_supplier.isInvalidAddr());
            return bySupplier[_supplier];
    }
    
    function getByRoute(string _from, string _to) public constant
        returns (Offer[]) {
            require(!_from.isEmpty() && !_to.isEqual(_from));
        
            uint route = uint(keccak256(_from, _to));
            return byRoute[route];
    }
    
    // Contract Events
    event LogNewOffer(Offer _offer);
}
