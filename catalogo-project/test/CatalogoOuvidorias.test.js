const TipoEnte = require("../src/TipoEnte");
const CatalogoOuvidorias = artifacts.require("./CatalogoOuvidorias.sol");

function bytes32ToString(hexx) {
    const hex = hexx.toString();//force conversion
    let str = '';
    for (let i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str.substring(1);
}

//noinspection JSUnusedLocalSymbols
function printLogs(resultadoTransacao) {
    let logs = resultadoTransacao.receipt.logs;
    logs.forEach((log) => console.log('Log: ', bytes32ToString(log.data)));
}

function getFirstLog(resultadoTransacao) {
    let logs = resultadoTransacao.receipt.logs;
    return bytes32ToString(logs[0].data);
}

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

        it("chamar autorizar", function () {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(accounts[0]).then((resultadoTransacao) => {
                    assert.equal('autorizar', getFirstLog(resultadoTransacao));
                });
            });
        });
    });

});
