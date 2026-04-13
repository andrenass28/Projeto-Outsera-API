describe('Petstore API update pet', () => {
  // Tenta buscar o pet algumas vezes para contornar a latencia do ambiente publico.
  const getPetWithRetry = (petId, validateBody, attemptsLeft = 5) => {
    return cy
      .request({
        method: 'GET',
        url: `/pet/${petId}`,
        failOnStatusCode: false
      })
      .then((response) => {
        const isBodyValid = typeof validateBody === 'function' ? validateBody(response.body) : true;

        if ((response.status === 200 && isBodyValid) || attemptsLeft === 1) {
          return response;
        }

        cy.wait(1000);
        return getPetWithRetry(petId, validateBody, attemptsLeft - 1);
      });
  };

  it('adiciona, edita e deleta um pet com sucesso', () => {
    // Carrega os dados base do pet a partir da fixture cypress/fixtures/petstore-pet.json.
    cy.fixture('petstore-pet').then((pet) => {
      // Remove o pet antes do teste para permitir reexecucao sem conflito.
      cy.request({
        method: 'DELETE',
        url: `/pet/${pet.id}`,
        failOnStatusCode: false
      });

      // Cria o pet com os dados originais da fixture.
      cy.request('POST', '/pet', pet).then((createResponse) => {
        expect(createResponse.status).to.eq(200);
        expect(createResponse.body.id).to.eq(pet.id);
        expect(createResponse.body.name).to.eq(pet.name);
        expect(createResponse.body.status).to.eq(pet.status);
      });

      // Envia o PUT com os dados atualizados e valida a resposta da edicao.
      const updatedPet = {
        ...pet,
        name: 'Dog Updated',
        status: 'sold'
      };

      getPetWithRetry(pet.id).then(() => {
        cy.request('PUT', '/pet', updatedPet).then((updateResponse) => {
          expect(updateResponse.status).to.eq(200);
          expect(updateResponse.body.id).to.eq(pet.id);
          expect(updateResponse.body.name).to.eq(updatedPet.name);
          expect(updateResponse.body.status).to.eq(updatedPet.status);
        });
      });

      // Confirma que os novos dados foram persistidos com um GET apos a edicao.
      getPetWithRetry(
        pet.id,
        (body) => body.name === updatedPet.name && body.status === updatedPet.status,
        7
      ).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.name).to.eq(updatedPet.name);
        expect(getResponse.body.status).to.eq(updatedPet.status);
      });

      // Deleta o pet e confirma a exclusao.
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