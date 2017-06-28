const TipoEnte = require("../src/TipoEnte");
const CatalogoOuvidorias = artifacts.require("./CatalogoOuvidorias.sol");

/* FUNCOES UTILITARIAS */

function clonarDebugConvertendoBytes32(log) {
    function bytes32ToString(hexx) {
        const hex = hexx.toString();
        let str = '';
        for (let i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str.replace(/\u0000/g, '');
    }
    let retorno = Object.assign({}, log.args);
    retorno.texto = bytes32ToString(retorno.texto);
    return retorno;
}

//noinspection JSUnusedLocalSymbols
function printDebugs(resultadoTransacao) {
    resultadoTransacao.logs.forEach((log) => console.log(clonarDebugConvertendoBytes32(log)));
}

function getPrimeiroDebug(resultadoTransacao) {
    return clonarDebugConvertendoBytes32(resultadoTransacao.logs[0]);
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

        let primeiraAccount = accounts[0];
        let segundaAccount = accounts[1];

        beforeEach(function () {
            catalogoOuvidoriasPromise = CatalogoOuvidorias.new(nomeOuvidoria, enteTipoCodigo, enteNome, endpoint);
        });

        it("construtor cria corretamente catalogo de testes", function () {
            return assertPrimeiraOuvidoria(
                catalogoOuvidoriasPromise,
                primeiraAccount,
                nomeOuvidoria,
                enteTipoPorExtenso,
                enteNome,
                endpoint
            );
        });

        it("ouvidoria jah cadastrada pode chamar autorizar", function () {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(segundaAccount, {from: primeiraAccount});
            }).then((resultadoTransacao) => {
                assert.deepEqual(
                    getPrimeiroDebug(resultadoTransacao),
                    {
                        endereco: primeiraAccount,
                        texto: "autorizar",
                        booleano: false
                    }
                );
            });
        });

        it("ouvidoria nao cadastrada NAO pode chamar autorizar", function () {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(primeiraAccount, {from: segundaAccount});
            }).then(() => {
                assert.fail("segunda account nao estah cadastrada, portanto deveria dar erro")
            }).catch((erro) => {
                assert.equal(erro.message, 'VM Exception while processing transaction: invalid opcode');
            });
        });

        it("ouvidoria jah cadastrada nao pode autorizar uma outra ouvidoria mais de uma vez", function () {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(segundaAccount, {from: primeiraAccount}).then(() => {
                    return catalogoOuvidorias.autorizar(segundaAccount, {from: primeiraAccount});
                }).then(() => {
                    assert.fail("segunda account nao estah cadastrada, portanto deveria dar erro")
                }).catch((erro) => {
                    assert.equal(erro.message, 'VM Exception while processing transaction: invalid opcode');
                });
            })
        });

        xit("ouvidoria jah cadastrada pode autorizar duas outras ouvidorias diferentes", function () {});
        xit("ouvidoria jah cadastrada nao pode autorizar uma outra ouvidoria jah cadastrada", function () {});

    });

});
