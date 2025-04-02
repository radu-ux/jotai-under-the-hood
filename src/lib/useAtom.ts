import React from 'react'
import { useStore } from './usseStore'
import { Atom } from './atom'

export function useAtomValue<T>(atom: Atom<T>) {
  const store = useStore()
  const sub = React.useCallback(
    (l: () => void) => {
      return store.sub(atom, l)
    },
    [store, atom]
  )
  const getSnapshot = React.useCallback(() => {
    return store.get(atom)
  }, [store, atom])

  return React.useSyncExternalStore(sub, getSnapshot)
}

export function useAtomSet<T>(atom: Atom<T>) {
  const store = useStore()
  const set = React.useCallback(
    (value: T) => {
      atom.write(store.set, value)
    },
    [store, atom]
  )

  return set
}

export function useAtom<T>(atom: Atom<T>) {
  return [useAtomValue(atom), useAtomSet(atom)] as const
}
