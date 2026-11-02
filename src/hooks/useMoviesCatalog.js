import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useExperiment } from '../context/ExperimentContext';


export const useMoviesCatalog = () => {
  const { isCacheOn, limit, reportFetchMetrics } = useExperiment();

  const [nativeData, setNativeData] = useState([]);
  const [nativeLoading, setNativeLoading] = useState(false);
  const [nativeError, setNativeError] = useState(null);

  const queryResult = useQuery({
    queryKey: ['movies', limit],
    queryFn: async () => {
      const startTime = performance.now();
      const response = await fetch(`/api/movies?limit=${limit}`);
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        throw new Error(`Respons tidak valid (HTTP ${response.status}, Content-Type: ${contentType})`);
      }
      const data = await response.json();
      const duration = Math.round(performance.now() - startTime);
      reportFetchMetrics({
        durationMs: duration,
        isCached: false,
        engine: 'TanStack Query v5 (SWR Network)',
      });
      return data;
    },
    enabled: isCacheOn,
  });

  useEffect(() => {
    if (isCacheOn) return;

    let isMounted = true;
    setNativeLoading(true);
    setNativeError(null);

    const startTime = performance.now();
    fetch(`/api/movies?limit=${limit}`)
      .then((res) => {
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('application/json')) {
          throw new Error(`Respons bukan JSON (HTTP ${res.status}, Content-Type: ${contentType})`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          const duration = Math.round(performance.now() - startTime);
          setNativeData(data);
          setNativeLoading(false);
          reportFetchMetrics({
            durationMs: duration,
            isCached: false,
            engine: 'Native fetch() (useEffect)',
          });
        }
      })
      .catch((err) => {
        if (isMounted) {
          setNativeError(err);
          setNativeLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isCacheOn, limit, reportFetchMetrics]);

  if (isCacheOn) {
    return {
      movies: queryResult.data || [],
      isLoading: queryResult.isLoading,
      isFetching: queryResult.isFetching,
      error: queryResult.error,
      isCached: Boolean(queryResult.data && !queryResult.isLoading),
      mode: 'TanStack Query v5 (SWR)',
    };
  }

  return {
    movies: nativeData,
    isLoading: nativeLoading,
    isFetching: nativeLoading,
    error: nativeError,
    isCached: false,
    mode: 'Native fetch() in useEffect',
  };
};
