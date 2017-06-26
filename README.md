# Catálogo de Ouvidorias

Implementação do catálogo de ouvidorias utilizando smart contracts em Ethereum.


# Roteiro

```shell
# Dentro do container

# redeploya todos os contratos
truffle migrate --reset

# Executa os testes
truffle test

# Acessa o console
truffle console

# A partir de agora, dentro do console (note que deployed() retorna uma Promise)
truffle(development)> Contrato.deployed().then((x) => c = x);


```
