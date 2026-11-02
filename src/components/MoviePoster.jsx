import { useState } from 'react';
import { Film } from 'lucide-react';

import { getPosterUrl } from '../api/tmdbConfig';


export const MoviePoster = ({
  posterPath,
  title,
  className = '',
  priority = false,
  aspectRatio = 'aspect-[2/3]',
}) => {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getPosterUrl(posterPath);

  if (!imageUrl || hasError) {
    return (
      <div
        className={`w-full ${aspectRatio} bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-3 text-slate-400 select-none ${className}`}
        aria-label={title || 'Movie Poster Placeholder'}
      >
        <Film className="w-10 h-10 mb-2 text-slate-600 stroke-[1.5]" />
        <span className="text-xs font-medium text-center line-clamp-2 text-slate-400">
          {title || 'No Image'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectRatio} bg-slate-900 overflow-hidden ${className}`}>
      <img
        src={imageUrl}
        alt={`Poster of ${title}`}
        loading="eager"
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
};
