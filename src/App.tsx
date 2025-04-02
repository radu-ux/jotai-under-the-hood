import React from 'react'
import { atom } from './lib/atom'
import { useAtom, useAtomValue } from './lib/useAtom'
import { StoreProvider } from './lib/provider'

const countAtom = atom(0)
const doubledAtom = atom((get) => get(countAtom) * 2)

function Parent({ children }: React.PropsWithChildren) {
  return (
    <div>
      <h1>Parent</h1>
      {children}
    </div>
  )
}

function Counter() {
  const [count, setCount] = useAtom(countAtom)

  const onClick = () => {
    setCount(count + 1)
  }

  return (
    <div>
      <h2>Child {count}</h2>
      <button onClick={onClick}>Increment</button>
    </div>
  )
}

function DoubleCounter() {
  const doubledCount = useAtomValue(doubledAtom)

  return <h2>Sibling {doubledCount}</h2>
}

function App() {
  return (
    <StoreProvider>
      <Parent>
        <Counter />
        <DoubleCounter />
      </Parent>
    </StoreProvider>
  )
}

export default App
