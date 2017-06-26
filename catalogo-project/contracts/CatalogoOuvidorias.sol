pragma solidity ^0.4.11;


/// @title Catalogo de Ouvidorias para o Barramento de Ouvidorias
contract CatalogoOuvidorias {

    enum TipoEnte { Uniao, Estado, Municipio }

    struct Ente {
        TipoEnte tipo;
        bytes32 nome;   // nome do ente, caso se aplique (Uniao nao eh necessario). Ex.: 'Bahia', 'Salvador-BA'
    }

    struct Ouvidoria {
        address conta; // account Ethereum desta ouvidoria
        bytes32 nome;   // nome do orgao
        Ente ente; // ente a qual a ouvidoria pertence
        bytes32 endpoint;   // URL da aplicacao/web service desta ouvidoria
    }

    Ouvidoria[] private ouvidorias;

    /// Cria o catalogo com uma ouvidoria -- nao exigi tres porque seriam tantas variaveis que o solarity nao permite:
    /// Compiler error (...): Stack too deep, try removing local variables.
    function CatalogoOuvidorias(bytes32 nome, uint8 tipoEnte, bytes32 nomeEnte, bytes32 endpoint) {
        ouvidorias.push(Ouvidoria({
            conta: msg.sender,
            nome: nome,
            ente: Ente({tipo: toTipoEnte(tipoEnte), nome: nomeEnte}),
            endpoint: endpoint
        }));
    }

    function toTipoEnte(uint8 tipo) returns (TipoEnte) {
        if (tipo == 0) return TipoEnte.Uniao;
        if (tipo == 1) return TipoEnte.Estado;
        if (tipo == 2) return TipoEnte.Municipio;
        throw;
    }

}
