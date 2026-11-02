import { useState } from 'react';
import { Clapperboard } from 'lucide-react';

import { getBackdropUrl } from '../api/tmdbConfig';


export const MovieBackdrop = ({
  backdropPath,
  title,
  className = '',
  priority = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getBackdropUrl(backdropPath);

  if (!imageUrl || hasError) {
    return (
      <div
        className={`w-full aspect-[21/9] min-h-[300px] md:min-h-[460px] bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center text-slate-600 ${className}`}
      >
        <div className="flex flex-col items-center gap-2 opacity-30">
          <Clapperboard className="w-16 h-16 stroke-[1.2]" />
          <span className="text-sm font-semibold tracking-wider uppercase">
            {title || 'TMDB Hero Backdrop'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-[21/9] min-h-[300px] md:min-h-[460px] overflow-hidden bg-slate-950 ${className}`}>
      <img
        src={imageUrl}
        alt={`Backdrop for ${title}`}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-top opacity-50 filter brightness-90 contrast-110"
      />
    </div>
  );
};
