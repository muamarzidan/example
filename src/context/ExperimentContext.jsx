import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';


const ExperimentContext = createContext(null);

const STORAGE_KEYS = {
  CACHE_MODE: 'movie_csr_isCacheOn',
  DATA_LIMIT: 'movie_csr_limit',
};

const VALID_LIMITS = [200, 400, 600];

function getInitialCacheMode() {
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cacheParam = params.get('cache');
      if (cacheParam === 'on' || cacheParam === 'true') return true;
      if (cacheParam === 'off' || cacheParam === 'false') return false;
    }
    const saved = localStorage.getItem(STORAGE_KEYS.CACHE_MODE);
    return saved !== null ? JSON.parse(saved) : false;
  } catch (e) {
    console.warn('Failed to read initial isCacheOn:', e);
    return false;
  }
}

function getInitialLimit() {
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const limitParam = parseInt(params.get('limit') || '', 10);
      if (VALID_LIMITS.includes(limitParam)) {
        return limitParam;
      }
    }
    const saved = localStorage.getItem(STORAGE_KEYS.DATA_LIMIT);
    const parsed = saved ? parseInt(saved, 10) : 200;
    return VALID_LIMITS.includes(parsed) ? parsed : 200;
  } catch (e) {
    console.warn('Failed to read initial limit:', e);
    return 200;
  }
}

function syncUrlAndStorage(isCacheOn, limit) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CACHE_MODE, JSON.stringify(isCacheOn));
    localStorage.setItem(STORAGE_KEYS.DATA_LIMIT, String(limit));
  } catch (e) {
    console.warn('Failed to sync experiment state to localStorage:', e);
  }

  try {
    const url = new URL(window.location.href);
    url.searchParams.set('cache', isCacheOn ? 'on' : 'off');
    url.searchParams.set('limit', String(limit));
    window.history.replaceState(window.history.state, '', `${url.pathname}?${url.searchParams.toString()}`);
  } catch (e) {
    console.warn('Failed to sync experiment state to URL:', e);
  }
}

export const ExperimentProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [isCacheOn, setIsCacheOn] = useState(getInitialCacheMode);
  const [limit, setLimit] = useState(getInitialLimit);

  useEffect(() => {
    syncUrlAndStorage(isCacheOn, limit);
  }, [isCacheOn, limit]);

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
    if (VALID_LIMITS.includes(parsed)) {
      setLimit(parsed);
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

  const queryString = `?cache=${isCacheOn ? 'on' : 'off'}&limit=${limit}`;

  const value = {
    isCacheOn,
    limit,
    queryString,
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
