const TipoEnte = require("../src/TipoEnte");
const CatalogoOuvidorias = artifacts.require("./CatalogoOuvidorias.sol");

/**
 * @function contract
 */

/**
 * @namespace artifacts
 */

/**
 * @typedef {Object} uint
 * @property {Array} c
 */

/**
 * @typedef {Object} Transacao
 * @property {Array} logs
 */

/**
 * @typedef {Object} CatalogoOuvidorias
 * @property {Function} deployed
 * @property {Function} new
 * @property {Function} autorizar
 * @property {Function} cadastrar
 * @property {Function} getNumeroDeOuvidorias
 * @property {Function} getOuvidoriaNome
 * @property {Function} getOuvidoriaEnteTipo
 * @property {Function} getOuvidoriaEnteNome
 * @property {Function} getOuvidoriaEndpoint
 */


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

function assertOuvidoria(catalogoOuvidoriasPromise, ouvidoriaEsperada) {
    return catalogoOuvidoriasPromise.then((co) => {
        let ouvidoriaObtida = {
            conta: ouvidoriaEsperada.conta
        };
        return co.getOuvidoriaNome(ouvidoriaEsperada.conta).then((nome) => {
            ouvidoriaObtida.nome = nome;
            return co.getOuvidoriaEnteTipo(ouvidoriaEsperada.conta);
        }).then((tipoEnte) => {
            ouvidoriaObtida.tipoEnte = uint(tipoEnte);
            return co.getOuvidoriaEnteNome(ouvidoriaEsperada.conta);
        }).then((nomeEnte) => {
            ouvidoriaObtida.nomeEnte = nomeEnte;
            return co.getOuvidoriaEndpoint(ouvidoriaEsperada.conta);
        }).then((_endpoint) => {
            ouvidoriaObtida.endpoint = _endpoint;

            assert.deepEqual(
                ouvidoriaObtida,
                ouvidoriaEsperada
            );
        });
    });
}





