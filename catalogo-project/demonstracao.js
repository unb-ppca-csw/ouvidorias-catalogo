const CatalogoOuvidorias = artifacts.require("./CatalogoOuvidorias.sol");

const TipoEnte = ['Uniao', 'Estado/DF', 'Município'];

// http://truffle.readthedocs.io/en/beta/getting_started/scripts/
module.exports = function(finalizarExecucao) {

    let account = web3.eth.accounts[0];
    CatalogoOuvidorias.deployed().then((co) => {
        let primeiraOuvidoria = {
            account: account
        };
        return co.getOuvidoriaNome(account).then((nome) => {
            primeiraOuvidoria.nome = nome;
            return co.getOuvidoriaEnteNome(account);
        }).then((enteNome) => {
            primeiraOuvidoria.enteNome = enteNome;

            return co.getOuvidoriaEnteTipo(account);
        }).then((enteTipo) => {
            primeiraOuvidoria.enteTipo = enteTipo;

            return co.getOuvidoriaEndpoint(account);
        }).then((ouvidoriaEndpoint) => {
            primeiraOuvidoria.ouvidoriaEndpoint = ouvidoriaEndpoint;

            console.log('-'.repeat(60));
            console.log('Primeira Ouvidoria - Account:', primeiraOuvidoria.account);
            console.log('Primeira Ouvidoria - Nome Orgao:', primeiraOuvidoria.nome);
            console.log('Primeira Ouvidoria - Nome Ente:', primeiraOuvidoria.enteNome);
            console.log('Primeira Ouvidoria - Tipo Ente:', TipoEnte[primeiraOuvidoria.enteTipo.e]);
            console.log('Primeira Ouvidoria - Endpoint:', primeiraOuvidoria.ouvidoriaEndpoint);

            finalizarExecucao();
        })
    });
};



