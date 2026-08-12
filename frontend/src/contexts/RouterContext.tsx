import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

function currentPath(): string {
  const hash = window.location.hash.replace(/^#/, '')
  return hash || '/'
}

interface RouterContextValue {
  path: string
  params: Record<string, string>
  navigate: (path: string) => void
}

const RouterContext = createContext<RouterContextValue | undefined>(undefined)

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(currentPath())

  useEffect(() => {
    const onHashChange = () => setPath(currentPath())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function navigate(next: string) {
    window.location.hash = next
    setPath(next)
  }

  // Parse a trailing `?query=value` segment into params without extra deps.
  const [base, query] = path.split('?')
  const params: Record<string, string> = {}
  if (query) {
    new URLSearchParams(query).forEach((value, key) => {
      params[key] = value
    })
  }

  return (
    <RouterContext.Provider value={{ path: base, params, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within RouterProvider')
  return ctx
}
