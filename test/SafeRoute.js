var SafeRoute = artifacts.require("SafeRoute");
var RDWToken = artifacts.require("RDWToken");

contract('SafeRoute', function(accounts) {
  let contract;
  let token;
  
  beforeEach(async () => {
	token = await RDWToken.new();
	contract = await SafeRoute.new("0x1D606B889E3B0C60482948CA66192D52438F5A10E9A930C55C238398E9C0500B","http://localhost/dossier/id=1234",token.address);
  });
  
  it("addRoadManager, assert balance of contract.address", async function() {
    //act
	contract.addRoadManager(accounts[1], 100, {from: accounts[3]});
    //assert
    const balance = await token.balanceOf(contract.address);
    assert.equal(parseInt(balance), 100, "wasn't in the first account");
  });
});