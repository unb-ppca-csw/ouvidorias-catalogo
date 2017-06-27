# Catálogo de Ouvidorias

Implementação do catálogo de ouvidorias utilizando smart contracts em Ethereum.

# IMPORTANTE:
 
Como o projeto ainda está em **desenvolvimento** toda esta documentação é **temporária** (e, em muitas
partes, pode estar desatualizada). Assim que a estrutura geral estabilizar, será gerada uma sequência
de comandos exata para reproduzir/executar o projeto.

# Requisitos

**Docker + Docker Compose**. Todo o resto é executado dentro de containers.

# Estrutura

- `catalogo-project/`
    - Projeto principal, utilizando truffle/solidity/js
- `docker-ethereum/`
    - Docker compose que acessa a `testnet` utilizando o cliente `geth`
- `testrpc-truffle/`
    - Simples `Dockerfile` contendo o `testrpc` e o `truffle` instalados
- `/`
    - Docker compose que executa o projeto (em `catalogo-project`) na imagem `testrpc-truffle`

# Roteiro

```shell
# Dentro do container

# Mata testrpc anterior
pkill node && testrpc &

# redeploya todos os contratos
truffle migrate --reset --network unbtest

# Executa os testes
truffle test

# Acessa o console
truffle console --network unbtest

# A partir de agora, dentro do console

# Refaz o deploy dos contratos (caso nao tenha feito antes)
truffle(unbtest)> migrate --reset
...

# Executa script com varias demonstracoes
truffle(unbtest)> exec demonstracao.js



```
