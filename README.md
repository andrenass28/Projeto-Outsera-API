# Projeto Outsera API - Cypress

Suite de testes de API com Cypress usando o Swagger Petstore como ambiente alvo.

## Requisitos

- Node.js 18+
- npm 9+

## Instalacao

1. Instale dependencias:

```bash
npm install
```

## Configuracao

Os testes usam a variavel `API_URL`.

Exemplo para Petstore:

```bash
API_URL=https://petstore.swagger.io/v2
```

No projeto, os scripts ja incluem esse valor para os testes do Petstore.

## Como rodar

### Rodar todos os testes de API

```bash
npm run cy:run:api -- --env API_URL=https://petstore.swagger.io/v2
```

### Rodar por arquivo

```bash
npm run cy:run:petstore-create-user
npm run cy:run:petstore-login
npm run cy:run:petstore-add-pet
npm run cy:run:petstore-update-pet
npm run cy:run:petstore-get-pet
```

### Abrir interface do Cypress

```bash
npm run cy:open
```

## Estrutura

- `cypress/e2e/api/petstore-create-user.cy.js`: cria usuario e valida persistencia
- `cypress/e2e/api/petstore-login.cy.js`: cenarios de login (negativos e positivo)
- `cypress/e2e/api/petstore-add-pet.cy.js`: adiciona pet e valida retorno
- `cypress/e2e/api/petstore-update-pet.cy.js`: adiciona, atualiza e valida estado atualizado
- `cypress/e2e/api/petstore-get-pet.cy.js`: busca pet por id (valido e invalido)
- `cypress/fixtures/petstore-user.json`: massa de dados para usuario
- `cypress/fixtures/petstore-pet.json`: massa de dados para pet

## Resultado atual da suite

Execucao mais recente da suite completa:

- Specs: 5
- Testes: 9
- Passando: 9
- Falhando: 0

## Observacoes importantes

- O ambiente publico do Petstore pode ter latencia de persistencia. Alguns specs usam retry para leitura apos escrita.
- O endpoint de login do Petstore demo nao valida credenciais como uma API real. Por isso, os cenarios negativos documentam o comportamento observado no ambiente demo.
- Os testes fazem limpeza de massa (DELETE) para permitir reexecucao sem conflito.
