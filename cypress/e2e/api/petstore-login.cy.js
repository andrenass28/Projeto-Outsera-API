describe('Petstore API login', () => {
  // Credenciais validas registradas no Petstore para este conjunto de testes.
  const validUser = {
    username: 'andrenass',
    password: '123456'
  };

  // NOTA: O Petstore e uma API demo que nao realiza validacao real de credenciais.
  // Qualquer combinacao de usuario/senha retorna 200. Os cenarios abaixo documentam
  // o comportamento observado e servem de referencia para quando a API for substituida
  // por um ambiente real que retorne 400 ou 401 nesses casos.
  context('Cenarios negativos', () => {
    it('aceita login com username inexistente (comportamento do ambiente demo)', () => {
      // Em uma API real esperaria 400 ou 401. O Petstore retorna 200 sem validar.
      cy.request({
        method: 'GET',
        url: '/user/login',
        qs: {
          username: 'usuario_que_nao_existe_xyz123',
          password: validUser.password
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.match(/^logged in user session:\d+$/);
      });
    });

    it('aceita login com senha incorreta (comportamento do ambiente demo)', () => {
      // Em uma API real esperaria 400 ou 401. O Petstore retorna 200 sem validar.
      cy.request({
        method: 'GET',
        url: '/user/login',
        qs: {
          username: validUser.username,
          password: 'senha_errada_999'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.match(/^logged in user session:\d+$/);
      });
    });

    it('aceita login com campos em branco (comportamento do ambiente demo)', () => {
      // Em uma API real esperaria 400. O Petstore retorna 200 sem validar campos obrigatorios.
      cy.request({
        method: 'GET',
        url: '/user/login',
        qs: {
          username: '',
          password: ''
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.match(/^logged in user session:\d+$/);
      });
    });
  });

  context('Cenario positivo', () => {
    it('realiza login com sucesso com credenciais validas', () => {
      // Garante que o usuario existe antes de tentar o login.
      cy.request({
        method: 'POST',
        url: '/user',
        body: {
          id: 0,
          username: validUser.username,
          firstName: 'Andre',
          lastName: 'Nass',
          email: 'andre@teste.com',
          password: validUser.password,
          phone: '47991999999',
          userStatus: 1
        },
        failOnStatusCode: false
      });

      // Envia as credenciais corretas e valida o retorno de sessao ativa.
      cy.request({
        method: 'GET',
        url: '/user/login',
        qs: {
          username: validUser.username,
          password: validUser.password
        }
      }).then((loginResponse) => {
        expect(loginResponse.status).to.eq(200);

        // A API retorna no campo message um token de sessao com timestamp.
        expect(loginResponse.body.message).to.match(/^logged in user session:\d+$/);

        // O header X-Rate-Limit indica o limite de requisicoes permitidas.
        expect(loginResponse.headers).to.have.property('x-rate-limit');

        // O header X-Expires-After indica quando a sessao expira.
        expect(loginResponse.headers).to.have.property('x-expires-after');
      });
    });
  });
});
