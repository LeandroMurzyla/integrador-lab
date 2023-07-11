window.addEventListener('load', () => {
  const loadingOverlay = document.getElementById('loading-overlay');
  setTimeout(() => {
    loadingOverlay.style.display = 'none';
  }, 500);
});


window.addEventListener('DOMContentLoaded', async () => {
  /*Bloque 3*/
  const btnAnterior = document.getElementById('btnAnterior');
  const btnSiguiente = document.getElementById('btnSiguiente');

  let currentPage = 1;

  async function getMoviesByPage(page) {
    const movies = await getNowPlayingMoviesFromAPI(page);
    return movies;
  }

  async function updateMoviesPage(page) {
    try {
      const movies = await getMoviesByPage(page);
      const moviesContainer = document.getElementById('sec_peliculas');

      moviesContainer.innerHTML = ''; // Limpiar contenido previo

      movies.forEach((movie) => {
        const { poster_path, title, id, original_title, original_language, release_date } = movie;

        const movieElement = document.createElement('div');
        movieElement.classList.add('pelicula');

        movieElement.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="Imagen de la película" />
          <h3>${title}</h3>
          <p><strong>Código:</strong> ${id}</p>
          <p><strong>Título:</strong> ${original_title}</p>
          <p><strong>Idioma:</strong> ${original_language}</p>
          <p><strong>Año:</strong> ${release_date}</p>
          <button class="boton-favoritos">Agregar a favoritos</button>
        `;

        movieElement.querySelector('.boton-favoritos').addEventListener('click', async (event) => {
          await addToFavorites(event, id);
        });

        moviesContainer.appendChild(movieElement);
      });

      currentPage = page;
    } catch (error) {
      console.error('Error al obtener las películas:', error);
      showMessage('error-message', 'Error al obtener las películas');
    }
  }

  btnAnterior.addEventListener('click', () => {
    if (currentPage > 1) {
      updateMoviesPage(currentPage - 1);
    }
  });

  btnSiguiente.addEventListener('click', () => {
    updateMoviesPage(currentPage + 1);
  });

  try {
    const movies = await getMoviesByPage(currentPage);
    const moviesContainer = document.getElementById('sec_peliculas');

    moviesContainer.innerHTML = '';

    movies.forEach((movie) => {
      const { poster_path, title, id, original_title, original_language, release_date } = movie;

      const movieElement = document.createElement('div');
      movieElement.classList.add('pelicula');

      movieElement.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="Imagen de la película" />
        <h3>${title}</h3>
        <p><strong>Código:</strong> ${id}</p>
        <p><strong>Título:</strong> ${original_title}</p>
        <p><strong>Idioma:</strong> ${original_language}</p>
        <p><strong>Año:</strong> ${release_date}</p>
        <button class="boton-favoritos">Agregar a favoritos</button>
      `;

      movieElement.querySelector('.boton-favoritos').addEventListener('click', async (event) => {
        await addToFavorites(event, id);
      });

      moviesContainer.appendChild(movieElement);
    });
  } catch (error) {
    console.error('Error al obtener las películas:', error);
    showMessage('error-message', 'Error al obtener las películas');
  }
});


/*Bloque 4*/
async function addToFavorites(event, movieCode) {
  event.preventDefault();

  const favorites = JSON.parse(localStorage.getItem('FAVORITOS')) || [];
  const movieElement = event.target.parentNode;
  const movieInfo = {
    poster_path: movieElement.querySelector('img').getAttribute('src'),
    title: movieElement.querySelector('h3').textContent.trim(),
    id: movieCode,
    original_title: movieElement.querySelector('p:nth-child(4)').textContent.trim(),
    original_language: movieElement.querySelector('p:nth-child(5)').textContent.trim(),
    release_date: movieElement.querySelector('p:nth-child(6)').textContent.trim()
  };

  if (isNaN(movieInfo.id)) {
    showMessage('error-message', 'El código ingresado debe ser numérico');
    return;
  }

  const existingMovie = favorites.find(movie => movie.id === movieInfo.id);
  if (existingMovie) {
    showMessage('error-message', 'La película ingresada ya se encuentra almacenada');
    return;
  }

  favorites.push(movieInfo);
  localStorage.setItem('FAVORITOS', JSON.stringify(favorites));
  showMessage('success-message', 'Película agregada con éxito');

  const successMessage = document.querySelector('.success-message');
  successMessage.scrollIntoView({ behavior: 'smooth' });

  window.postMessage({ type: 'success', message: 'Película agregada con éxito' }, '*');
}


/*Bloque 5*/
function showMessage(messageType, messageText) {
  const messagesContainer = document.getElementById('sec-messages');
  const messageElement = document.createElement('div');
  messageElement.classList.add(messageType);
  messageElement.textContent = messageText;

  messagesContainer.appendChild(messageElement);

  setTimeout(() => {
    messagesContainer.removeChild(messageElement);
  }, 3000);
}
