import React from 'react'
import { StoreContext } from './provider'

export function useStore() {
  const ctx = React.useContext(StoreContext)

  if (!ctx) {
    throw new Error('useStore() should be used inside <StoreProvider />')
  }

  return ctx.store
}
