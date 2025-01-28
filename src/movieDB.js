const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers:{
    'Content-Type': 'application/json;charset=utf-8'
  },
  params: {
    'api_key': API_KEY,
    "language": navigator.language || "es-ES"
  },
})

function ListaPeliculasGuardadas(){

  const item = JSON.parse(localStorage.getItem("liked_movies"));
  let movies;

  if(item){
    movies = item
  }else{
    movies = {}
  }


  return movies;
}

function guardarPelicula(pelicula){

   const peliculasGuardadas = ListaPeliculasGuardadas()

   if(peliculasGuardadas[pelicula.id]){
    peliculasGuardadas[pelicula.id] = undefined
      
   }else{
    peliculasGuardadas[pelicula.id] = pelicula

  }

   localStorage.setItem('liked_movies',JSON.stringify(peliculasGuardadas));

  const nuevasPeliculasGuardadas = ListaPeliculasGuardadas();

  if(nuevasPeliculasGuardadas !== peliculasGuardadas) {
    getLikedMovies();
  }


}


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
  categoriaTitulo.innerHTML = title
   consumirApi('discover/movie?',{
    with_genres: id,
  },contenedorPeliculasDeCategoria, 18)
}

function getPaginatedMoviesByCategory(id) {
  return async function () {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const pageIsNotMax = page < maxPage;

    if ((pageIsNotMax) && (scrollTop + clientHeight) >= (scrollHeight - 15)) {
      page++;
      consumirApi('discover/movie', {
        with_genres: id,
        page: page,
      }, contenedorPeliculasDeCategoria, 18, false);
    }
  }
}



const lazyLoader = new IntersectionObserver((entries)=>{
  entries.forEach((entry) => {
    if(entry.isIntersecting&& entry.target.getAttribute('data-img')!==null){
      const url =entry.target.getAttribute('data-img');
      entry.target.setAttribute('src',url);
    }
    
  });
});


async function consumirApi(endpoint, params={}, container, cantidad, clean=true){
  if(clean){
    container.innerHTML = '';
  }
  const {data} = await api(endpoint, {params});

      const movies = data.results;
      maxPage = data.total_pages;
      console.log(maxPage);
      

      if (!movies || movies.length === 0) {
        const div = document.createElement('div');
        div.textContent = 'No se encontraron peliculas recomendadas';
        div.classList.add('no-image-recomendadas')
        container.appendChild(div);
        return;
      }

      for(let i = 0; i < cantidad; i++) {
        const div = document.createElement('div');
        const img = document.createElement('img');
        const favoriteBtn = document.createElement('button');
        favoriteBtn.classList.add('favoriteBtn');
        ListaPeliculasGuardadas()[movies[i].id] ? favoriteBtn.classList.add('favorited') : null;
        favoriteBtn.addEventListener('click', ()=>{
          favoriteBtn.classList.toggle('favorited');
          guardarPelicula(movies[i])
        });
        div.classList.add('relative');
        img.classList.add('pelicula');
        img.addEventListener('click', () => {
          location.hash = `#movie=${movies[i].id}`;
        });
        img.classList.add('pointer');
        img.setAttribute('alt',movies[i].title);
        img.setAttribute('data-img',`https://image.tmdb.org/t/p/w300${movies[i].poster_path}`) ;
        if(movies[i].poster_path==null){
          img.classList.add('no-image');
        }
        
        lazyLoader.observe(img);
        div.appendChild(img);
        div.appendChild(favoriteBtn);
        container.appendChild(div);


      } 
}


async function getSearchMovies(query) {
   consumirApi('search/movie',{
      query: query,
  },contenedorPeliculasDeCategoria, 18)



}

function getSearchMoviesPaginated(query) {
  return async function () {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const pageIsNotMax = page < maxPage;

    if ((pageIsNotMax) && (scrollTop + clientHeight) >= (scrollHeight - 15)) {
      page++;
      consumirApi('search/movie', {
        query: query,
        page: page,
      }, contenedorPeliculasDeCategoria, 18, false);
    }
  }
}


async function getTrendingMovies() {
  consumirApi('trending/movie/week',{},contenedorPeliculasTendencias, 18);
}


async function getTrendingMoviesPaginated() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  const pageIsNotMax = page < maxPage;

    if ((pageIsNotMax)&&(scrollTop + clientHeight) >= (scrollHeight - 15)) {
        page++;
        consumirApi('trending/movie/week', { page: page }, contenedorPeliculasTendencias, 18, false);
    }
  
  
}

async function getMovieInfo(id) {
    const {data:movie} = await api(`movie/${id}`);
    getRelatedMoviesId(id);



    peliculaPoster.classList.remove('no-image-poster');

    peliculaPoster.src = `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`;
    tituloPelicula.textContent = movie.title;
    sipnopsis.textContent = movie.overview;
    fechaLanzamiento.textContent = movie.release_date;
    Calificacion.textContent = movie.vote_average;
    if(movie.backdrop_path==null){
      peliculaPoster.classList.add('no-image-poster');
      peliculaPoster.setAttribute('alt', 'No hay imagen disponible');
    }


}

async function getRelatedMoviesId(id) {
  
  consumirApi(`movie/${id}/recommendations`,{},recomendadas, 20)


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

function getLikedMovies(){
  listaPeliculasFavoritas.innerHTML = '';

  const likedMovies = ListaPeliculasGuardadas();

  const moviesArray = Object.values(likedMovies)
 
  if (!moviesArray || moviesArray.length === 0) {
    const div = document.createElement('div');
    div.textContent = 'No se encontraron peliculas favoritas';
    div.classList.add('no-image-recomendadas')
    listaPeliculasFavoritas.appendChild(div);
    return;
  }


  moviesArray.forEach(movie => {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const favoriteBtn = document.createElement('button');
    favoriteBtn.classList.add('favoriteBtn');
    ListaPeliculasGuardadas()[movie.id] ? favoriteBtn.classList.add('favorited') : null;
    favoriteBtn.addEventListener('click', ()=>{
      favoriteBtn.classList.toggle('favorited');
      guardarPelicula(movie)
    });
    div.classList.add('relative');
    img.classList.add('pelicula');
    img.addEventListener('click', () => {
      location.hash = `#movie=${movie.id}`;
    });
    img.classList.add('pointer');
    img.setAttribute('alt',movie.title);
    img.setAttribute('data-img',`https://image.tmdb.org/t/p/w300${movie.poster_path}`) ;
    if(movie.poster_path==null){
      img.classList.add('no-image');
    }
    
    lazyLoader.observe(img);
    div.appendChild(img);
    div.appendChild(favoriteBtn);
    listaPeliculasFavoritas.appendChild(div);
  });
}


document.querySelector('.listaPeliculasWrapper').addEventListener('wheel', (evt) => {
  evt.preventDefault();
  document.querySelector('.listaPeliculasWrapper').scrollLeft += evt.deltaY * 3;
});

document.querySelector('.listaCategoriasWrapper').addEventListener('wheel', (evt) => {
  evt.preventDefault();
  document.querySelector('.listaCategoriasWrapper').scrollLeft += evt.deltaY * 3;
});

document.querySelector('.listaPeliculasFavoritasWrapper').addEventListener('wheel', (evt) => {
  evt.preventDefault();
  document.querySelector('.listaPeliculasFavoritasWrapper').scrollLeft += evt.deltaY * 3;
});

//listaPeliculas

document.querySelector('#listaPeliculas').addEventListener('wheel', (evt) => {
  evt.preventDefault();
  document.querySelector('#listaPeliculas').scrollLeft += evt.deltaY * 3;
});