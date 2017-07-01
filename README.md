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

Para testar o funcionamento do contrato, existem dois roteiros possíveis:
- rodar os testes automatizados (e comandos quaisquer) numa testnet local (em memória);
- explorar o contrato deployado na testnet "real" [rinkeby](https://www.rinkeby.io/), através das ferramentas
 que ela disponibiliza.
 
Siga abaixo os passos para executar qualquer um desses dois roteiros.

## Roteiro testnet local e testes automatizados

O `docker-compose.yml` da raiz (isto eh, a pasta onde este `README.md` se encontra) sobe dois containers:
 
- um com o `testrpc`, uma testnet Ethereum local para desenvolvimento;
- outro com `truffle`, um framework para desenvolvimento de *smart contracts*. Este container abre direto no [truffle console](http://truffleframework.com/docs/getting_started/console).

Para subi-los e se conectar ao truffle console, execute, na raiz deste projeto, os comandos abaixo:

```shell
# Subir compose com testrpc e truffle
$ docker-compose up --build -d

# Conectar-se ao container com truffle
# (Obs.: caso nenhum exista com esse nome, use `docker ps` para encontrar o correto. Além
# disso, o comando docker-compose up acima também imprime o nome do container criado.)
$ docker attach ouvidoriascatalogo_truffle_1
```

Neste momento você estará no truffle console (que está contectado à testnet/testrpc local chamada `unbtest`) e deve ver isto:

>     truffle(unbtest)> 


#### Rodar testes automatizados

```shell
# Considerando que voce estah no console truffle do container iniciado no passo acima

# Executar testes
truffle(unbtest)> test
```

O resultado será algo como:

> ```
> Using network 'unbtest'.
> 
> Compiling ./contracts/CatalogoOuvidorias.sol...
> 0xad109c84c8f5d759beab921fc58e2493609959a2
> 
> 
>   Contract: CatalogoOuvidorias
>     ✓ script de deploy padrao constroi corretamente o contrato inicial (642ms)
>     criado em ambiente de testes
>       ✓ construtor cria catalogo com uma ouvidoria cadastrada inicialmente (862ms)
>       ✓ ouvidoria jah cadastrada pode chamar autorizar (90ms)
>       ✓ ouvidoria nao cadastrada NAO pode chamar autorizar (58ms)
>       ✓ ouvidoria jah cadastrada nao pode autorizar uma outra ouvidoria mais de uma vez (153ms)
>       ✓ ouvidoria jah cadastrada NAO pode autorizar uma outra ouvidoria jah cadastrada (308ms)
>       ✓ candidata sem autorizacoes nao consegue cadastrar-se (56ms)
>       ✓ quando ha somente uma ouvidoria cadastrada, uma candidata consegue cadastrar-se tendo apenas uma autorizacao (810ms)
>       ✓ quando ha somente duas ouvidorias cadastradas, uma candidata NAO consegue cadastrar-se tendo apenas uma autorizacao (380ms)
>       ✓ quando ha somente duas ouvidorias cadastradas, uma candidata consegue cadastrar-se tendo apenas duas autorizacoes (1212ms)
>       ✓ quando ha tres ou mais ouvidorias cadastradas, uma candidata NAO consegue cadastrar-se tendo apenas uma autorizacao (665ms)
>       ✓ quando ha tres ou mais ouvidorias cadastradas, uma candidata NAO consegue cadastrar-se tendo apenas duas autorizacoes (817ms)
>       ✓ quando ha tres ou mais ouvidorias cadastradas, uma candidata consegue cadastrar-se tendo apenas tres autorizacoes (1678ms)
> ```

#### Rodar script de demonstração

O [script de demonstração](catalogo-project/src/demonstracao.js) é só o que o nome diz, demonstração. O [script de testes](catalogo-project/test/CatalogoOuvidorias.test.js) contém um uso muito mais avançado
 de todos os métodos do _smart contract_, explorando todas suas possibilidades. Ainda assim, o script de demonstração é um bom
 passo (exemplo) inicial caso deseje executar um código que exercite o contrato de outras maneiras quaisquer.

```shell
# Considerando que voce estah no console truffle do container iniciado no passo acima

# Faz o deploy dos contratos, caso nao tenha feito antes, ou refaz, caso jah tenha.
truffle(unbtest)> migrate --reset
...

# Executa script com varias demonstracoes
truffle(unbtest)> exec src/demonstracao.js
```

O resultado deste comando, naturalmente, variará de acordo com o conteúdo que você deixou/editou no [`src/demonstracao.js`](catalogo-project/src/demonstracao.js).

## Roteiro testnet rinkeby

A testnet [rinkeby](https://www.rinkeby.io/) é uma rede ethereum em todos os sentidos (a única diferença é que ela tem faucets que te dão $$ grátis), e assim apresentamos duas possibilidades de interação com o contrato que deployamos na rinkeby:

- acessar os sites da rinkeby e apenas ver os dados (blocos, metadados) do contrato; ou
- utilizar a uma IDE in-browser de solidity, conectar-se a um nó rinkeby e chamar métodos do contrato. 

Abaixo, detalhes dessas alternativas.

### Acessar os sites

- Account usada para criar o contrato na rinkeby:
    - [`0x1750dd0f8cd22ee9d849ab11ebc62adb37ffc10a`](https://rinkeby.etherscan.io/address/0x1750dd0f8cd22ee9d849ab11ebc62adb37ffc10a)
    - Caso queira utilizá-la em algum site/ferramenta:
        - Arquivo UTC (private key): [`UTC--...7ffc10a`](ethereum-testnets/rinkeby/keystore/UTC--2017-06-28T04-09-45.884509900Z--1750dd0f8cd22ee9d849ab11ebc62adb37ffc10a)
        - Senha: `unb`
- Transação que criou o contrato:
    - [`0xa5da280ff47cf13945ef440ae81773017ff10379911ad1f49101dbbb3aa6aa4d`](https://rinkeby.etherscan.io/tx/0xa5da280ff47cf13945ef440ae81773017ff10379911ad1f49101dbbb3aa6aa4d)
    - Argumentos usados (construtor) durante a criação: `"CGU-OGU", 0, "Uniao", "http://cgu.gov.br/ogu"`
- Endereço do contrato criado:
    - [`0xff5a6388151086d0186c741c3af426b7cc846c52`](https://rinkeby.etherscan.io/address/0xff5a6388151086d0186c741c3af426b7cc846c52)



### Interagir com o contrato via Ethereum Remix (IDE in-browser)

Ethereum Remix é uma IDE in-browser. Ela permite que você **execute métodos de contratos**, dentre outras coisas. Para utilizá-la, você precisa conectar-se a um nó rinkeby.
 Você pode subir seu próprio nó ou usar um da internet.
 
#### Utilizar um nó da internet

Usar um nó da internet é mais simples, mas (via remix IDE) somente permite executar métodos de leitura do contrato.

- Comece acessando a URL abaixo:
    - https://remix.ethereum.org/#gist=d414cee109931d333e39fd5b5a8d4aa9&version=soljson-v0.4.11+commit.68ef5810.js
    - Ela abre a IDE tendo como arquivo o contrato [`CatalogoOuvidorias`](catalogo-project/contracts/CatalogoOuvidorias.sol) (que foi copiado em um [gist](https://gist.github.com/acdcjunior/d414cee109931d333e39fd5b5a8d4aa9), por ser a única maneira de abrir a IDE com um arquivo pré-carregado).
- Aba `Contract` -> Na combo `Environment`, selecione `Web3 Provider` -> Na modal digite `https://rinkeby.infura.io/` e aguarde.
- Após o carregamento, note que nenhuma das accounts (combo `Account`) disponíveis é nossa, mas você conseguirá fazer consultas sem problema.
- Acesse versão já deployada do contrato:
    - Clique no botão `Address` (verde) e digite na modal o endereço do contrato já deployado: `0xff5a6388151086d0186c741c3af426b7cc846c52`.
- Assim que aberto o contrato, aparecerão botões com os métodos.
- Para executar, basta preencher os argumentos e apertar o botão do nome do método.
    - Lembre-se de utilizar aspas duplas em argumentos do tipo `address`: `"0x1750dd0f8cd22ee9d849ab11ebc62adb37ffc10a"`
    - Experimente chamar alguns métodos passando como argumento o endereço da account da ouvidoria inicial (a usada para criar o contrato): `"0x1750dd0f8cd22ee9d849ab11ebc62adb37ffc10a"`

Importante: como a Solidity e a EVM são pé duro, quando você executar métodos que por alguma lógica falham (ex.: você querer autorizar alguém a partir de uma account sem privilégio suficiente),
a mensagem de erro que aparece é normalmente bem estranha, parecendo ser um erro interno ao invés de um comportamento normal. Só pra você saber :)

#### Subir um nó ethereum e minerar na rinkeby

Usar um nó local é mais complexo, mas permite que você escolha qual account vai usar e, por consequência, conseguirá, mais facilmente, não só realizar leitura, mas também escrita no contrato.

Utilize esta opção quando quiser realizar transações a partir da account `0x1750dd0f8cd22ee9d849ab11ebc62adb37ffc10a` ou de outras accounts que você criar.
 
O principal ponto negativo é que você precisará esperar o nó sincronizar todo o blockchain rinkeby.

- Suba o nó:
    - Ir na pasta [`ethereum-testnets/rinkeby`](ethereum-testnets/rinkeby)
    - Digitar: `docker-compose up --build`
    - Isso vai subir um nó que se conectará à rinkeby. Você precisa aguardar ele baixar todo o blockchain para poder interagir com a rede.
        - Não se preocupe com as linhas `WARN [XX-XX|XX:XX:XX] Block sealing failed     err=unauthorized`, elas não têm impacto no escopo em que estamos.

- Acesse a IDE
    - Comece acessando a URL abaixo:
        - (note o HTTP, não HTTPS) http://remix.ethereum.org/#gist=d414cee109931d333e39fd5b5a8d4aa9&version=soljson-v0.4.11+commit.68ef5810.js
        - Ela abre a IDE tendo como arquivo o contrato [`CatalogoOuvidorias`](catalogo-project/contracts/CatalogoOuvidorias.sol) (que foi copiado em um [gist](https://gist.github.com/acdcjunior/d414cee109931d333e39fd5b5a8d4aa9), por ser a única maneira de abrir a IDE com um arquivo pré-carregado).
    - Aba `Contract` -> Na combo `Environment`, selecione `Web3 Provider` -> Na modal digite `http://localhost:8546` (note o **SEIS** ao final)
        - Se o erro `Invalid JSON RPC response: ""` acontecer, certifique-se de que você está via HTTP e não HTTPS.
    - Agora, você pode ou deployar o contrato, ou acessar uma versão já deployada dele.
        - Deployar:
            - Quando fizemos o [deploy pela primeira vez](https://rinkeby.etherscan.io/address/0xff5a6388151086d0186c741c3af426b7cc846c52), digitamos `"CGU-OGU", 0, "Uniao", "http://cgu.gov.br/ogu"` no campo de texto próximo ao botão `Create` (vermelho) e cliquei no botão.
        - Acessar a versão já deployada do contrato:
            - Clique no botão `Address` (verde) e digite na modal o endereço do contrato já deployado: `0xff5a6388151086d0186c741c3af426b7cc846c52`.
    - Assim que aberto o contrato, aparecerão botões com os métodos.
    - Para executar, basta preencher os argumentos e apertar o botão do nome do método.
        - Lembre-se de utilizar aspas duplas em argumentos do tipo `address`: `"0x1750dd0f8cd22ee9d849ab11ebc62adb37ffc10a"`
        - Experimente chamar alguns métodos passando como argumento o endereço da account da ouvidoria inicial (a usada para criar o contrato): `"0x1750dd0f8cd22ee9d849ab11ebc62adb37ffc10a"`


# Outros

As mensagens de commit deste repo buscam seguir [estas](http://karma-runner.github.io/1.0/dev/git-commit-msg.html) convencoes.
