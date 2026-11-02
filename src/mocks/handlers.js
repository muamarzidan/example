import { http, HttpResponse, delay } from 'msw';

import movies200 from './data/movies_200.json';
import movies400 from './data/movies_400.json';
import movies600 from './data/movies_600.json';


const datasets = {
  200: movies200,
  400: movies400,
  600: movies600,
};

const movieMap = new Map();
movies600.forEach((movie) => {
  movieMap.set(String(movie.id), movie);
});

export const handlers = [
  http.get('/api/movies', async ({ request }) => {
    await delay(150);

    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = parseInt(limitParam || '200', 10);

    const data = datasets[limit] || datasets[200];
    return HttpResponse.json(data);
  }),

  http.get('/api/movies/:id', async ({ params }) => {
    await delay(150);

    const { id } = params;
    const movie = movieMap.get(String(id));

    if (!movie) {
      return HttpResponse.json(
        { message: `Movie with id ${id} not found.` },
        { status: 404 }
      );
    }

    return HttpResponse.json(movie);
  }),
];
