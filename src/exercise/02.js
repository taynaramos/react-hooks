// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// Para criar um custom hook (função que usa react hooks dentro dela deve iniciar com "use" por conveção
const useLocalStorageState = (
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  // usando useState Lazy Initialization o localStorage so vai ser consultado uma vez (na primeira montagem), ele ignora completamente a função () => getInitialName(initialName) a cada renderização do useEffect. Se não usasse essa abordage, o localStorage (que é lento) seria consultado toda vez que que o componente montasse novamente pq do useEffect
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage);
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  // Cada vez que você usa o hook useLocalStorageState em um componente diferente, o React cria um "espaço na memória" totalmente novo e independente para aquele componente. Logo não tem perigo de acessar prevKey de diferentes componentes.
  const prevKeyRef = React.useRef(key);

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeIem(prevKey) // para não guardar lixo no navegador
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState("name", initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
