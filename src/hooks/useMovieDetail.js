import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useExperiment } from '../context/ExperimentContext';


export const useMovieDetail = (id) => {
  const { isCacheOn, reportFetchMetrics } = useExperiment();

  const [nativeMovie, setNativeMovie] = useState(null);
  const [nativeLoading, setNativeLoading] = useState(false);
  const [nativeError, setNativeError] = useState(null);

  const queryResult = useQuery({
    queryKey: ['movie', String(id)],
    queryFn: async () => {
      const startTime = performance.now();
      const response = await fetch(`/api/movies/${id}`);
      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        throw new Error(`Respons detail film tidak valid (HTTP ${response.status}, Content-Type: ${contentType})`);
      }
      const data = await response.json();
      const duration = Math.round(performance.now() - startTime);
      reportFetchMetrics({
        durationMs: duration,
        isCached: false,
        engine: 'TanStack Query v5 (Movie Detail Network)',
      });
      return data;
    },
    enabled: isCacheOn && Boolean(id),
  });

  useEffect(() => {
    if (isCacheOn || !id) return;

    let isMounted = true;
    setNativeLoading(true);
    setNativeError(null);

    const startTime = performance.now();
    fetch(`/api/movies/${id}`)
      .then((res) => {
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || !contentType.includes('application/json')) {
          throw new Error(`Respons detail film bukan JSON (HTTP ${res.status}, Content-Type: ${contentType})`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          const duration = Math.round(performance.now() - startTime);
          setNativeMovie(data);
          setNativeLoading(false);
          reportFetchMetrics({
            durationMs: duration,
            isCached: false,
            engine: 'Native fetch() (Movie Detail)',
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
  }, [id, isCacheOn, reportFetchMetrics]);

  if (isCacheOn) {
    return {
      movie: queryResult.data || null,
      isLoading: queryResult.isLoading,
      isFetching: queryResult.isFetching,
      error: queryResult.error,
      isCached: Boolean(queryResult.data && !queryResult.isLoading),
      mode: 'TanStack Query v5 (SWR)',
    };
  }

  return {
    movie: nativeMovie,
    isLoading: nativeLoading,
    isFetching: nativeLoading,
    error: nativeError,
    isCached: false,
    mode: 'Native fetch() in useEffect',
  };
};
