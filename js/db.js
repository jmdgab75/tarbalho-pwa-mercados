
let db; 


const request = indexedDB.open('CadastroMercadosDB', 1);


request.onupgradeneeded = function (event) {
    db = event.target.result;

    const objectStore = db.createObjectStore('mercados', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('nome', 'nome', { unique: false });
    objectStore.createIndex('localizacao', 'localizacao', { unique: false });
};


request.onerror = function (event) {
    console.error("Erro ao abrir o banco de dados:", event.target.errorCode);
};


request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Banco de dados aberto com sucesso!");
};

function cadastrarMercado() {
    const nome = document.getElementById('nome').value;
    const localizacao = document.getElementById('localizacao').value;

 
    const transaction = db.transaction(['mercados'], 'readwrite');
    const objectStore = transaction.objectStore('mercados');

   
    const novoMercado = { nome, localizacao };
    const request = objectStore.add(novoMercado);

    request.onsuccess = function (event) {
        console.log("Mercado cadastrado com sucesso no banco de dados!");
    };

    request.onerror = function (event) {
        console.error("Erro ao cadastrar mercado no banco de dados:", event.target.errorCode);
    };

    document.getElementById('nome').value = '';
    document.getElementById('localizacao').value = '';

    atualizarListaMercados();

  
    atualizarMapa();
}

function atualizarListaMercados() {
    const listaMercados = document.getElementById('listaMercados');
    listaMercados.innerHTML = '';

    const transaction = db.transaction(['mercados'], 'readonly');
    const objectStore = transaction.objectStore('mercados');
    const request = objectStore.openCursor();

    request.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
            const mercadoItem = document.createElement('div');
            mercadoItem.textContent = `${cursor.value.nome} - ${cursor.value.localizacao}`;
            listaMercados.appendChild(mercadoItem);

            cursor.continue();
        }
    };

    request.onerror = function (event) {
        console.error("Erro ao buscar mercados no banco de dados:", event.target.errorCode);
    };
}

