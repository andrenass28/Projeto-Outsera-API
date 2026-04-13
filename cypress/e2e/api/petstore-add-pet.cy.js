describe('Petstore API add pet', () => {
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

  it('adiciona um pet com sucesso', () => {
    // Carrega os dados do pet a partir da fixture cypress/fixtures/petstore-pet.json.
    cy.fixture('petstore-pet').then((pet) => {
      // Remove o pet antes do teste para permitir reexecucao sem conflito.
      cy.request({
        method: 'DELETE',
        url: `/pet/${pet.id}`,
        failOnStatusCode: false
      });

      // Envia o cadastro do pet e valida que a API retornou os dados persistidos.
      cy.request('POST', '/pet', pet).then((createResponse) => {
        expect(createResponse.status).to.eq(200);
        expect(createResponse.body.id).to.eq(pet.id);
        expect(createResponse.body.name).to.eq(pet.name);
        expect(createResponse.body.status).to.eq(pet.status);
        expect(createResponse.body.category.name).to.eq(pet.category.name);
        expect(createResponse.body.photoUrls).to.deep.eq(pet.photoUrls);
        expect(createResponse.body.tags[0].name).to.eq(pet.tags[0].name);
      });

      // Busca o pet com retry para confirmar que foi persistido corretamente.
      getPetWithRetry(pet.id).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.id).to.eq(pet.id);
        expect(getResponse.body.name).to.eq(pet.name);
        expect(getResponse.body.status).to.eq(pet.status);
      });

      // Remove o pet ao final para nao deixar massa residual no Petstore.
      cy.then(() => {
        cy.request({
          method: 'DELETE',
          url: `/pet/${pet.id}`,
          failOnStatusCode: false
        }).then((deleteResponse) => {
          expect([200, 404]).to.include(deleteResponse.status);
        });
      });
    });
  });

});
