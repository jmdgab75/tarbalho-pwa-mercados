if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      let reg;
      reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
      console.log('Service worker registrada!', reg);
    } catch (err) {
      console.log('Service worker registro falhou', err);
    }
  });
}

let posicaoInicial;
const capturarLocalizacao = document.getElementById( 'localizacao');
const latitude = document.getElementById( 'latitude' );
const longitude = document.getElementById( 'longitude' );
 
let gmap_canvas = document.getElementById ("gmap_canvas");

const sucesso = (posicao) => {
    posicaoInicial = posicao;
    latitude.innerHTML = posicaoInicial.coords.latitude;
    longitude.innerHTML = posicaoInicial.coords.longitude;
    map.src = "https://maps.google.com/maps?q" + 


    const gmap_canvas.src = "https://maps.google.com/maps?q=636+5th+Ave%2C+New+York&t=&z=13&ie=UTF8&iwloc=&output=embed";
    
}

const erro = (error) => {
    let errorMessage;
    switch(error.code){
    case 0:
         errorMessage = "Erro desconhecido"
    break;
    case 1:
          errorMessage = "Permissão negada!"
    break;
    case 2:
          errorMessage = "Captura de posição indisponível!"
    break;
    case 3:
          errorMessage = "Tempo de excedido!"
    break;
  }
    console.log( 'Ocorreu um erro:' + errorMessage);
};

capturarLocalizacao.addEventListener('click',() => {
    navigator.geolocation.getCurrentPosition(sucesso, erro);
});