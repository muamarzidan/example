import { Link } from 'react-router-dom';

import { useExperiment } from '../context/ExperimentContext';


export const Header = () => {
  const { isCacheOn, toggleCache, limit, setLimit, queryString, metrics } = useExperiment();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 shadow-2xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to={`/${queryString}`} className="flex items-center gap-2.5 group">
              <span className="font-extrabold tracking-wider text-slate-100 text-lg group-hover:text-amber-400 transition-colors">
                MOVIE<span className="text-amber-400">META DATA</span>
              </span>
            </Link>
          </div>

          {/* Controls: Cache Switch & Dataset Selector */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Cache Toggle Control */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-1 shadow-inner">
              <button
                type="button"
                id="btn-cache-off"
                onClick={() => toggleCache(false)}
                className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  !isCacheOn
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 ring-1 ring-rose-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mode Native fetch() di useEffect() tanpa caching"
              >
                <span>Cache OFF</span>
              </button>

              <button
                type="button"
                id="btn-cache-on"
                onClick={() => toggleCache(true)}
                className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isCacheOn
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 ring-1 ring-emerald-300 font-extrabold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mode @tanstack/react-query v5 SWR caching"
              >
                <span>Cache ON</span>
              </button>
            </div>
            {/* Dataset Limit Selector */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-md px-2.5 py-1.5">
              <label htmlFor="limit-select" className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <span className="hidden sm:inline">Beban:</span>
              </label>
              <select
                id="limit-select"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value={200} className="bg-slate-900 text-slate-200">200 Entri</option>
                <option value={400} className="bg-slate-900 text-slate-200">400 Entri</option>
                <option value={600} className="bg-slate-900 text-slate-200">600 Entri</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Status Ribbon Bar (Indikator Status Aktif) */}
        {/* <div className="py-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium border ${
              isCacheOn
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                : 'bg-rose-950/60 text-rose-300 border-rose-800/50'
            }`}>
              <span>
                Mode: <strong className="font-bold">{isCacheOn ? 'TanStack Query (SWR)' : 'Native fetch() (useEffect)'}</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium bg-slate-900 text-slate-300 border border-slate-800">
              <span>
                Dataset: <strong className="font-bold text-amber-400">{limit} Items</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium bg-blue-950/50 text-blue-300 border border-blue-900/50">
              <span>MSW Latency: <strong>50ms</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            {metrics.lastDurationMs !== null && (
              <span className="hidden md:inline font-mono text-[11px] bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                Waktu Fetch: <strong className="text-amber-400">{metrics.lastDurationMs}ms</strong>
              </span>
            )}
            <span className="text-[10px] text-slate-400 hidden lg:inline">
              {isCacheOn
                ? 'Navigasi kembali: Data langsung dari cache (No Loading)'
                : 'Navigasi kembali: Refetch ke MSW (Loading)'}
            </span>
          </div>
        </div> */}
      </div>
    </header>
  );
};
