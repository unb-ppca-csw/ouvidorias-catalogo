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


function assertPrimeiroDebug(resultadoTransacao, debugEsperado) {
    assert.deepEqual(
        getPrimeiroDebug(resultadoTransacao),
        debugEsperado
    );
}
contract('CatalogoOuvidorias', (accounts) => {

    it("script de deploy padrao constroi corretamente o contrato inicial", () => {
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

    describe("CatalogoOuvidorias criado em testes", () => {
        let nomeOuvidoria = "CGU-DF";
        let enteTipoCodigo = 1;
        let enteTipoPorExtenso = 'Estado/DF';
        let enteNome = "DF";
        let endpoint = "http://cgu.gov.br/ouv-df";

        let catalogoOuvidoriasPromise;

        let primeiraAccount = accounts[0];
        let segundaAccount = accounts[1];

        beforeEach(() => {
            catalogoOuvidoriasPromise = CatalogoOuvidorias.new(nomeOuvidoria, enteTipoCodigo, enteNome, endpoint);
        });

        it("construtor cria corretamente catalogo de testes", () => {
            return assertPrimeiraOuvidoria(
                catalogoOuvidoriasPromise,
                primeiraAccount,
                nomeOuvidoria,
                enteTipoPorExtenso,
                enteNome,
                endpoint
            );
        });

        it("ouvidoria jah cadastrada pode chamar autorizar", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(segundaAccount, {from: primeiraAccount});
            }).then((resultadoTransacao) => {
                assertPrimeiroDebug(
                    resultadoTransacao,
                    {
                        endereco: primeiraAccount,
                        texto: "autorizar",
                        booleano: false
                    }
                );
            });
        });

        it("ouvidoria nao cadastrada NAO pode chamar autorizar", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(primeiraAccount, {from: segundaAccount});
            }).then(() => {
                assert.fail(false, false, "segundaAccount nao estah cadastrada, portanto deveria dar erro")
            }, (erro) => {
                assert.equal(erro.message, 'VM Exception while processing transaction: invalid opcode');
            });
        });

        it("ouvidoria jah cadastrada nao pode autorizar uma outra ouvidoria mais de uma vez", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(segundaAccount, {from: primeiraAccount}).then(() => {
                    return catalogoOuvidorias.autorizar(segundaAccount, {from: primeiraAccount});
                }).then(() => {
                    assert.fail(false, false, "primeiraAccount jah autorizou a segundaAccount, entao deveria dar erro")
                }, (erro) => {
                    assert.equal(erro.message, 'VM Exception while processing transaction: invalid opcode');
                });
            })
        });

        xit("ouvidoria jah cadastrada nao pode autorizar uma outra ouvidoria jah cadastrada", () => {
            // soh vou conseguir implementar depois que o metodo de efetivacao de cadastro estiver concluido
        });

        it("candidata sem autorizacoes nao consegue cadastrar-se", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.cadastrar("CGU-BA", 1, "BA", "http://cgu.gov.br/ouv-ba", {from: segundaAccount}).then(() => {
                    assert.fail(false, false, "como a segundaAccount nao recebeu uma autorizacao, nao pode cadastrar-se")
                }, (erro) => {
                    assert.equal(erro.message, 'VM Exception while processing transaction: invalid opcode');
                });
            });
        });

        xit("quando ha somente uma ouvidoria cadastrada, uma candidata consegue cadastrar-se tendo apenas uma autorizacao", () => { });

        xit("quando ha somente duas ouvidorias cadastradas, uma candidata NAO consegue cadastrar-se tendo apenas uma autorizacao", () => { });
        xit("quando ha somente duas ouvidorias cadastradas, uma candidata consegue cadastrar-se tendo apenas duas autorizacoes", () => { });

        xit("quando ha tres ou mais ouvidorias cadastradas, uma candidata NAO consegue cadastrar-se tendo apenas uma autorizacao", () => { });
        xit("quando ha tres ou mais ouvidorias cadastradas, uma candidata NAO consegue cadastrar-se tendo apenas duas autorizacoes", () => { });
        xit("quando ha tres ou mais ouvidorias cadastradas, uma candidata consegue cadastrar-se tendo apenas tres autorizacoes", () => { });

    });

});
