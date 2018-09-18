
/**
 * Library App
 */

 // reducer external app code
function createStore (reducer) {
  /**
 * 1. The State
 * 2. Get State
 * 3. Listen to change on state
 * 4. Update the state
 */
  
  //  1. the state
  let state
  let listeners = []

  // 2. get sate
  const getState = () => state

  // empurrar para a função o listeners o parametro retornado
  // 3. Listen to change on state
  const subscribe = (listener) => {
    listeners.push(listener)

    return () => {
      listeners = listeners.filter((l) => l !== listeners)
    }
  }

  // dispatch responsavel por atualizar o estado
  const dispatch = (action) {
    // sera o que recebermos do estado de volta
    // state = todos(state,action)
    state = reducer(state,action)
    // Realiza o loop para set em cada listener
    listeners.forEach((listener) => listerner()) 
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}

// // return the function
// const store = createStore()

// // GET store function params
// store.Subscribe(() => {
//   console.log('This is new states is:', getState())
// }) 
// // change store function params UN
// const unsuscribe = store.Subscribe(() => {
//   console.log('This state changed')
// })   


/**
 * App Code 
 */

// state undefined, então seta um array usando padrao do es6
// 3. Listen to change on state
function todos(state = [], action) {
  if(action.type === 'ADD_TODO') {
    // concatena ao novo estado criando um novo array 
    return state.concat([action.todo])
  }
  return state
}