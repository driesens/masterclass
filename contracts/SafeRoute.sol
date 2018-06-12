pragma solidity ^0.4.23;

import "./RDWToken.sol";

contract SafeRoute {
    address private owner;
    address private driver;
    bytes32 private dossierHash;
    string private dossierPointer;
    address private tokenContract;

    // The field contains all raodManager with prices on the path
    mapping(address => uint) roadManagers;

    // Location storage with mapping to road manager
    // Location encoded as geohash
    string[] locations;
    uint256 locationsAmount = 0;
    mapping(string => address) locationMap;

    // onlyOwner is modifier which allows only owner to call function
    // example of usage in addRoadManager function
    modifier onlyOwner {
        if(msg.sender != owner) revert();
        _;
    }

    modifier onlyDriver {
        if(msg.sender != driver) revert();
        _;
    }

    constructor(address _driver, bytes32 _hash, string _pointer, address _tokenContract) public {
        owner = msg.sender;
        driver = _driver;
        dossierHash = _hash;
        dossierPointer = _pointer;
        tokenContract = _tokenContract;
    }

    function getDriver() view public returns(address) {
        return driver;
    }

    function getDossierHash() view public returns(bytes32) {
        return dossierHash;
    }

    function getDossierPointer() view public returns(string) {
        return dossierPointer;
    }

    function getBalance() view public returns(uint256) {
        RDWToken token = RDWToken(tokenContract);
        return token.balanceOf(this);
    }

    function addLocation(string _hash, address _roadManager, uint32 _price) public onlyOwner {
        locations.push(_hash);
        locationsAmount += 1;
        locationMap[_hash] = _roadManager;

        roadManagers[_roadManager] = _price;

        RDWToken token = RDWToken(tokenContract);
        token.mint(_price);
    }

    function getLocation(uint256 _index) view public returns(string, address, uint256) {
        return (locations[_index], locationMap[locations[_index]], roadManagers[locationMap[locations[_index]]]);
    }

    function getLocationsAmount() view public returns(uint256) {
        return locationsAmount;
    }

    // The function allows road managers to withdrow own tokens after the trip
    function withdraw() public returns(uint) {
        require(roadManagers[msg.sender] > 0);

        RDWToken token = RDWToken(tokenContract);
        require(token.balanceOf(this) >= roadManagers[msg.sender]);

        token.transfer(msg.sender, roadManagers[msg.sender]);
        return roadManagers[msg.sender];
    }

    function visit(address _to) public onlyDriver {
        require(roadManagers[_to] > 0);

        RDWToken token = RDWToken(tokenContract);
        require(token.balanceOf(this) >= roadManagers[_to]);

        token.transfer(_to, roadManagers[_to]);
    }
}