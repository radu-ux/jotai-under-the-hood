export type Getter = <T>(atom: Atom<T>) => T
export type Setter = <T>(atom: Atom<T>, value: T) => void
type Read<T> = (get: Getter) => T
type Write<T> = (set: Setter, value: T) => void
export type Atom<T> = { init?: T; read: Read<T>; write: Write<T> }
type InitialValue<T> = T | Read<T>

function defaultRead<T>(this: Atom<T>, get: Getter) {
  return get(this)
}
function defaultWrite<T>(this: Atom<T>, set: Setter, value: T) {
  set(this, value)
}
export function atom<T>(initialValue: InitialValue<T>): Atom<T> {
  if (typeof initialValue === 'function') {
    return {
      read: initialValue as Read<T>,
      write: () => {
        throw new Error('atom is readonly')
      },
    }
  } else {
    return { init: initialValue, read: defaultRead, write: defaultWrite }
  }
}
