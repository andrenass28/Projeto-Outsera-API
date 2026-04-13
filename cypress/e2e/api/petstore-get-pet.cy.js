describe('Petstore API get pet', () => {
  // Tenta buscar o pet algumas vezes para contornar a latencia do ambiente publico.
  const getPetWithRetry = (petId, attemptsLeft = 5) => {
    return cy
      .request({
        method: 'GET',
        url: `/pet/${petId}`,
        failOnStatusCode: false
      })
      .then((response) => {
        if (response.status === 200 || attemptsLeft === 1) {
          return response;
        }

        cy.wait(1000);
        return getPetWithRetry(petId, attemptsLeft - 1);
      });
  };

  it('busca um pet criado com sucesso', () => {
    // Carrega os dados do pet a partir da fixture para manter o payload desacoplado do spec.
    cy.fixture('petstore-pet').then((pet) => {
      // Remove o pet antes do teste para permitir reexecucao sem conflito.
      cy.request({
        method: 'DELETE',
        url: `/pet/${pet.id}`,
        failOnStatusCode: false
      });

      // Cria o pet que sera buscado no endpoint GET /pet/{petId}.
      cy.request('POST', '/pet', pet).then((createResponse) => {
        expect(createResponse.status).to.eq(200);
        expect(createResponse.body.id).to.eq(pet.id);
      });

      // Busca o pet criado e valida os campos principais retornados pela API.
      getPetWithRetry(pet.id).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.id).to.eq(pet.id);
        expect(getResponse.body.name).to.eq(pet.name);
        expect(getResponse.body.status).to.eq(pet.status);
        expect(getResponse.body.category.name).to.eq(pet.category.name);
      });

      // Remove o pet ao final para nao deixar massa residual no Petstore.
      cy.request({
        method: 'DELETE',
        url: `/pet/${pet.id}`,
        failOnStatusCode: false
      }).then((deleteResponse) => {
        expect([200, 404]).to.include(deleteResponse.status);
      });
    });
  });

  it('retorna erro ao buscar pet com id invalido', () => {
    // Envia um petId invalido para validar o tratamento de erro da API.
    cy.request({
      method: 'GET',
      url: '/pet/id-invalido-xyz',
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 404]).to.include(response.status);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.a('string').and.not.be.empty;
    });
  });
});