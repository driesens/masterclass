var RDWToken = artifacts.require("./RDWToken.sol");
var RDW = artifacts.require("./RDW.sol");

module.exports = function (deployer) {
  deployer.deploy(RDWToken)
    .then(function () {
      return deployer.deploy(RDW, RDWToken.address);
    });
};
