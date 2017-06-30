# Catálogo de Ouvidorias

Implementação do catálogo de ouvidorias utilizando _smart contracts_ em Ethereum.

O blockchain armazenará os dados -- 
[conta](catalogo-project/contracts/CatalogoOuvidorias.sol#L19) ([account Ethereum](https://github.com/ethereum/go-ethereum/wiki/Managing-your-accounts)),
[nome](catalogo-project/contracts/CatalogoOuvidorias.sol#L20),
[ente](catalogo-project/contracts/CatalogoOuvidorias.sol#L21) e 
[endpoint](catalogo-project/contracts/CatalogoOuvidorias.sol#L19) (URL do site ou web service) -- das ouvidorias, que deverão atender aos requisitos
impostos pelo smart contract [`CatalogoOuvidorias`](catalogo-project/contracts/CatalogoOuvidorias.sol), resumidos como segue:

- O contrato exige uma ouvidoria inicial para ser criado no blockchain.
- Uma segunda ouvidoria poderá ser incluída, se **previamente** autorizada pela ouvidoria _inicial_.
- Uma terceira ouvidoria poderá ser incluída, se previamente autorizada pelas _duas_ ouvidorias já cadastradas.
- Da quarta ouvidoria em diante, poderão ser incluídas indefinidas ouvidorias, desde que cada uma seja previamente
 autorizada por [**três quaisquer**](catalogo-project/contracts/CatalogoOuvidorias.sol#L9) ouvidorias já cadastradas.

Desta maneira, o mais importante do contrato são o construtor e dois métodos:
- Construtor [`function CatalogoOuvidorias(<dados da ouvidoria inicial>)`](catalogo-project/contracts/CatalogoOuvidorias.sol#L42) cria, com a ouvidoria inicial, o contrato para
 inserção no blockchain;
- Método [`function autorizar(<endereco da account da ouvidoria candidata>)`](catalogo-project/contracts/CatalogoOuvidorias.sol#L89) é chamado por uma ouvidoria cadastrada para manifestar
 sua autorização ao cadastro de uma ouvidoria candidata. Ao autorizar, o método [emite](catalogo-project/contracts/CatalogoOuvidorias.sol#L97) o 
 [**evento**](http://solidity.readthedocs.io/en/develop/contracts.html#events)
 [`ouvidoriaAutorizada()`](catalogo-project/contracts/CatalogoOuvidorias.sol#L38) com os dados das ouvidorias autorizadora e autorizada.
- Método [`function cadastrar(<dados da ouvidoria candidata>)`](catalogo-project/contracts/CatalogoOuvidorias.sol#L115) é chamado por uma ouvidoria candidata que já tenha acumulado
 o número de autorizações exigidas para entrar no cadastro de ouvidorias. Quando executado com sucesso, este método [emite](catalogo-project/contracts/CatalogoOuvidorias.sol#L119) o
  evento [`ouvidoriaCadastrada()`](catalogo-project/contracts/CatalogoOuvidorias.sol#L36) incluindo os dados da ouvidoria cadastrada.

# Requisitos do Ambiente de Execução

**Docker** + Docker Compose. Todo o resto é executado dentro de containers.

# Estrutura

- `/`
    - Pasta com arquivo `docker-compose.yml` que cria o ambiente de execução do projeto (que está na pasta `catalogo-project`/).
- `catalogo-project/`
    - Projeto principal, contendo código **JavaScript** e **Solidity** (utilizando o framework [Truffle](https://github.com/trufflesuite/truffle)).
- `dockerfiles/`
    - `Dockerfile`s para containers (`testrpc` e `truffle`) usados no ambiente de execução do projeto.
- `ethereum-testnets/`
    - `Dockerfile`s com clientes para acessar testnets ethereum (ex. [`rinkeby`](https://www.rinkeby.io/)) utilizando o cliente [`geth`](https://github.com/ethereum/go-ethereum/wiki/geth).
    - O contrato pode ser deployado numa testnet dessas para simular o que aconteceria na ethereum real.
- `samples/`
    - Fontes em geral de arquivos interessantes que podem ser usados como exemplos.


# Roteiros

O `docker-compose.yml` da raiz (isto eh, a pasta onde este `README.md` se encontra) sobe dois containers:
 
- um com o `testrpc`, uma testnet Ethereum local para desenvolvimento;
- outro com `truffle`, um framework para desenvolvimento de *smart contracts*. Este container abre direto no [truffle console](http://truffleframework.com/docs/getting_started/console).

## Subindo containers

Para subir os containers e se conectar ao truffle console, execute, na raiz deste projeto, os comandos abaixo:

```shell
# Subir compose com testrpc e truffle
docker-compose up -d

# Conectar-se ao container com truffle
# (Obs.: caso nenhum exista com esse nome, use `docker ps` para encontrar o correto. Além
# disso, o comando docker-compose up acima também imprime o nome do container criado.)
docker attach ouvidoriascatalogo_truffle_1
```

## Rodar testes (unitarios/integracao)

```shell
# Considerando que voce estah no console truffle do container iniciado no passo acima

# Executar testes
truffle(unbtest)> test
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
