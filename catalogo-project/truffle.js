module.exports = {
  networks: {
    unbtest: {
      host: "testrpc", // container com o testrpc rodando tem o nome...testrpc!
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
