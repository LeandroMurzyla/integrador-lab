
window.addEventListener('DOMContentLoaded', async () => {
  try {
    updateFavoritesList();

    const addMovieForm = document.getElementById('add-movie-form');
    addMovieForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const movieInput = document.getElementById('movie-input');
      const movieCode = movieInput.value.trim();
      await addToFavorites(movieCode);
      movieInput.value = ''; // Limpiar el campo de texto después de agregar la película
    });
  } catch (error) {
    console.error('Error al obtener los favoritos:', error);
  }
});

async function updateFavoritesList() {
  const favorites = JSON.parse(localStorage.getItem('FAVORITOS')) || [];
  const favoritesContainer = document.getElementById('sect-favorities-list');

  favoritesContainer.innerHTML = ''; // Limpiar contenido previo

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p>Su lista de favoritos está vacía.</p>';
    return;
  }

  for (const movie of favorites) {
    const { poster_path, title, id, original_title, original_language, release_date } = movie;

    const movieElement = document.createElement('div');
    movieElement.classList.add('contenedorPeliculasFavoritas');

    movieElement.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500/${poster_path}" alt="Imagen de la película" />
      <h3>${title}</h3>
      <p><strong>Código:</strong> ${id}</p>
      <br />
      <p><strong>Título:</strong> ${original_title}</p>
      <p><strong>Idioma:</strong> ${original_language}</p>
      <p>${release_date}</p>
      <div class="video-container"></div>
      <button class="boton-quitar">Quitar de favoritos</button>
    `;

    const removeButton = movieElement.querySelector('.boton-quitar');
    removeButton.addEventListener('click', async (event) => {
      await removeFromFavorites(event, id);
    });

    favoritesContainer.appendChild(movieElement);

    await addVideoToMovie(id, movieElement);
  }
}

async function addVideoToMovie(movieId, movieElement) {
  try {
    const videos = await getVideosForMovie(movieId);
    const videoContainer = movieElement.querySelector('.video-container');

    if (videos.length > 0) {
      const videoKey = videos[0].key;
      const videoIframe = createVideoIframe(videoKey);
      videoContainer.appendChild(videoIframe);
    } else {
      videoContainer.innerHTML = '<p>No se encontraron videos para esta película.</p>';
    }
  } catch (error) {
    console.error(`Error al obtener los videos para la película con ID ${movieId}:`, error);
  }
}

function createVideoIframe(videoKey) {
  const iframe = document.createElement('iframe');
  iframe.width = '560';
  iframe.height = '315';
  iframe.src = `https://www.youtube.com/embed/${videoKey}`;
  iframe.allowFullscreen = true;

  return iframe;
}

async function getVideosForMovie(movieId) {
  const apiKey = '779b1b25b7b8aec6a5757f06fce23985';
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (response.ok) {
    return data.results;
  } else {
    throw new Error(data.status_message || 'Error al obtener los videos de la película');
  }
}

async function addToFavorites(movieCode) {
  const movies = await getNowPlayingMoviesFromAPI();
  const movie = movies.find((movie) => movie.id === Number(movieCode));

  if (!movie) {
    showMessage('error-message', 'El código ingresado no corresponde a una película válida.');
    return;
  }

  const favorites = JSON.parse(localStorage.getItem('FAVORITOS')) || [];
  const existingMovie = favorites.find((favMovie) => favMovie.id === movie.id);

  if (existingMovie) {
    showMessage('error-message', 'La película ya se encuentra en la lista de favoritos.');
    return;
  }

  favorites.push(movie);
  localStorage.setItem('FAVORITOS', JSON.stringify(favorites));

  showMessage('success-message', 'Película agregada a favoritos.');

  updateFavoritesList();
}

async function removeFromFavorites(event, movieId) {
  const favorites = JSON.parse(localStorage.getItem('FAVORITOS')) || [];
  const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);

  localStorage.setItem('FAVORITOS', JSON.stringify(updatedFavorites));

  const movieElement = event.target.parentNode;
  movieElement.parentNode.removeChild(movieElement);

  showMessage('success-message', 'Película eliminada de favoritos.');

  if (updatedFavorites.length === 0) {
    const favoritesContainer = document.getElementById('sect-favorities-list');
    favoritesContainer.innerHTML = '<p>Su lista de favoritos está vacía.</p>';
  }
}

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
