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
  const addMovieForm = document.getElementById('add-movie-form'); // Referencia al formulario

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
        const movieElement = createMovieElement(movie);

        movieElement.querySelector('.boton-favoritos').addEventListener('click', async (event) => {
          await addToFavorites(event, movie.id);
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

  // Oyente de eventos para el formulario
  addMovieForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir la recarga de la página

    const movieIdInput = document.getElementById('movie-input');
    const movieId = movieIdInput.value.trim();

    if (!movieId) {
      showMessage('error-message', 'Debe ingresar un ID de película.');
      return;
    }

    const movie = await getMovieByIdFromAPI(movieId);
    if (!movie) {
      showMessage('error-message', 'No se encontró ninguna película con ese ID.');
      return;
    }

    const newEvent = {
      preventDefault: () => {},
      target: {
        parentNode: createMovieElement(movie),
      },
    };
    await addToFavorites(newEvent, movie.id);

    movieIdInput.value = '';
  });

  updateMoviesPage(currentPage);
});

/*Bloque 4*/
async function addToFavorites(event, movieCode) {
  event.preventDefault();

  const favorites = JSON.parse(localStorage.getItem('FAVORITOS')) || [];
  const movieElement = event.target.parentNode;
  const movieInfo = getMovieInfoFromElement(movieElement);

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

// Esta nueva función crea un elemento de película a partir de los datos de una película
function createMovieElement(movie) {
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

  return movieElement;
}

// Esta nueva función obtiene la información de una película a partir de un elemento de película
function getMovieInfoFromElement(movieElement) {
  return {
    poster_path: movieElement.querySelector('img').getAttribute('src'),
    title: movieElement.querySelector('h3').textContent.trim(),
    id: parseInt(movieElement.querySelector('p:nth-child(3)').textContent.replace('Código: ', '').trim()),
    original_title: movieElement.querySelector('p:nth-child(4)').textContent.replace('Título: ', '').trim(),
    original_language: movieElement.querySelector('p:nth-child(5)').textContent.replace('Idioma: ', '').trim(),
    release_date: movieElement.querySelector('p:nth-child(6)').textContent.replace('Año: ', '').trim()
  };
}
