const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers:{
    'Content-Type': 'application/json;charset=utf-8'
  },
  params: {
    'api_key': API_KEY
  },
})


const tendencias = document.getElementById('tendencias');
const categorias = document.getElementById('categorias');


async function getTrendingMoviesPreview() {
  consumirApi('trending/movie/week',{},tendencias, 20)
}


async function getCategoriesPreview() {
  const {data} = await api('genre/movie/list');
  const generos = data.genres;
  console.log({data});
  console.log(generos);
  categorias.innerHTML = '';


  for(let i = 0; i < 19; i++) {
    const div = document.createElement('div');
    div.classList.add('categoria');
    div.textContent = generos[i].name;
    div.addEventListener('click', () => {
      location.hash = `#category=${generos[i].id}-${generos[i].name}`;
    });
    div.classList.add('pointer');
    categorias.appendChild(div);
  } 
}


async function getMoviesByCategory(id, title) {
  categoriaTitulo.innerHTML= ''
   consumirApi('discover/movie?',{
    with_genres: id,
  },contenedorPeliculasDeCategoria, 18)
  categoriaTitulo.innerHTML = title
}

async function consumirApi(endpoint, params={}, container, cantidad){
      container.innerHTML = '';
      const {data} = await api(endpoint, {params});

      const movies = data.results;

      for(let i = 0; i < cantidad; i++) {
        const div = document.createElement('div');
        div.classList.add('pelicula');
        div.addEventListener('click', () => {
          location.hash = `#movie=${movies[i].id}`;
        });
        div.classList.add('pointer');
        div.style.backgroundImage = `url('https://image.tmdb.org/t/p/w300${movies[i].poster_path}')`;
        container.appendChild(div);
      } 
}


async function getSearchMovies(query) {
   consumirApi('search/movie',{
      query: query,
  },contenedorPeliculasDeCategoria, 18)
}

async function getTrendingMovies() {
  consumirApi('trending/movie/week',{},contenedorPeliculasTendencias, 18)
}


async function getMovieInfo(id) {
    const {data:movie} = await api(`movie/${id}`);

    peliculaPoster.src = `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`;
    tituloPelicula.textContent = movie.title;
    sipnopsis.textContent = movie.overview;
    fechaLanzamiento.textContent = movie.release_date;
    Calificacion.textContent = movie.vote_average;

}

async function changeBackGround() {
  const {data} = await api('trending/movie/week');
  const movies = data.results;
  let i = 0;

  setInterval(() => {
    contenedorPrincipal.style.transition = 'background-image 1s';
    contenedorPrincipal.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movies[i].backdrop_path}')`;
    i = (i + 1) % movies.length; 
  }, 5000);
}


document.querySelector('.listaPeliculasWrapper').addEventListener('wheel', (evt) => {
  evt.preventDefault();
  document.querySelector('.listaPeliculasWrapper').scrollLeft += evt.deltaY * 3;
});

document.querySelector('.listaCategoriasWrapper').addEventListener('wheel', (evt) => {
  evt.preventDefault();
  document.querySelector('.listaCategoriasWrapper').scrollLeft += evt.deltaY * 3;
});