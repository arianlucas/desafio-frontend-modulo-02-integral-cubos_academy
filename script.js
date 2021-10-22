const body = document.querySelector('body');
const btnTema = document.querySelector('.btn-theme');
const input = document.querySelector('.input');
const movies = document.querySelector('.movies');
const movie = document.querySelectorAll('.movie');
const movieTitle = document.querySelectorAll('.movie__title');
const movieRating = document.querySelectorAll('.movie__rating');
const estrela = document.querySelector('.movie__rating img');
const modal = document.querySelector('.modal');
const fecharModal = document.querySelector('.modal__close');

const anteriorBotao = document.querySelector('.btn-prev');
const proximoBotao = document.querySelector('.btn-next');

const tituloFilme = document.querySelector('.modal__title');
const imagemFilme = document.querySelector('.modal__img');
const descriFilme = document.querySelector('.modal__description');
const avaliaFilme = document.querySelector('.modal__average');
const generoFilme = document.querySelector('.modal__genres');

let lista0;
let marcador;
let contador = 0 ;

let tema = localStorage.getItem('tema');
btnTema.src = tema === 'claro'? "./assets/light-mode.svg" : "./assets/dark-mode.svg";
anteriorBotao.src = tema === 'claro'? 'assets/seta-esquerda-preta.svg' : 'assets/seta-esquerda-branca.svg';
proximoBotao.src = tema === 'claro'? 'assets/seta-direita-preta.svg' : 'assets/seta-direita-branca.svg';
body.style.setProperty('--cor-principal', tema === 'claro' ? '#fdfdfd': '#000');
body.style.setProperty('--cor-secundaria', tema === 'claro' ? '#000': '#fdfdfd');


const listaFilmes = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');


listaFilmes.then(resposta => {
    const promessa = resposta.json()

    promessa.then (listas => {
        lista0 = listas.results.filter((x,y) => y < 5);
        const lista1 = listas.results.filter((x,y) => y > 4 && y < 10);
        const lista2 = listas.results.filter((x,y) => y > 9 && y < 15);
        const lista3 = listas.results.filter((x,y) => y > 14 && y < 20);
        
        mudarPagina(lista0)
        marcador = 0;

        anteriorBotao.addEventListener('click', ()=> {
            if (marcador === 0){
                mudarPagina(lista3);
                marcador = 3;
            } else if (marcador === 3){
                mudarPagina(lista2);
                marcador--
            } else if (marcador === 2){
                mudarPagina(lista1);
                marcador--
            } else {
                mudarPagina(lista0);
                marcador--
            }
        })

        proximoBotao.addEventListener('click', ()=> {
            if (marcador === 3){
                mudarPagina(lista0);
                marcador = 0;
            } else if (marcador === 0){
                mudarPagina(lista1);
                marcador++
            } else if (marcador === 1){
                mudarPagina(lista2);
                marcador++
            } else {
                mudarPagina(lista3);
                marcador++
            }
        })
        
    })

    
});

