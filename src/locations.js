let page = 1;
let maxPage;
let infiniteScroll;

tendenciasBtn.addEventListener('click', () => {
    location.hash = '#trends';
});

volverBtnCategoria.addEventListener('click', () => {
    window.history.back();
});

volverBtnPelicula.addEventListener('click', () => {
 window.history.back();

});

volverBtnTendencias.addEventListener('click', () => {
    window.history.back();

});

botonDeBusqueda.addEventListener('click', () => {
    location.hash = '#search=' + buscadorInput.value.trim();
});

botonDeBusquedaEnCategoria.addEventListener('click', () => {
    location.hash = '#search=' + buscadorInputEnCategoria.value.trim();
});

titulo.addEventListener('click', () => {
    location.hash = '';
});

window.addEventListener('DOMContentLoaded', navigation, false);
window.addEventListener('hashchange', navigation, false);
window.addEventListener('scroll', infiniteScroll, false);



changeBackGround();



function navigation(){
    console.log({location});

    if(infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }

    if(location.hash.startsWith('#trends')){
        trendsPage();
    }else if(location.hash.startsWith('#search=')){
        searchPage();
    }else if(location.hash.startsWith('#movie=')){
        moviePage();
    }else if(location.hash.startsWith('#category=')){
        categoriesPage();
    }else {
        homePage();
    }

    if(infiniteScroll){
        window.addEventListener('scroll', infiniteScroll,  {passive: false});
    }

}


function homePage() {
    console.log('home');

    tendenciasWrapper.classList.remove('desactivado');
    contenedorPrincipal.classList.remove('desactivado');  
    contenedorCategoria.classList.remove('desactivado');
    tendenciasTitulo.classList.remove('desactivado');
    categoriasTitulo.classList.remove('desactivado');
    generosWrapper.classList.remove('desactivado');
    separador1.classList.remove('desactivado');
    favoritasTitulo.classList.remove('desactivado');
    wrapperPeliculasFavoritas.classList.remove('desactivado');
    listaPeliculasFavoritas.classList.remove('desactivado');

    //desactivar pelicula especifica
    informacionPelicula.classList.add('desactivado');
    

    //desactivar pagina de categorias
    volverBtnCategoria.classList.add('desactivado');
    categoriaTitulo.classList.add('desactivado');
    peliculasPorCategoria.classList.add('desactivado'); 
    
     //desactivar todas las tendencias
     todasLasTendencias.classList.add('desactivado');
    
    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}

function categoriesPage() {
    peliculasPorCategoria.classList.remove('desactivado');
    categoriaTitulo.classList.remove('desactivado');
    volverBtnCategoria.classList.remove('desactivado');

    //descativar la pagina principal
    contenedorPrincipal.classList.add('desactivado');  
    contenedorCategoria.classList.add('desactivado');
    tendenciasTitulo.classList.add('desactivado');
    categoriasTitulo.classList.add('desactivado');
    tendenciasWrapper.classList.add('desactivado');
    generosWrapper.classList.add('desactivado');
    separador1.classList.add('desactivado');
    favoritasTitulo.classList.add('desactivado');
    wrapperPeliculasFavoritas.classList.add('desactivado');
    listaPeliculasFavoritas.classList.add('desactivado');

    //desactivar pelicula especifica
    informacionPelicula.classList.add('desactivado');

    //desactivar barra de busqueda
    buscadorEnCategoria.classList.add('desactivado');
    buscadorInputEnCategoria.classList.add('desactivado');
    botonDeBusquedaEnCategoria.classList.add('desactivado');    
    //desactivar todas las tendencias
    todasLasTendencias.classList.add('desactivado');


    const [_, categoryData] =location.hash.split('=') 
    const [categoryId, categoryName] = categoryData.split('-') 
    const finalName = categoryName.replace('%20', ' ')

    getMoviesByCategory(categoryId, finalName);
  infiniteScroll = getPaginatedMoviesByCategory(categoryId);
  window.addEventListener('scroll', infiniteScroll, { passive: false });
}

