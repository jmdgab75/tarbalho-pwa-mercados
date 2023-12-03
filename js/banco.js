import { openDB } from "idb";

let banco;
async function criarBanco(){
    try {
        banco = await openBanco('bd', 1, {
            upgrade(db, oldVersion, newVersion, transaction){
                switch  (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('mercados', {
                            keyPath: 'nome'
                        });
                        store.createIndex('id', 'id');
                        console.log("banco de dados criado com sucesso!");
                }
            }
        });
        console.log("o banco de dados foi aberto!");
    }catch (e) {
        console.log('erro ao criar/abrir banco: ' + e.message);
    }
}

window.addEventListener('DOMContentLoaded', async event =>{
    criarBanco();
    document.getElementById('btnCadastro').addEventListener('click', adicionarAnotacao);
    document.getElementById('btnCarregar').addEventListener('click', buscarTodasAnotacoes);
    document.getElementById('btnRemover').addEventListener('click', removerAnotacao);
    document.getElementById('btnBuscar').addEventListener('click', buscarAnotacao);
    document.getElementById('btnAtualiza').addEventListener('click', atualizarAnotacao);
    document.getElementById('btnCancelaAtualizacao').addEventListener('click', fecharAtualizacao);
});

async function buscarTodosMercados(){
    if(db == undefined){
        console.log("O banco de dados está fechado.");
    }
    const tx = await db.transaction('mercados', 'readonly');
    const store = await tx.objectStore('mercados');
    const mercados = await store.getAll();
    if(mercados){
        const divLista = mercados.map(mercados => {
            return `<div class="item">
                    <p>Mercados</p>
                    <p>${mercados.nome} -  </p>
                    <p>${anotacao.localizacao}</p>
                   </div>`;
        });
        listagem(divLista.join(' '));
    }
}

async function addMercados() {
    let nome = document.getElementById("nome").value;
    let localizacao = document.getElementById("localizacao").value;
    const tx = await db.transaction('mercados', 'readwrite')
    const store = tx.objectStore('mercados');
    try {
        await store.add({ nome: nome, localizacao: localizacao });
        await tx.done;
        limparCampos();
        console.log('Registro adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar registro:', error);
        tx.abort();
    }
}

async function atualizarMercado(){
    const nome = document.getElementById('nomeUpdate').value;
    const localizacao = document.getElementById('localizacaoUpdate').value;
    const tx = await db.transaction('anotacao', 'readwrite');
    const store = tx.objectStore('anotacao');
    try {
        await store.put({ nome: nome, localizacao: localizacao });
        await tx.done;
        fecharAtualizacao();
        buscarTodosMercados();
        console.log('Anotação atualizada com sucesso!');
    } catch (error) {
        console.error('Erro ao atualziar anotação:', error);
        tx.abort();
    }
}

function fecharAtualizacao() {
    document.getElementById('nomeUpdate').removeAttribute('readonly');
    document.getElementById('nomeUpdate').value = '';
    document.getElementById('localizacaoUpdate').value = '';
    document.getElementById('updateForm').style.display = 'none';
}


async function removerMercado() {
    const nomeRemover = prompt('Qual Mercado deseja excluir:');
    if (!nomeRemover) {
        console.log('Exclusão cancelada.');
        return;
    }
    const tx = await db.transaction('mercado', 'readwrite');
    const store = tx.objectStore('mercado');
    try {
        await store.delete(nomeRemover);
        await tx.done;
        console.log('Mercado excluído com sucesso!');
        buscarTodosMercados();
    } catch (error) {
        console.error('Erro ao excluir mercado', error);
        tx.abort();
    }
}

async function buscarMercado() {
    let busca = document.getElementById("busca").value;
    const tx = await db.transaction('mercado', 'readonly');
    const store = tx.objectStore('mercado');
    const index = store.index(nome);
    const mercados = await index.getAll(IDBKeyRange.only(busca));
    if (mercados.length > 0) {
        const divLista = mercados.map(anotacao => {
            return `<div class="item">
            <p>Mercados</p>
            <p>Nome: ${mercado.nome}</p>
            <p>Texto: ${mercado.localizacao}</p>
            </div>`;
        });
        listagem(divLista.join(''));
    } else {
        listagem(`<p>Nenhum mercado encontrado com esse nome.</p>`);
    }
}


function limparCampos() {
    document.getElementById("nome").value = '';
    document.getElementById("localizacao").value = '';
}

function listagem(text){
    document.getElementById('resultados').innerHTML = text;
}