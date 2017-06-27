const CatalogoOuvidorias = artifacts.require("./CatalogoOuvidorias.sol");

module.exports = function(deployer) {
  deployer.deploy(CatalogoOuvidorias, "CGU", 0, "Uniao", "http://cgu.gov.br/ouv");
  //deployer.deploy(CatalogoOuvidorias, {gas: 1000*1000*4.9});// 10M gas

  // para obter acesso ao eth aqui ou no truffle console, use web3:
  console.log(web3.eth.accounts[0]);
};
