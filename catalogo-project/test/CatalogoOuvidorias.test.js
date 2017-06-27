const TipoEnte = require("../src/TipoEnte");
const CatalogoOuvidorias = artifacts.require("./CatalogoOuvidorias.sol");


contract('CatalogoOuvidorias', function (accounts) {

    it("Deve iniciar com dados corretos", function () {

        let primeiraOuvidoriaAccount = accounts[0];
        CatalogoOuvidorias.deployed().then((co) => {
            let primeiraOuvidoria = {};
            return co.getOuvidoriaNome(primeiraOuvidoriaAccount).then((nome) => {
                primeiraOuvidoria.nome = nome;
                return co.getOuvidoriaEnteNome(primeiraOuvidoriaAccount);
            }).then((enteNome) => {
                primeiraOuvidoria.enteNome = enteNome;
                return co.getOuvidoriaEnteTipo(primeiraOuvidoriaAccount);
            }).then((enteTipo) => {
                primeiraOuvidoria.enteTipo = enteTipo;
                return co.getOuvidoriaEndpoint(primeiraOuvidoriaAccount);
            }).then((ouvidoriaEndpoint) => {
                primeiraOuvidoria.ouvidoriaEndpoint = ouvidoriaEndpoint;

                assert.equal(primeiraOuvidoria.nome, 'CGU');
                assert.equal(primeiraOuvidoria.enteNome, 'Uniao');
                assert.equal(TipoEnte[primeiraOuvidoria.enteTipo.e], 'Uniao');
                assert.equal(primeiraOuvidoria.ouvidoriaEndpoint, 'http://cgu.gov.br/ouv');
            });
        });

    });

});