input.addEventListener('keydown', (e)=> {
    if (e.key !== 'Enter'){return} 

    if (input.value === ''){
        location.reload();
    } 

    const procuraFilmes = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`);

    procuraFilmes.then (resposta2 => {
        const busca = resposta2.json()
        
        busca.then(pesquisa => {

            const listaA = pesquisa.results.filter((x,y) => y < 5);
            const listaB = pesquisa.results.filter((x,y) => y > 4 && y < 10);
            const listaC = pesquisa.results.filter((x,y) => y > 9 && y < 15);
            const listaD = pesquisa.results.filter((x,y) => y > 14 && y < 20);

            limparPagina();
            mudarPagina(listaA);
            marcador = 0;
            input.value = '';
            

            anteriorBotao.addEventListener('click', ()=> {
                limparPagina();
                if (marcador === 0){
                    mudarPagina(listaD);
                    marcador = 3;
                } else if (marcador === 3){
                    mudarPagina(listaC);
                    marcador--
                } else if (marcador === 2){
                    mudarPagina(listaB);
                    marcador--
                } else {
                    mudarPagina(listaA);
                    marcador--
                }
            })

            proximoBotao.addEventListener('click', ()=> {
                limparPagina();
                if (marcador === 3){
                    mudarPagina(listaA);
                    marcador = 0;
                } else if (marcador === 0){
                    mudarPagina(listaB);
                    marcador++
                } else if (marcador === 1){
                    mudarPagina(listaC);
                    marcador++
                } else {
                    mudarPagina(listaD);
                    marcador++
                }
            })

        })
        
    })
});

const filmeDia = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');
const videoDia = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');

filmeDia.then(infos => {
    const info = infos.json();

    info.then (filme => {
        const poster = document.querySelector('.highlight__video');
        const titulo = document.querySelector('.highlight__title');
        const avaliacao = document.querySelector('.highlight__rating');
        const generos = document.querySelector('.highlight__genres');
        const lancamento = document.querySelector('.highlight__launch');
        const descricao = document.querySelector('.highlight__description');
        let genero = [];
        const data = new Date(filme.release_date);
        
        poster.style.backgroundImage = `url(${filme.backdrop_path})`;
        titulo.textContent = `${filme.title}`;
        avaliacao.textContent = `${filme.vote_average}`;
        filme.genres.forEach(genre => {
            if (genero.length === 3) return;
            genero.push(genre.name) 
        })
        generos.textContent = genero.join(', ');
        lancamento.textContent = data.toLocaleDateString('pt-br', {
            year: 'numeric',
            month: 'long',
            day: 'numeric' 
        });
        descricao.textContent = filme.overview;
        
    })
});

videoDia.then(infos => {
    const link = infos.json();

    link.then(video => {
        const linkVideo = document.querySelector('.highlight__video-link');

        linkVideo.href = `https://www.youtube.com/watch?v=${video.results[0].key}`
    })
});



movie.forEach(poster => {
    poster.addEventListener('click', (e) => {
        modal.classList.remove('hidden')
        
        const buscarFilme = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${poster.id}?language=pt-BR`);

        buscarFilme.then(resposta => {
            const exibirFilme = resposta.json();
            let genero = [];

            exibirFilme.then(infoFilme => {
                tituloFilme.textContent = infoFilme.title;
                imagemFilme.src = ''
                imagemFilme.src = infoFilme.backdrop_path;
                descriFilme.textContent = infoFilme.overview;
                avaliaFilme.textContent = infoFilme.vote_average;
                generoFilme.textContent = '';
                infoFilme.genres.forEach(genre => {
                    const span = document.createElement('span');
                    span.textContent = genre.name;
                    generoFilme.append(span)
                })
                
            })
        })
    })
});

fecharModal.addEventListener('click', ()=> {
    modal.classList.add('hidden')
});

modal.addEventListener('click', () =>{
    modal.classList.add('hidden')
})


btnTema.addEventListener('click', () => { 

    if (contador === 0) {
        btnTema.src =  "./assets/dark-mode.svg";
        anteriorBotao.src = 'assets/seta-esquerda-branca.svg';
        proximoBotao.src = 'assets/seta-direita-branca.svg';
        body.style.setProperty('--cor-principal', '#000');
        body.style.setProperty('--cor-secundaria', '#FDFDFD');
        contador--;
    } else {
        btnTema.src =  "./assets/light-mode.svg";
        anteriorBotao.src = 'assets/seta-esquerda-preta.svg';
        proximoBotao.src = 'assets/seta-direita-preta.svg';
        body.style.setProperty('--cor-principal', '#FDFDFD');
        body.style.setProperty('--cor-secundaria', '#000');
        contador++
    }

    localStorage.setItem('tema', tema === 'claro' ? 'escuro' : 'claro');
    
});

function mudarPagina(lista) {
    for (let idx = 0; idx < lista.length; idx++) {  
        movie[idx].style.backgroundImage = `url(${lista[idx].poster_path})`;
        movie[idx].id = lista[idx].id
        movieTitle[idx].innerHTML = `${lista[idx].title}`; 
        movieRating[idx].innerHTML = '';
        movieRating[idx].append(estrela);
        movieRating[idx].innerHTML += `${lista[idx].vote_average}`;

    }
}

function limparPagina() {
    for (let idx = 0; idx < 5; idx++) {  
        movie[idx].style.backgroundImage = ``;
        movieTitle[idx].innerHTML = ``;
        movieRating[idx].innerHTML = '';

    }
}