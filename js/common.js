async function getNowPlayingMoviesFromAPI() {
    const apiKey = '779b1b25b7b8aec6a5757f06fce23985';
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=es-MX&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  }
  

  window.addEventListener('load', () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 500);
  });
  