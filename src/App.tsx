import { useEffect, useReducer } from 'react'
import Header from './components/Header'
import Guitar from './components/Guitar.js'
import { cartReducer, initialState } from './reducers/cart-reducer.js'

function App() {
  //NOTA: Para un caso real de consumir un API usariamos useEffect para que consumamos el api una vez cargado el componente
  //Y posteriormente ya con setData seteamos el resultado de consumir el api

   const [state, dispatch] = useReducer(cartReducer, initialState)

   useEffect(() => {
           localStorage.setItem('cart', JSON.stringify(state.cart))
    }, [state.cart])

  return (
    <>
      <Header 
        cart={state.cart}
        dispatch={dispatch}
      />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        {/*/NOTA: Para agregar dinamismo a cada guitarra que mostramos, lo haremos utilizando props*/}
        <div className="row mt-5">
          {state.data.map(guitar => ( //Este arrow function con parentesis significa que retorna un valor
            <Guitar 
              key={guitar.id} //Clave única para cada guitarra necesaria para funcionamiento de React
              guitar={guitar}
              dispatch={dispatch}
            />
          ))}
        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>
    </>
  )
}

export default App
