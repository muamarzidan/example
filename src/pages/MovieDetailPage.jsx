import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { MovieBackdrop } from '../components/MovieBackdrop';
import { MoviePoster } from '../components/MoviePoster';
import {
  ArrowLeft,
  Star,
  Calendar,
  Eye,
  TrendingUp,
  Globe,
  Loader2,
  AlertCircle,
  Film,
  Sparkles,
} from 'lucide-react';

export const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movie, isLoading, error, mode } = useMovieDetail(id);

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-amber-400 animate-spin" />
          <Loader2 className="w-8 h-8 text-amber-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <h2 className="mt-6 text-xl font-bold text-slate-100">
          Memuat Detail Film dari MSW...
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Latency 50ms sedang disimulasikan. Mode: {mode}
        </p>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-100">Film Tidak Ditemukan</h1>
          <p className="text-sm text-slate-400 mt-2">
            {error?.message || `Film dengan ID ${id} tidak ada dalam dataset aktif.`}
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cursor-pointer mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </button>
        </div>
      </main>
    );
  }

  const formattedRating = typeof movie.vote_average === 'number'
    ? movie.vote_average.toFixed(1)
    : 'N/A';

  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : '-';

  return (
    <main className="relative pb-16">
      {/* Hero Backdrop */}
      <section className="relative w-full">
        <MovieBackdrop
          backdropPath={movie.backdrop_path}
          title={movie.title}
          priority={true}
        />

        {/* Back Button Floating on Hero */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <button
            type="button"
            id="btn-back-catalog"
            onClick={() => navigate('/')}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-200 hover:text-white backdrop-blur-md border border-slate-700/80 shadow-lg text-sm font-semibold transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Kembali ke Katalog</span>
          </button>
        </div>
      </section>

      {/* Main Content Info Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Main Poster Card */}
          <div className="w-48 sm:w-64 md:w-72 flex-shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl shadow-black/80 bg-slate-900">
            <MoviePoster
              posterPath={movie.poster_path}
              title={movie.title}
              priority={true}
              aspectRatio="aspect-[2/3]"
            />
          </div>

          {/* Details & Overview */}
          <div className="flex-1 text-slate-200">
            {/* Title & Release */}
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {movie.title}
              </h1>
              {releaseYear !== '-' && (
                <span className="text-2xl sm:text-3xl text-slate-400 font-light">
                  ({releaseYear})
                </span>
              )}
            </div>

            {movie.original_title && movie.original_title !== movie.title && (
              <p className="text-sm text-slate-400 italic mt-1">
                Judul Asli: {movie.original_title}
              </p>
            )}

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              {/* Rating */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-extrabold shadow-sm">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span>{formattedRating} / 10</span>
                <span className="text-xs font-normal text-amber-400/80">
                  ({movie.vote_count || 0} ulasan)
                </span>
              </div>

              {/* Popularity */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-sm font-semibold">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Popularitas: {movie.popularity?.toFixed(1) || 'N/A'}</span>
              </div>

              {/* Release Date */}
              {movie.release_date && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{movie.release_date}</span>
                </div>
              )}

              {/* Language */}
              {movie.original_language && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium uppercase">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>{movie.original_language}</span>
                </div>
              )}
            </div>

            {/* Synopsis / Overview */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                <span>Sinopsis Film</span>
              </h2>
              <p className="mt-3 text-base text-slate-300 leading-relaxed max-w-3xl font-normal">
                {movie.overview || 'Sinopsis belum tersedia untuk judul film ini.'}
              </p>
            </div>

            {/* Technical Metadata Table for Benchmark */}
            <div className="mt-10 pt-8 border-t border-slate-800/80">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Metadata Entitas TMDB
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">ID TMDB</span>
                  <span className="text-sm font-mono font-bold text-slate-200">{movie.id}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Total Suara</span>
                  <span className="text-sm font-mono font-bold text-slate-200">{movie.vote_count ?? '-'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Kategori Usia</span>
                  <span className="text-sm font-bold text-slate-200">
                    {movie.adult ? 'Dewasa (18+)' : 'Semua Umur'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Bahasa Asli</span>
                  <span className="text-sm font-bold text-slate-200 uppercase">
                    {movie.original_language || '-'}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
};
