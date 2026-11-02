import { Link } from 'react-router-dom';
import { Star, Calendar, Flame } from 'lucide-react';

import { MoviePoster } from './MoviePoster';


export const MovieCard = ({ movie, index }) => {
  const formattedRating = typeof movie.vote_average === 'number'
    ? movie.vote_average.toFixed(1)
    : 'N/A';
  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : '-';

  return (
    <article
      id={`movie-card-${movie.id}`}
      data-index={index}
      className="group relative flex flex-col bg-slate-900/80 rounded-xl overflow-hidden border border-slate-800/80 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 transform hover:-translate-y-1"
    >
      <Link to={`/movie/${movie.id}`} className="block relative focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-t-xl overflow-hidden">
        {/* Poster Image */}
        <MoviePoster
          posterPath={movie.poster_path}
          title={movie.title}
        />
        {/* Rating Badge Overlay */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md border border-slate-700/60 text-amber-400 text-xs font-bold shadow-md">
          <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
          <span>{formattedRating}</span>
        </div>
        {/* Popularity Badge */}
        {movie.popularity > 500 && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-600/90 text-white text-[10px] font-semibold tracking-wider uppercase shadow-md">
            <Flame className="w-2.5 h-2.5" />
            <span>Hot</span>
          </div>
        )}
      </Link>

      {/* Movie Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <h1
          className="text-sm font-semibold text-slate-100 hover:text-amber-400 line-clamp-1 transition-colors"
          title={movie.title}
        >
          {movie.title}
        </h1>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>{releaseYear}</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {movie.vote_count ? `${movie.vote_count} votes` : ''}
          </span>
        </div>
      </div>
    </article>
  );
};
