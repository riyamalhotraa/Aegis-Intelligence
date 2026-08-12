import { useCallback, useEffect, useRef, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Runs an async fetcher on mount (and whenever `deps` change), exposing
 * loading / success / error / empty states plus a manual `refetch`.
 */
export function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })
  const mounted = useRef(true)

  const run = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }))
    fetcher()
      .then((data) => {
        if (mounted.current) setState({ data, loading: false, error: null })
      })
      .catch((err: Error) => {
        if (mounted.current) setState({ data: null, loading: false, error: err.message || 'Something went wrong.' })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    mounted.current = true
    run()
    return () => {
      mounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ...state, refetch: run, setData: (d: T) => setState((s) => ({ ...s, data: d })) }
}
