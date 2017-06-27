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

    address[] enderecosOuvidorias;

    mapping(address => Ouvidoria) private ouvidorias;

    mapping(address => uint8) public candidatas;

    event ouvidoriasAtualizadas(address conta, bytes32 nome, uint8 tipoEnte, bytes32 nomeEnte, bytes32 endpoint);

    /// Cria o catalogo com uma ouvidoria -- nao exigi tres porque seriam tantas variaveis que o solarity nao permite:
    /// Compiler error (...): Stack too deep, try removing local variables.
    function CatalogoOuvidorias(bytes32 nome, uint8 tipoEnte, bytes32 nomeEnte, bytes32 endpoint) {
        ouvidorias[msg.sender] = Ouvidoria({
            conta: msg.sender,
            nome: nome,
            ente: Ente({tipo: toTipoEnte(tipoEnte), nome: nomeEnte}),
            endpoint: endpoint
        });
        enderecosOuvidorias.push(msg.sender);
    }

    function toTipoEnte(uint8 tipo) returns (TipoEnte) {
        if (tipo == 0) return TipoEnte.Uniao;
        if (tipo == 1) return TipoEnte.Estado;
        if (tipo == 2) return TipoEnte.Municipio;
        throw;
    }

    function getNumeroDeOuvidorias() constant returns (uint) {
        return enderecosOuvidorias.length;
    }

    function getEnderecoOuvidoria(uint i) constant returns (address) {
        return enderecosOuvidorias[i];
    }

    function getOuvidoriaNome(address ouvidoria) constant returns (string) {
        return toString(ouvidorias[ouvidoria].nome);
    }

    function getOuvidoriaEndpoint(address ouvidoria) constant returns (string) {
        return toString(ouvidorias[ouvidoria].endpoint);
    }

    function getOuvidoriaEnteTipo(address ouvidoria) constant returns (uint) {
        return uint(ouvidorias[ouvidoria].ente.tipo);
    }

    function getOuvidoriaEnteNome(address ouvidoria) constant returns (string) {
        return toString(ouvidorias[ouvidoria].ente.nome);
    }

    // Uma ouvidoria cadastrada pode votar em outra
    function votar(address ouvidoriaCandidata) {
        log1('votando', '2');
    }

    // converte bytes32 em string
    function toString(bytes32 x) private constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

}
