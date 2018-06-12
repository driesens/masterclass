pragma solidity ^0.4.23;

import "./RDWToken.sol";

contract SafeRoute {
    address private owner;
    bytes32 private dossierHash;
    string private dossierPointer;
    address private tokenContract;
	address private driver;
    
	struct location {
      int32 lon;
      int32 lat;
	  address roadManager;
    }

    // The field contains all roadManager with prices on the path
    mapping(address => uint) roadManagers;
    
	// The field contains all waypoints for this route
	location[] private waypoints;
	
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

    constructor(bytes32 _hash, string _pointer, address _tokenContract, address _driver) public {
        owner = msg.sender;
        dossierHash = _hash;
        dossierPointer = _pointer;
        tokenContract = _tokenContract;
		driver = _driver;
    }

    /*
    The function allows to add new road manager,
    it also increases amount of tokens for the contract, to bee sure
    thet it will be enough to pay at the end of the trip
    */
    function addRoadManager(address _roadManager, uint32 _price) public onlyOwner {
        roadManagers[_roadManager] = _price;

        RDWToken token = RDWToken(tokenContract);
        token.mint(_price);
    }

	function addWaypoint(int32 _lon, int32 _lat, address _roadManager) public onlyOwner {
  	    location memory point;
		point.lon = _lon;
		point.lat = _lat;
		point.roadManager = _roadManager;
		waypoints.push(point);
    }
	
	function withdraw(int32 _lon, int32 _lat) public onlyDriver {
		address roadManager;
		for (uint idx = 0; idx < waypoints.length; idx++)
		{
			if(waypoints[idx].lon == _lon && waypoints[idx].lat == _lat)
			{
				roadManager = waypoints[idx].roadManager;
				break;
			}
		}
		require(roadManagers[roadManager] > 0);
        RDWToken token = RDWToken(tokenContract);
        require(token.balanceOf(this) >= roadManagers[roadManager]);
        token.transfer(roadManager, roadManagers[roadManager]);
	}
	
    // The function allows road managers to withdrow own tokens after the trip
    /* function withdraw() public returns(uint) {
        require(roadManagers[msg.sender] > 0);

        RDWToken token = RDWToken(tokenContract);
        require(token.balanceOf(this) >= roadManagers[msg.sender]);

        token.transfer(msg.sender, roadManagers[msg.sender]);
        return roadManagers[msg.sender];
    }*/
}