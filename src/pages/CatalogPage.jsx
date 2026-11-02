import { Loader2, AlertCircle, Film } from 'lucide-react';

import { useMoviesCatalog } from '../hooks/useMoviesCatalog';
import { MovieCard } from '../components/MovieCard';


export const CatalogPage = () => {
  const { movies, isLoading, isFetching, error, isCached, mode } = useMoviesCatalog();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero / Experiment Introduction */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Katalog Metadata Film
            </h1>
          </div>
        </div>
      </section>
      {/* Loading State */}
      {isLoading && (
        <section className="py-24 flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-amber-400 animate-spin" />
            <Loader2 className="w-8 h-8 text-amber-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-slate-100">
            Mengambil Data Katalog dari MSW...
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-md">
            Menunggu artificial delay 50ms. Pada mode Cache OFF, status loading ini muncul di setiap navigasi / remount.
          </p>
          <div className="mt-4 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400">
            Engine: {mode}
          </div>
        </section>
      )}
      {/* Error State */}
      {!isLoading && error && (
        <section className="p-8 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-center max-w-xl mx-auto my-12">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-rose-200">Terjadi Kesalahan Fetching</h2>
          <p className="text-sm text-rose-300/80 mt-1">{error.message}</p>
        </section>
      )}
      {/* Empty State */}
      {!isLoading && !error && movies.length === 0 && (
        <section className="py-20 text-center text-slate-400">
          <Film className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-base font-semibold">Tidak ada data film.</p>
        </section>
      )}
      {/* Full Grid Into DOM */}
      {!isLoading && !error && movies.length > 0 && (
        <section aria-label="Daftar Film Utama">
          {/* Subtle background revalidating indicator (SWR) */}
          {isFetching && isCached && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-center justify-between animate-pulse">
              <span>Konten langsung disajikan dari TanStack Cache (SWR). Revalidasi latar belakang sedang berlangsung...</span>
              <span className="font-mono font-bold">50ms delay</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                index={index}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
