import { createContext, useContext, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';


const ExperimentContext = createContext(null);

const STORAGE_KEYS = {
  CACHE_MODE: 'movie_csr_isCacheOn',
  DATA_LIMIT: 'movie_csr_limit',
};

export const ExperimentProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [isCacheOn, setIsCacheOn] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CACHE_MODE);
      return saved !== null ? JSON.parse(saved) : false;
    } catch (e) {
      console.warn('Failed to read isCacheOn from localStorage:', e);
      return false;
    }
  });

  const [limit, setLimit] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DATA_LIMIT);
      const parsed = saved ? parseInt(saved, 10) : 200;
      return [200, 400, 600].includes(parsed) ? parsed : 200;
    } catch (e) {
      console.warn('Failed to read limit from localStorage:', e);
      return 200;
    }
  });

  const [metrics, setMetrics] = useState({
    lastDurationMs: null,
    lastTimestamp: null,
    fetchEngine: isCacheOn ? 'TanStack Query v5 (SWR)' : 'Native fetch() (useEffect)',
    isCachedResponse: false,
    fetchCount: 0,
  });

  const toggleCache = useCallback((newValue) => {
    setIsCacheOn((prev) => {
      const nextValue = typeof newValue === 'boolean' ? newValue : !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.CACHE_MODE, JSON.stringify(nextValue));
      } catch (e) {
        console.warn('Failed to persist isCacheOn to localStorage:', e);
      }
      if (!nextValue) {
        queryClient.clear();
        try {
          localStorage.removeItem('MOVIE_METADATA_QUERY_CACHE');
        } catch (e) {
          console.warn('Failed to clear MOVIE_METADATA_QUERY_CACHE:', e);
        }
      }
      return nextValue;
    });
  }, [queryClient]);

  const changeLimit = useCallback((newLimit) => {
    const parsed = parseInt(newLimit, 10);
    if ([200, 400, 600].includes(parsed)) {
      setLimit(parsed);
      try {
        localStorage.setItem(STORAGE_KEYS.DATA_LIMIT, String(parsed));
      } catch (e) {
        console.warn('Failed to persist limit to localStorage:', e);
      }
    }
  }, []);

  const reportFetchMetrics = useCallback(({ durationMs, isCached, engine }) => {
    setMetrics((prev) => ({
      lastDurationMs: durationMs,
      lastTimestamp: new Date().toLocaleTimeString(),
      fetchEngine: engine,
      isCachedResponse: Boolean(isCached),
      fetchCount: prev.fetchCount + 1,
    }));
  }, []);

  const value = {
    isCacheOn,
    limit,
    metrics,
    toggleCache,
    setLimit: changeLimit,
    reportFetchMetrics,
  };

  return (
    <ExperimentContext.Provider value={value}>
      {children}
    </ExperimentContext.Provider>
  );
};

export const useExperiment = () => {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperiment must be used within an ExperimentProvider');
  }
  return context;
};
