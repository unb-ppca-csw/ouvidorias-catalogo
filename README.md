# Catálogo de Ouvidorias

Implementação do catálogo de ouvidorias utilizando smart contracts em Ethereum.

O blockchain armazenará dados das ouvidorias -- nome, ente e endpoint (URL) -- que deverão atender aos requisitos
impostos pelo smart contract [`CatalogoOuvidorias`](catalogo-project/contracts/CatalogoOuvidorias.sol), resumidos como segue:

- O contrato é criado no blockchain com uma ouvidoria inicial.
- A segunda ouvidoria pode ser incluída, se **previamente** autorizada pela ouvidoria inicial.
- A terceira ouvidoria pode ser incluída, se _previamente_ autorizada pelas duas ouvidorias já cadastradas.
- A quarta ouvidoria em diante poderá ser incluída, se previamente autorizada por três **quaisquer** ouvidorias já cadastradas.

Desta maneira, o mais importante do contrato são o construtor e dois métodos:
- Construtor `function CatalogoOuvidorias(<dados da ouvidoria inicial>)` cria, com a ouvidoria inicial, o contrato para inserção no blockchain;
- Método `function autorizar(<endereco da ouvidoria candidata>)` é chamado por uma ouvidoria cadastrada para autorizar uma ouvidoria candidata.
- Método `function cadastrar(<dados da ouvidoria candidata>)` é chamado pela ouvidoria candidata (que já acumulou
 o número de autorizações exigidas) para entrar no cadastro de ouvidorias.

# Requisitos do Ambiente de Execução

**Docker + Docker Compose**. Todo o resto é executado dentro de containers.

# Estrutura

- `catalogo-project/`
    - Projeto principal, contendo código JavaScript e Solidity (utilizando o framework [Truffle](https://github.com/trufflesuite/truffle)).
- `docker-ethereum/`
    - Docker compose que acessa a `testnet` utilizando o cliente [`geth`](https://github.com/ethereum/go-ethereum/wiki/geth).
- `testrpc-truffle/`
    - Simples `Dockerfile` que gera uma imagem com o `testrpc` e o `truffle` instalados.
- `samples/`
    - Fontes em geral de projetos interessantes que podem ser usados como exemplos.
- `/`
    - Docker compose que executa o projeto (em `catalogo-project`) na imagem `testrpc-truffle`

# Roteiros

Os comandos abaixo devem ser executados dentro do container de `testrpc-truffle`. Para subir o container, execute,
na raiz deste projeto (isto eh, a mesma pasta onde este `README.md` se encontra):

```shell
# subir compose
docker-compose up -d
# para localizar o container que acabou de subir 
docker ps
# acesse o bash do container (nele você poderah executar os demais comandos)
# no exemplo abaixo, o nome do container encontrado no comando anterior foi ouvidoriascatalogo_node1_1
docker exec -it ouvidoriascatalogo_node1_1 bash
```

## Rodar testes (unitarios/integracao)

```shell
# Mata testrpc anterior, se existir, e sobe um testrpc novo
pkill node && testrpc &

# redeploya todos os contratos
truffle migrate --reset --network unbtest

# Executa os testes
truffle test --network unbtest
```

## Rodar demonstracao

```shell
# Mata testrpc anterior
pkill node && testrpc &

# redeploya todos os contratos
truffle migrate --reset --network unbtest

# Acessa o console
truffle console --network unbtest

# A partir de agora, dentro do console

# Refaz o deploy dos contratos (caso nao tenha feito antes)
truffle(unbtest)> migrate --reset
...

# Executa script com varias demonstracoes
truffle(unbtest)> exec src/demonstracao.js
```


# Outros

As mensagens de commit deste repo buscam seguir [estas](http://karma-runner.github.io/1.0/dev/git-commit-msg.html) convencoes.
