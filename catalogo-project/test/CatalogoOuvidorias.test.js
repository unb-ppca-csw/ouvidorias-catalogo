const TipoEnte = require("../src/TipoEnte");
const CatalogoOuvidorias = artifacts.require("./CatalogoOuvidorias.sol");

/* FUNCOES UTILITARIAS */

function fail(mensagem) {
    assert.fail(false, false, mensagem);
}
function assertRequireFalhou(erro) {
    // falha de alguma condicao dentro de um require(...) no solidity
    assert.equal(erro.message, 'VM Exception while processing transaction: invalid opcode');
}
function uint(_uint) {
    return _uint.c[0];
}

function clonarEventoConvertendoPropriedades(log, propriedadesBytes32, propriedadesUint) {
    function bytes32ToString(hexx) {
        const hex = hexx.toString();
        let str = '';
        for (let i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str.replace(/\u0000/g, '');
    }
    let retorno = Object.assign({}, log.args);
    propriedadesBytes32.forEach((propBytes32) => {
        retorno[propBytes32] = bytes32ToString(retorno[propBytes32]);
    });
    propriedadesUint.forEach((propUint) => {
        retorno[propUint] = uint(retorno[propUint]);
    });
    return retorno;
}

function assertPrimeiroEvento(resultadoTransacao, propriedadesBytes32, propriedadesUint, nomeTipoEvento, eventoEsperado) {
    assert.deepEqual(
        clonarEventoConvertendoPropriedades(resultadoTransacao.logs[0], propriedadesBytes32, propriedadesUint),
        eventoEsperado
    );
    assert.equal(resultadoTransacao.logs[0].event, nomeTipoEvento);
}

function assertEventoOuvidoriaAutorizada(resultadoTransacao, eventoEsperado) {
    assertPrimeiroEvento(
        resultadoTransacao,
        [],
        [],
        "ouvidoriaAutorizada",
        eventoEsperado
    );
}

function assertEventoOuvidoriaCadastrada(resultadoTransacao, eventoEsperado) {
    assertPrimeiroEvento(
        resultadoTransacao,
        ["nome", "nomeEnte", "endpoint"],
        ["tipoEnte"],
        "ouvidoriaCadastrada",
        eventoEsperado
    );
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
        const ouvDF = {
            conta: accounts[0],
            nome: "CGU-DF",
            tipoEnte: 1,
            tipoPorExtenso: "Estado/DF",
            nomeEnte: "DF",
            endpoint: "http://cgu.gov.br/ouv-ba"
        };
        const ouvBA = {
            conta: accounts[1],
            nome: "CGU-BA",
            tipoEnte: 1,
            nomeEnte: "BA",
            endpoint: "http://cgu.gov.br/ouv-ba"
        };
        const ouvAJU = {
            conta: accounts[2],
            nome: "Pref. Aracaju",
            tipoEnte: 2,
            nomeEnte: "Aracaju-SE",
            endpoint: "http://aracaju.se.gov.br/ouv"
        };

        let catalogoOuvidoriasPromise;

        beforeEach(() => {
            catalogoOuvidoriasPromise = CatalogoOuvidorias.new(ouvDF.nome, ouvDF.tipoEnte, ouvDF.nomeEnte, ouvDF.endpoint);
        });

        it("construtor cria corretamente catalogo de testes", () => {
            return assertPrimeiraOuvidoria(
                catalogoOuvidoriasPromise,
                ouvDF.conta,
                ouvDF.nome,
                ouvDF.tipoPorExtenso,
                ouvDF.nomeEnte,
                ouvDF.endpoint
            );
        });

        it("ouvidoria jah cadastrada pode chamar autorizar", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(ouvBA.conta, {from: ouvDF.conta});
            }).then((resultadoTransacao) => {
                assertEventoOuvidoriaAutorizada(
                    resultadoTransacao,
                    {
                        ouvidoriaAutorizadora: ouvDF.conta,
                        ouvidoriaCandidata: ouvBA.conta
                    }
                );
            });
        });

        it("ouvidoria nao cadastrada NAO pode chamar autorizar", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(ouvDF.conta, {from: ouvBA.conta});
            }).then(() => {
                fail("ouvBA nao estah cadastrada, portanto nao pode autorizar ninguem")
            }, (erro) => {
                assertRequireFalhou(erro);
            });
        });

        it("ouvidoria jah cadastrada nao pode autorizar uma outra ouvidoria mais de uma vez", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(ouvBA.conta, {from: ouvDF.conta}).then(() => {
                    return catalogoOuvidorias.autorizar(ouvBA.conta, {from: ouvDF.conta});
                }).then(() => {
                    fail("ouvDF jah autorizou a ouvBA, nao poderia autorizar uma segunda vez")
                }, (erro) => {
                    assertRequireFalhou(erro);
                });
            })
        });

        xit("ouvidoria jah cadastrada nao pode autorizar uma outra ouvidoria jah cadastrada", () => {
            // soh vou conseguir implementar depois que o metodo de efetivacao de cadastro estiver concluido
        });

        it("candidata sem autorizacoes nao consegue cadastrar-se", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.cadastrar(ouvBA.nome, ouvBA.tipoEnte, ouvBA.nomeEnte, ouvBA.endpoint, {from: ouvBA.conta}).then(() => {
                    fail("como a ouvBA nao recebeu uma autorizacao, nao pode se cadastrar")
                }, (erro) => {
                    assertRequireFalhou(erro);
                });
            });
        });

        it("quando ha somente uma ouvidoria cadastrada, uma candidata consegue cadastrar-se tendo apenas uma autorizacao", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(ouvBA.conta, {from: ouvDF.conta}).then(() => {
                    return catalogoOuvidorias.cadastrar(ouvBA.nome, ouvBA.tipoEnte, ouvBA.nomeEnte, ouvBA.endpoint, {from: ouvBA.conta}).then((tx) => {
                        assertEventoOuvidoriaCadastrada(
                            tx,
                            ouvBA
                        );
                        return catalogoOuvidorias.getNumeroDeOuvidorias();
                    }).then((numeroDeOuvidorias) => {
                        assert.equal(uint(numeroDeOuvidorias), 2);
                    });
                });
            });
        });

        xit("quando ha somente duas ouvidorias cadastradas, uma candidata NAO consegue cadastrar-se tendo apenas uma autorizacao", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(ouvBA.conta, {from: ouvDF.conta}).then(() => {
                    return catalogoOuvidorias.cadastrar(ouvBA.nome, ouvBA.tipoEnte, ouvBA.nomeEnte, ouvBA.endpoint, {from: ouvBA.conta});
                }).then(() => {
                    return catalogoOuvidorias.autorizar(ouvAJU.conta, {from: ouvDF.conta});
                }).then(() => {
                    return catalogoOuvidorias.cadastrar(ouvAJU.conta, ouvAJU.tipoEnte, ouvAJU.nomeEnte, ouvAJU.endpoint, {from: ouvAJU.conta}).then(() => {
                        fail("como a ouvAJU nao recebeu uma autorizacao, nao poderia se cadastrar")
                    }, (erro) => {
                        assertRequireFalhou(erro);
                    });
                });
            });
        });

        xit("quando ha somente duas ouvidorias cadastradas, uma candidata consegue cadastrar-se tendo apenas duas autorizacoes", () => { });

        xit("quando ha tres ou mais ouvidorias cadastradas, uma candidata NAO consegue cadastrar-se tendo apenas uma autorizacao", () => { });
        xit("quando ha tres ou mais ouvidorias cadastradas, uma candidata NAO consegue cadastrar-se tendo apenas duas autorizacoes", () => { });
        xit("quando ha tres ou mais ouvidorias cadastradas, uma candidata consegue cadastrar-se tendo apenas tres autorizacoes", () => { });

    });

});