function moviePage() {
    console.log('movie');
    peliculaPoster.src = '';
    sipnopsis.textContent = '';
    tituloPelicula.textContent = '';
    informacionPelicula.classList.remove('desactivado');

    //desactivar la pagina principal
    contenedorPrincipal.classList.add('desactivado');  
    contenedorCategoria.classList.add('desactivado');
    tendenciasTitulo.classList.add('desactivado');
    categoriasTitulo.classList.add('desactivado');
    tendenciasWrapper.classList.add('desactivado');
    generosWrapper.classList.add('desactivado');
    separador1.classList.add('desactivado');
    favoritasTitulo.classList.add('desactivado');
    wrapperPeliculasFavoritas.classList.add('desactivado');
    listaPeliculasFavoritas.classList.add('desactivado');

    //desactivar pagina de categorias
    volverBtnCategoria.classList.add('desactivado');
    categoriaTitulo.classList.add('desactivado');
    peliculasPorCategoria.classList.add('desactivado'); 

     //desactivar todas las tendencias
     todasLasTendencias.classList.add('desactivado');

    const [_, id] = location.hash.split('=')

    getMovieInfo(id);
    
}

function searchPage() {
    console.log('search');
    contenedorPeliculasDeCategoria.innerHTML = '';

    peliculasPorCategoria.classList.remove('desactivado');
    categoriaTitulo.classList.remove('desactivado');
    volverBtnCategoria.classList.remove('desactivado');
    buscadorEnCategoria.classList.remove('desactivado');
    buscadorInputEnCategoria.classList.remove('desactivado');
    botonDeBusquedaEnCategoria.classList.remove('desactivado'); 
    categoriaTitulo.classList.add('desactivado');

    //descativar la pagina principal
    contenedorPrincipal.classList.add('desactivado');  
    contenedorCategoria.classList.add('desactivado');
    tendenciasTitulo.classList.add('desactivado');
    categoriasTitulo.classList.add('desactivado');
    tendenciasWrapper.classList.add('desactivado');
    generosWrapper.classList.add('desactivado');
    separador1.classList.add('desactivado');
    favoritasTitulo.classList.add('desactivado');
    wrapperPeliculasFavoritas.classList.add('desactivado');
    listaPeliculasFavoritas.classList.add('desactivado');

    //desactivar pelicula especifica
    informacionPelicula.classList.add('desactivado');

    //desactivar todas las tendencias
    todasLasTendencias.classList.add('desactivado');

   const [_, query] = location.hash.split('=')
    
   
   getSearchMovies(query);
  infiniteScroll = getSearchMoviesPaginated(query);
  window.addEventListener('scroll', infiniteScroll, { passive: false });
}
function trendsPage() {
     todasLasTendencias.classList.remove('desactivado');

      //desactivar pelicula especifica
    informacionPelicula.classList.add('desactivado');
    

    //desactivar pagina de categorias
    volverBtnCategoria.classList.add('desactivado');
    categoriaTitulo.classList.add('desactivado');
    peliculasPorCategoria.classList.add('desactivado'); 

    //descativar la pagina principal
    contenedorPrincipal.classList.add('desactivado');  
    contenedorCategoria.classList.add('desactivado');
    tendenciasTitulo.classList.add('desactivado');
    categoriasTitulo.classList.add('desactivado');
    tendenciasWrapper.classList.add('desactivado');
    generosWrapper.classList.add('desactivado');
    separador1.classList.add('desactivado');
    favoritasTitulo.classList.add('desactivado');
    wrapperPeliculasFavoritas.classList.add('desactivado');
    listaPeliculasFavoritas.classList.add('desactivado');

    getTrendingMovies()
    infiniteScroll=getTrendingMoviesPaginated;
    window.addEventListener('scroll', infiniteScroll, { passive: false });

}