contract('CatalogoOuvidorias', (accounts) => {

    it("script de deploy padrao constroi corretamente o contrato inicial", () => {
        const ouvGeral = {
            conta: accounts[0],
            nome: "CGU-OGU",
            tipoEnte: 0,
            nomeEnte: "Uniao",
            endpoint: "http://cgu.gov.br/ogu"
        };

        let catalogoOuvidoriasPromise = CatalogoOuvidorias.deployed();

        return assertOuvidoria(
            catalogoOuvidoriasPromise,
            ouvGeral
        );
    });

    describe("criado ambiente de testes", () => {
        const ouvDF = {
            conta: accounts[0],
            nome: "CGU-DF",
            tipoEnte: 1,
            nomeEnte: "Distrito Federal",
            endpoint: "http://cgu.gov.br/ouv-df"
        };
        const ouvBA = {
            conta: accounts[1],
            nome: "CGU-BA",
            tipoEnte: 1,
            nomeEnte: "Bahia",
            endpoint: "http://cgu.gov.br/ouv-ba"
        };
        const ouvAJU = {
            conta: accounts[2],
            nome: "Pref. Aracaju",
            tipoEnte: 2,
            nomeEnte: "Aracaju-SE",
            endpoint: "http://aracaju.se.gov.br/ouv"
        };
        const ouvCE = {
            conta: accounts[3],
            nome: "Ouvidoria Estatual do Ceara",
            tipoEnte: 2,
            nomeEnte: "Ceara",
            endpoint: "http://ouvidoria.ce.gov.br/"
        };

        let catalogoOuvidoriasPromise;

        beforeEach(() => {
            catalogoOuvidoriasPromise = CatalogoOuvidorias.new(ouvDF.nome, ouvDF.tipoEnte, ouvDF.nomeEnte, ouvDF.endpoint);
        });

        it("construtor cria catalogo com uma ouvidoria cadastrada inicialmente", () => {
            return assertOuvidoria(catalogoOuvidoriasPromise, ouvDF);
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
                        assertEventoOuvidoriaCadastrada(tx, ouvBA);

                        return catalogoOuvidorias.getNumeroDeOuvidorias();
                    }).then((numeroDeOuvidorias) => {
                        assert.equal(uint(numeroDeOuvidorias), 2);

                        return assertOuvidoria(Promise.resolve(catalogoOuvidorias), ouvBA)
                    });
                });
            });
        });

        it("quando ha somente duas ouvidorias cadastradas, uma candidata NAO consegue cadastrar-se tendo apenas uma autorizacao", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(ouvBA.conta, {from: ouvDF.conta}).then(() => {
                    return catalogoOuvidorias.cadastrar(ouvBA.nome, ouvBA.tipoEnte, ouvBA.nomeEnte, ouvBA.endpoint, {from: ouvBA.conta});
                }).then(() => {
                    return catalogoOuvidorias.autorizar(ouvAJU.conta, {from: ouvDF.conta});
                }).then(() => {
                    return catalogoOuvidorias.cadastrar(ouvAJU.nome, ouvAJU.tipoEnte, ouvAJU.nomeEnte, ouvAJU.endpoint, {from: ouvAJU.conta}).then(() => {
                        fail("como a ouvAJU nao recebeu duas autorizacoes, nao poderia se cadastrar")
                    }, (erro) => {
                        assertRequireFalhou(erro);
                    });
                });
            });
        });

        it("quando ha somente duas ouvidorias cadastradas, uma candidata consegue cadastrar-se tendo apenas duas autorizacoes", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(ouvBA.conta, {from: ouvDF.conta}).then(() => {
                    return catalogoOuvidorias.cadastrar(ouvBA.nome, ouvBA.tipoEnte, ouvBA.nomeEnte, ouvBA.endpoint, {from: ouvBA.conta});
                }).then(() => {
                    return catalogoOuvidorias.autorizar(ouvAJU.conta, {from: ouvDF.conta});
                }).then(() => {
                    return catalogoOuvidorias.autorizar(ouvAJU.conta, {from: ouvBA.conta});
                }).then(() => {
                    return catalogoOuvidorias.cadastrar(ouvAJU.nome, ouvAJU.tipoEnte, ouvAJU.nomeEnte, ouvAJU.endpoint, {from: ouvAJU.conta}).then((tx) => {
                        assertEventoOuvidoriaCadastrada(tx, ouvAJU);

                        return catalogoOuvidorias.getNumeroDeOuvidorias();
                    }).then((numeroDeOuvidorias) => {
                        assert.equal(uint(numeroDeOuvidorias), 3);

                        return assertOuvidoria(Promise.resolve(catalogoOuvidorias), ouvAJU)
                    });
                });
            });
        });

        it("quando ha tres ou mais ouvidorias cadastradas, uma candidata NAO consegue cadastrar-se tendo apenas uma autorizacao", () => {
            return catalogoOuvidoriasPromise.then((catalogoOuvidorias) => {
                return catalogoOuvidorias.autorizar(ouvBA.conta, {from: ouvDF.conta}).then(() => {
                    return catalogoOuvidorias.cadastrar(ouvBA.nome, ouvBA.tipoEnte, ouvBA.nomeEnte, ouvBA.endpoint, {from: ouvBA.conta});
                }).then(() => {
                    return catalogoOuvidorias.autorizar(ouvAJU.conta, {from: ouvDF.conta});
                }).then(() => {
                    return catalogoOuvidorias.autorizar(ouvAJU.conta, {from: ouvBA.conta});
                }).then(() => {
                    return catalogoOuvidorias.cadastrar(ouvAJU.nome, ouvAJU.tipoEnte, ouvAJU.nomeEnte, ouvAJU.endpoint, {from: ouvAJU.conta});
                }).then(() => {
                    return catalogoOuvidorias.autorizar(ouvCE.conta, {from: ouvDF.conta});
                }).then(() => {
                    return catalogoOuvidorias.cadastrar(ouvCE.nome, ouvCE.tipoEnte, ouvCE.nomeEnte, ouvCE.endpoint, {from: ouvCE.conta}).then(() => {
                        fail("como a ouvCE soh recebeu uma autorizacao, nao poderia se cadastrar (precisaria de 3)")
                    }, (erro) => {
                        assertRequireFalhou(erro);
                    });
                });
            });
        });

        xit("quando ha tres ou mais ouvidorias cadastradas, uma candidata NAO consegue cadastrar-se tendo apenas duas autorizacoes", () => { });
        xit("quando ha tres ou mais ouvidorias cadastradas, uma candidata consegue cadastrar-se tendo apenas tres autorizacoes", () => { });

    });

});
