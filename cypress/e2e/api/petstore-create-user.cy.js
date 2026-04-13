describe('Petstore API create user', () => {
  // Payload fixo usado para criar o usuario no ambiente de teste.
  const user = {
    id: 0,
    username: 'andrenass',
    firstName: 'Andre',
    lastName: 'Nass',
    email: 'andre@teste.com',
    password: '123456',
    phone: '47991999999',
    userStatus: 1
  };

  // Tenta buscar o usuario algumas vezes porque o Petstore pode demorar a refletir o cadastro.
  const getUserWithRetry = (attemptsLeft = 5) => {
    return cy
      .request({
        method: 'GET',
        url: `/user/${user.username}`,
        failOnStatusCode: false
      })
      .then((response) => {
        if (response.status === 200 || attemptsLeft === 1) {
          return response;
        }

        cy.wait(1000);
        return getUserWithRetry(attemptsLeft - 1);
      });
  };

  it('cria um usuario com sucesso', () => {
    // Remove o usuario antes do teste para permitir reexecucao sem conflito.
    cy.request({
      method: 'DELETE',
      url: `/user/${user.username}`,
      failOnStatusCode: false
    });

    // Envia o cadastro do usuario e valida se a API respondeu com sucesso.
    cy.request('POST', '/user', user).then((createResponse) => {
      expect(createResponse.status).to.eq(200);
      expect(createResponse.body.code).to.eq(200);
      expect(createResponse.body.type).to.eq('unknown');
      expect(createResponse.body.message).to.be.a('string').and.not.be.empty;
    });

    // Busca o usuario criado com retry para contornar a latencia do ambiente publico.
    getUserWithRetry().then((userResponse) => {
      expect(userResponse.status).to.eq(200);
      expect(userResponse.body.id).to.exist;
      expect(userResponse.body.username).to.eq(user.username);
      expect(userResponse.body.firstName).to.eq(user.firstName);
      expect(userResponse.body.lastName).to.eq(user.lastName);
      expect(userResponse.body.email).to.eq(user.email);
      expect(userResponse.body.password).to.eq(user.password);
      expect(userResponse.body.phone).to.eq(user.phone);
      expect(userResponse.body.userStatus).to.eq(user.userStatus);
    });

    // Exclui o usuario ao final para nao deixar massa residual no Petstore.
    cy.request({
      method: 'DELETE',
      url: `/user/${user.username}`,
      failOnStatusCode: false
    }).then((deleteResponse) => {
      expect([200, 404]).to.include(deleteResponse.status);
    });
  });
});