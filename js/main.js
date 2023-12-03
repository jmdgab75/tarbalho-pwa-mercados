// Inicialização do IndexedDB
const dbName = "supermercadosDB";
const dbVersion = 1;
const request = indexedDB.open(dbName, dbVersion);

request.onerror = (event) => {
  console.error("Erro ao abrir o banco de dados:", event.target.error);
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const objectStore = db.createObjectStore("supermercados", { keyPath: "id", autoIncrement: true });
  objectStore.createIndex("nome", "nome", { unique: false });
  objectStore.createIndex("localizacao", "localizacao", { unique: false });
};

// Função para cadastrar supermercado
const cadastrarSupermercado = () => {
  const nome = document.getElementById("nome").value;
  const localizacao = document.getElementById("localizacao").value;

  const supermercado = { nome, localizacao };

  const transaction = request.result.transaction(["supermercados"], "readwrite");
  const objectStore = transaction.objectStore("supermercados");
  const addRequest = objectStore.add(supermercado);

  addRequest.onsuccess = () => {
    console.log("Supermercado cadastrado com sucesso!");
    listarSupermercados();
  };

  addRequest.onerror = (event) => {
    console.error("Erro ao cadastrar supermercado:", event.target.error);
  };
};

// Função para listar supermercados
const listarSupermercados = () => {
  const transaction = request.result.transaction(["supermercados"], "readonly");
  const objectStore = transaction.objectStore("supermercados");
  const cursorRequest = objectStore.openCursor();

  const listContainer = document.getElementById("supermarketList");
  listContainer.innerHTML = "";

  cursorRequest.onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      const li = document.createElement("li");
      li.textContent = `${cursor.value.nome} - ${cursor.value.localizacao}`;
      listContainer.appendChild(li);

      cursor.continue();
    }
  };

  cursorRequest.onerror = (event) => {
    console.error("Erro ao listar supermercados:", event.target.error);
  };
};

// Inicialização do mapa
const initializeMap = () => {
  const mapContainer = document.getElementById("map");
  const localizacao = document.getElementById("localizacao").value;

  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyDsdNjeP_Uroc-PGBFZBigxSEa3uPsU1QQ&center=${localizacao}&zoom=15`;

  mapContainer.innerHTML = `<iframe
    width="100%"
    height="300"
    frameborder="0" style="border:0"
    src="${mapUrl}"
    allowfullscreen
  ></iframe>`;
};

document.getElementById("supermarketForm").addEventListener("submit", (event) => {
  event.preventDefault();
  cadastrarSupermercado();
});

listarSupermercados();
initializeMap();