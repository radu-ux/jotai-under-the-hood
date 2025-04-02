/* eslint-disable @typescript-eslint/no-explicit-any */

import { Atom } from './atom'

type AtomState<T> = {
  v: T
  s: Set<() => void>
  d: Set<Atom<any>>
}
export type Store = {
  sub: <T>(atom: Atom<T>, listener: () => void) => () => void
  get: <T>(atom: Atom<T>) => T
  set: <T>(atom: Atom<T>, value: T) => void
}

export function getDefaultStore(): Store {
  const atomsStateMap = new Map<
    Atom<any>,
    { v: any; s: Set<() => void>; d: Set<Atom<any>> }
  >()
  const createAtomState = (atom: Atom<any>) => {
    const atomState: AtomState<any> = {
      v:
        atom.init ??
        atom.read((dependecyAtom) => {
          const dependecyAtomState = atomsStateMap.get(dependecyAtom)
          dependecyAtomState?.d.add(atom)

          return dependecyAtom.read(store.get)
        }),
      s: new Set(),
      d: new Set(),
    }

    atomsStateMap.set(atom, atomState)

    return atomsStateMap.get(atom)!
  }

  const store: Store = {
    sub<T>(atom: Atom<T>, l: () => void) {
      let atomState = atomsStateMap.get(atom)

      if (!atomState) {
        atomState = createAtomState(atom)
      }

      atomState.s.add(l)

      return () => {
        atomState.s.delete(l)
      }
    },
    set<T>(atom: Atom<T>, value: T) {
      let atomState = atomsStateMap.get(atom)

      if (!atomState) {
        atomState = createAtomState(atom)
      }

      atomState.v = value
      atomState.s.forEach((l) => l())
      atomState.d.forEach((dependent) => {
        const dependentValue = atomsStateMap.get(dependent)
        dependentValue?.s.forEach((l) => {
          l()
        })
      })
    },
    get<T>(atom: Atom<T>) {
      let atomState = atomsStateMap.get(atom)

      if (!atomState) {
        atomState = createAtomState(atom)
      }

      if (atom.init !== undefined) {
        return atomState.v
      }

      return atom.read(store.get)
    },
  }

  return store
}
