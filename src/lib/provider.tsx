import React from 'react'
import { getDefaultStore, Store } from './store'

export const StoreContext = React.createContext<{ store: Store } | null>(null)

export function StoreProvider({ children }: React.PropsWithChildren) {
  const store = React.useMemo(() => getDefaultStore(), [])

  return (
    <StoreContext.Provider value={{ store }}>{children}</StoreContext.Provider>
  )
}
