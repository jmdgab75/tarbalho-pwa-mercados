
let mercados = [];

function cadastrarMercado() {
    const nome = document.getElementById('nome').value;
    const localizacao = document.getElementById('localizacao').value;

  
    mercados.push({ nome, localizacao });

  
    document.getElementById('nome').value = '';
    document.getElementById('localizacao').value = '';

   
    atualizarListaMercados();

    atualizarMapa();
}


function atualizarListaMercados() {
    const listaMercados = document.getElementById('listaMercados');
    listaMercados.innerHTML = '';

    mercados.forEach(mercado => {
        const mercadoItem = document.createElement('div');
        mercadoItem.textContent = `${mercado.nome} - ${mercado.localizacao}`;
        listaMercados.appendChild(mercadoItem);
    });
}

function atualizarMapa() {
  const mapaDiv = document.getElementById('mapa');

  const transaction = db.transaction(['mercados'], 'readonly');
  const objectStore = transaction.objectStore('mercados');
  const request = objectStore.openCursor(null, 'prev');

  request.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
          const localizacao = cursor.value.localizacao;


          mapaDiv.innerHTML = `<iframe
              width="100%"
              height="100%"
              frameborder="0" style="border:0"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyA4W2km6h8If1v8Tm_Kc_p56-JMA-7anSk&q=${localizacao}" allowfullscreen>
          </iframe>`;
      }
  };

  request.onerror = function (event) {
      console.error("Erro ao buscar mercado no banco de dados:", event.target.errorCode);
  };
}
