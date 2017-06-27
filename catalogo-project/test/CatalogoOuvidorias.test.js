const TipoEnte = require("../src/TipoEnte");
const CatalogoOuvidorias = artifacts.require("./CatalogoOuvidorias.sol");


contract('CatalogoOuvidorias', function (accounts) {

    it("script de deploy padrao constroi corretamente o contrato inicial", function () {

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
                assert.equal(TipoEnte[primeiraOuvidoria.enteTipo.c[0]], 'Uniao');
                assert.equal(primeiraOuvidoria.ouvidoriaEndpoint, 'http://cgu.gov.br/ouv');
            });
        });

    });

    it("construtor cria corretamente catalogo", function () {
        const contractInstance = CatalogoOuvidorias.new("CGU-DF", 1, "DF", "http://cgu.gov.br/ouv-df");

        let primeiraOuvidoriaAccount = accounts[0];
        contractInstance.then((co) => {
            let primeiraOuvidoria = {};
            return co.getOuvidoriaNome(primeiraOuvidoriaAccount).then((nome) => {
                primeiraOuvidoria.nome = nome;
                return co.getOuvidoriaEnteTipo(primeiraOuvidoriaAccount);
            }).then((enteTipo) => {
                primeiraOuvidoria.enteTipo = enteTipo;
                return co.getOuvidoriaEnteNome(primeiraOuvidoriaAccount);
            }).then((enteNome) => {
                primeiraOuvidoria.enteNome = enteNome;
                return co.getOuvidoriaEndpoint(primeiraOuvidoriaAccount);
            }).then((ouvidoriaEndpoint) => {
                primeiraOuvidoria.ouvidoriaEndpoint = ouvidoriaEndpoint;

                assert.equal(primeiraOuvidoria.nome, 'CGU-DF');
                assert.equal(TipoEnte[primeiraOuvidoria.enteTipo.c[0]], 'Estado/DF');
                assert.equal(primeiraOuvidoria.enteNome, 'DF');
                assert.equal(primeiraOuvidoria.ouvidoriaEndpoint, 'http://cgu.gov.br/ouv-df');
            });
        });

    });

});
