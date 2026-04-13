# Relatório de Testes - Projeto Outsera API

**Data de execução:** 13/04/2026  
**Comando utilizado:** `npm run cy:run:api -- --env API_URL=https://petstore.swagger.io/v2`  
**Versão do Cypress:** 15.13.1  
**Browser:** Electron 138 (headless)

---

## Resumo Executivo

| Métrica            | Resultado |
|--------------------|-----------|
| Total de specs     | 5         |
| Total de testes    | 9         |
| Aprovados          | 9         |
| Reprovados         | 0         |
| Duração total      | ~17s      |

---

## Cobertura por Tipo de Cenário

| Tipo      | Quantidade | Aprovados | Reprovados |
|-----------|------------|-----------|------------|
| Positivo  | 5          | 5         | 0          |
| Negativo  | 4          | 4         | 0          |

---

## Resultados por Arquivo

### 1. petstore-add-pet.cy.js
**Status:** Aprovado | **Tempo:** ~3s

| Tipo     | Cenário                              | Status    |
|----------|--------------------------------------|-----------|
| Positivo | Adiciona um pet com sucesso          | Aprovado  |

**Validações realizadas:**
- `POST /pet` retorna status 200
- Body da resposta contém `id`, `name`, `status`, `category.name`, `photoUrls` e`tags`
- `GET /pet/{id}` confirma a persistência dos dados
- `DELETE /pet/{id}` remove a massa de teste ao final

---

### 2. petstore-create-user.cy.js
**Status:** Aprovado | **Tempo:** ~0.8s

| Tipo     | Cenário                              | Status    |
|----------|--------------------------------------|-----------|
| Positivo | Cria um usuário com sucesso          | Aprovado  |

**Validações realizadas:**
- `POST /user` retorna status 200 com code e message
- `GET /user/{username}` confirma `username`, `firstName`, `lastName`, `email`, `phone`, `userStatus`
- `DELETE /user/{username}` remove a massa de teste ao final

---

### 3. petstore-get-pet.cy.js
**Status:** Aprovado | **Tempo:** ~2s

| Tipo     | Cenário                                        | Status   |
|----------|------------------------------------------------|----------|
| Positivo | Busca um pet criado com sucesso                | Aprovado |
| Negativo | Retorna erro ao buscar pet com id inválido     | Aprovado |

**Validações realizadas:**
- `GET /pet/{id}` válido retorna 200 com `id`, `name`, `status` e `category.name` corretos
- `GET /pet/id-invalido-xyz` retorna 400 ou 404 com campo `message` presente no body

---

### 4. petstore-login.cy.js
**Status:** Aprovado | **Tempo:** ~1s

| Tipo     | Cenário                                              | Status   |
|----------|------------------------------------------------------|----------|
| Negativo | Login com username inexistente                       | Aprovado |
| Negativo | Login com senha incorreta                            | Aprovado |
| Negativo | Login com campos em branco                           | Aprovado |
| Positivo | Login com credenciais válidas                        | Aprovado |

**Validações realizadas:**
- Cenários negativos: `GET /user/login` retorna 200 com mensagem de sessão (comportamento do demo)
- Cenário positivo: `GET /user/login` retorna 200, body contém token `logged in user session:{timestamp}`, headers `X-Rate-Limit` e `X-Expires-After` presentes

> **Observação:** O Petstore é uma API demo pública que não valida autenticação de forma real. Qualquer combinação de credenciais retorna 200. Os cenários negativos documentam esse comportamento observado. Em uma API real esses cenários deveriam retornar 400 ou 401.

---

### 5. petstore-update-pet.cy.js
**Status:** Aprovado | **Tempo:** ~9s

| Tipo     | Cenário                                            | Status   |
|----------|----------------------------------------------------|----------|
| Positivo | Adiciona, edita e deleta um pet com sucesso        | Aprovado |

**Validações realizadas:**
- `POST /pet` cria o pet com dados originais da fixture
- `PUT /pet` atualiza `name` para `Dog Updated` e `status` para `sold`, retorna 200 com dados atualizados
- `GET /pet/{id}` com retry (até 7 tentativas) confirma que os novos dados foram persistidos
- `DELETE /pet/{id}` remove a massa de teste ao final

---

## Matriz Completa de Cenários

| # | Arquivo                      | Tipo     | Cenário                                             | Status   |
|---|------------------------------|----------|-----------------------------------------------------|----------|
| 1 | petstore-add-pet             | Positivo | Adiciona um pet com sucesso                         | Aprovado |
| 2 | petstore-create-user         | Positivo | Cria um usuário com sucesso                         | Aprovado |
| 3 | petstore-get-pet             | Positivo | Busca um pet criado com sucesso                     | Aprovado |
| 4 | petstore-get-pet             | Negativo | Busca pet com id inválido                           | Aprovado |
| 5 | petstore-login               | Negativo | Login com username inexistente                      | Aprovado |
| 6 | petstore-login               | Negativo | Login com senha incorreta                           | Aprovado |
| 7 | petstore-login               | Negativo | Login com campos em branco                          | Aprovado |
| 8 | petstore-login               | Positivo | Login com credenciais válidas                       | Aprovado |
| 9 | petstore-update-pet          | Positivo | Adiciona, edita e deleta um pet com sucesso         | Aprovado |

---

## Conclusão

A suíte está estável e 100% verde no ambiente atual do Petstore demo. O único ponto de atenção funcional é o endpoint de login, que não representa validação real de credenciais no ambiente público — os testes estão documentados para facilitar a migração quando a API for substituída por um ambiente real.
