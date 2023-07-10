window.addEventListener('DOMContentLoaded', async () => {
  try {
    const movies = await getNowPlayingMoviesFromAPI();
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
  } catch (error) {
    console.error('Error al obtener las películas:', error);
  }
});

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

  // Validar si el valor ingresado es numérico
  if (isNaN(movieInfo.id)) {
    showMessage('error-message', 'El código ingresado debe ser numérico');
    return;
  }

  // Validar si la película ya ha sido ingresada
  const existingMovie = favorites.find(movie => movie.id === movieInfo.id);
  if (existingMovie) {
    showMessage('error-message', 'La película ingresada ya se encuentra almacenada');
    return;
  }

  // Agregar película a favoritos
  favorites.push(movieInfo);
  localStorage.setItem('FAVORITOS', JSON.stringify(favorites));
  showMessage('success-message', 'Película agregada con éxito');

  const successMessage = document.querySelector('.success-message');
  successMessage.scrollIntoView({ behavior: 'smooth' });

  // Enviar mensaje al archivo favorities.js para mostrar el mensaje de éxito
  window.postMessage({ type: 'success', message: 'Película agregada con éxito' }, '*');
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

