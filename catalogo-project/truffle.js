module.exports = {
  networks: {
    unbtest: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
      ,gas: 4712388 // valor padrao (nao consegui aumentar)
    }
  }
};
