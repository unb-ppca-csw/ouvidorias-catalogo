# Catálogo de Ouvidorias

Implementação do catálogo de ouvidorias utilizando smart contracts em Ethereum.

O blockchain armazenará dados das ouvidorias -- nome, ente e endpoint (URL) -- que deverão atender aos requisitos
impostos pelo smart contract [`CatalogoOuvidorias`](catalogo-project/contracts/CatalogoOuvidorias.sol), resumidos como segue:

- O contrato é criado no blockchain com uma ouvidoria inicial.
- Uma segunda ouvidoria poderá ser incluída, se **previamente** autorizada pela ouvidoria _inicial_.
- Uma terceira ouvidoria poderá ser incluída, se previamente autorizada pelas _duas_ ouvidorias já cadastradas.
- Da quarta ouvidoria em diante, poderão ser incluídas indefinidas ouvidorias, desde que cada uma seja previamente
 autorizada por [**três quaisquer**](catalogo-project/contracts/CatalogoOuvidorias.sol#L9) ouvidorias já cadastradas.

Desta maneira, o mais importante do contrato são o construtor e dois métodos:
- Construtor [`function CatalogoOuvidorias(<dados da ouvidoria inicial>)`](catalogo-project/contracts/CatalogoOuvidorias.sol#L42) cria, com a ouvidoria inicial, o contrato para
 inserção no blockchain;
- Método [`function autorizar(<endereco da account da ouvidoria candidata>)`](catalogo-project/contracts/CatalogoOuvidorias.sol#L89) é chamado por uma ouvidoria cadastrada para manifestar
 sua autorização ao cadastro de uma ouvidoria candidata.
- Método [`function cadastrar(<dados da ouvidoria candidata>)`](catalogo-project/contracts/CatalogoOuvidorias.sol#L115) é chamado por uma ouvidoria candidata que já tenha acumulado
 o número de autorizações exigidas para entrar no cadastro de ouvidorias.

# Requisitos do Ambiente de Execução

**Docker** + Docker Compose. Todo o resto é executado dentro de containers.

# Estrutura

- `/`
    - Pasta com arquivo `docker-compose.yml` que cria o ambiente de execução do projeto (em `catalogo-project`).
- `catalogo-project/`
    - Projeto principal, contendo código **JavaScript** e **Solidity** (utilizando o framework [Truffle](https://github.com/trufflesuite/truffle)).
- `dockerfiles/`
    - `Dockerfile`s base para containers (`testrpc` e `truffle`) usados no ambiente de execução do projet.
- `ethereum-testnets/`
    - `Dockerfile`s com clientes para acessar testnets ethereum (ex. [`rinkeby`](https://www.rinkeby.io/)) utilizando o cliente [`geth`](https://github.com/ethereum/go-ethereum/wiki/geth).
    - O contrato pode ser deployado numa testnet dessas para simular o que aconteceria na ethereum real.
- `samples/`
    - Fontes em geral de arquivos interessantes que podem ser usados como exemplos.


# Roteiros

O `docker-compose.yml` da raiz (isto eh, a pasta onde este `README.md` se encontra) sobe dois containers:
 
- um com o `testrpc`, uma testnet Ethereum local para desenvolvimento;
- outro com `truffle`, um framework para desenvolvimento de smart contracts. Este container abre direto no truffle console.

## Subindo containers

Para subir os containers e se conectar ao truffle console, execute, na raiz deste projeto, os comandos abaixo:

```shell
# Subir compose com testrpc e truffle
docker-compose up -d

# Conectar-se ao container com truffle (caso nenhum exista com esse nome, use `docker ps` para encontrar o correto)
docker attach ouvidoriascatalogo_truffle_1
```

## Rodar testes (unitarios/integracao)

```shell
# Considerando que voce estah no console truffle do container iniciado no passo acima

# Executar testes
truffle(unbtest)> truffle test
```

## Rodar demonstracao

O [script de demonstração](catalogo-project/src/demonstracao.js) é só o que o nome diz, demonstração. O [script de testes](catalogo-project/test/CatalogoOuvidorias.test.js) contém um uso muito mais avançado
 de todos os métodos do _smart contract_, explorando todas suas possibilidades.

```shell
# Considerando que voce estah no console truffle do container iniciado no passo acima

# Faz o deploy dos contratos, caso nao tenha feito antes, ou refaz, caso jah tenha.
truffle(unbtest)> migrate --reset
...

# Executa script com varias demonstracoes
truffle(unbtest)> exec src/demonstracao.js
```


# Outros

As mensagens de commit deste repo buscam seguir [estas](http://karma-runner.github.io/1.0/dev/git-commit-msg.html) convencoes.
