export const TMDB_CONFIG = {
  API_KEY: '400e155942366204540341b0b6454cb',
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE: 'https://image.tmdb.org/t/p',
  POSTER_SIZE: 'w500',
  BACKDROP_SIZE: 'w1280',
};

/**
 * @param {string|null} posterPath
 * @returns {string|null}
 */
export const getPosterUrl = (posterPath) => {
  if (!posterPath) return null;
  return `${TMDB_CONFIG.IMAGE_BASE}/${TMDB_CONFIG.POSTER_SIZE}${posterPath}`;
};

/**
 * @param {string|null} backdropPath
 * @returns {string|null}
 */
export const getBackdropUrl = (backdropPath) => {
  if (!backdropPath) return null;
  return `${TMDB_CONFIG.IMAGE_BASE}/${TMDB_CONFIG.BACKDROP_SIZE}${backdropPath}`;
};
