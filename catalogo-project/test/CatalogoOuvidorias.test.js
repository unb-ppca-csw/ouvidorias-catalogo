const TipoEnte = require("../src/TipoEnte");
const CatalogoOuvidorias = artifacts.require("./CatalogoOuvidorias.sol");


function assertPrimeiraOuvidoria(contractInstance, _account, _nome, _enteTipo, _enteNome, _endpoint) {
    return contractInstance.then((co) => {
        let primeiraOuvidoriaAccount = _account;
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

            assert.equal(primeiraOuvidoria.nome, _nome);
            assert.equal(TipoEnte[primeiraOuvidoria.enteTipo.c[0]], _enteTipo);
            assert.equal(primeiraOuvidoria.enteNome, _enteNome);
            assert.equal(primeiraOuvidoria.ouvidoriaEndpoint, _endpoint);
        });
    });
}

contract('CatalogoOuvidorias', function (accounts) {

    it("script de deploy padrao constroi corretamente o contrato inicial", function () {
        let contractInstance = CatalogoOuvidorias.deployed();

        return assertPrimeiraOuvidoria(
            contractInstance,
            accounts[0],
            'CGU',
            'Uniao',
            'Uniao',
            'http://cgu.gov.br/ouv'
        );
    });

    describe("CatalogoOuvidorias criado em testes", function() {
        let nomeOuvidoria = "CGU-DF";
        let enteTipoCodigo = 1;
        let enteTipoPorExtenso = 'Estado/DF';
        let enteNome = "DF";
        let endpoint = "http://cgu.gov.br/ouv-df";

        let catalogoOuvidoriasPromise;

        beforeEach(function () {
            catalogoOuvidoriasPromise = CatalogoOuvidorias.new(nomeOuvidoria, enteTipoCodigo, enteNome, endpoint);
        });

        it("construtor cria corretamente catalogo de testes", function () {
            return assertPrimeiraOuvidoria(
                catalogoOuvidoriasPromise,
                accounts[0],
                nomeOuvidoria,
                enteTipoPorExtenso,
                enteNome,
                endpoint
            );
        });
    });

});
