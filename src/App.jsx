import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ExperimentProvider } from './context/ExperimentContext';
import { Header } from './components/Header';
import { CatalogPage } from './pages/CatalogPage';
import { MovieDetailPage } from './pages/MovieDetailPage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 0,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'MOVIE_METADATA_QUERY_CACHE',
});

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ExperimentProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-['Poppins',sans-serif]">
            <Header />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<CatalogPage />} />
                <Route path="/movie/:id" element={<MovieDetailPage />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </ExperimentProvider>
    </PersistQueryClientProvider>
  );
}
