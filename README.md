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
