var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var ProofOfExistence1 = artifacts.require("./ProofOfExistence1.sol");
var ProofOfExistence2 = artifacts.require("./ProofOfExistence2.sol");
var ProofOfExistence3 = artifacts.require("./ProofOfExistence3.sol");
var CatalogoOuvidorias = artifacts.require("./CatalogoOuvidorias.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);

  deployer.deploy(ProofOfExistence1);
  deployer.deploy(ProofOfExistence2);
  deployer.deploy(ProofOfExistence3);

  deployer.deploy(CatalogoOuvidorias, "CGU", 0, "Uniao", "http://cgu.gov.br/ouv");
  //deployer.deploy(CatalogoOuvidorias, {gas: 1000*1000*4.9});// 10M gas

  // para obter acesso ao eth aqui ou no truffle console
  console.log('accounts', web3.eth.accounts[0]);
};
