/**
 * 
 * 
 * Library App
 * 
 * 
 * 
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
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  // dispatch responsavel por atualizar o estado
  const dispatch = (action) => {
    // sera o que recebermos do estado de volta
    // state = todos(state,action)
    state = reducer(state,action)
    // Realiza o loop para set em cada listener
    listeners.forEach((listener) => listener()) 
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}

/**
 * 
 * 
 * App Code (reduce)
 * 
 * 
 */

//  declaração para tornar mais previsivel as variaveis
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'


// resume todas as actions do dispatch em funções
function addTodoAction (todo) {
  return {
    type: ADD_TODO,
    todo,
  }
}

function removeTodoAction (id) {
  return {
    type: REMOVE_TODO,
    id,
  }
}

function toggleTodoAction (id) {
  return {
    type: TOGGLE_TODO,
    id,
  }
}

function addGoalAction (goal) {
  return {
    type: ADD_GOAL,
    goal,
  }
}

function removeGoalAction (id) {
  return {
    type: REMOVE_GOAL,
    id,
  }
}


// state undefined, então seta um array usando padrao do es6
// 3. Listen to change on state
function todos (state = [], action) {
  switch(action.type) {
    // concatena ao novo estado criando um novo array 
    case ADD_TODO :
      return state.concat([action.todo])
    case REMOVE_TODO :
      return state.filter((todo) => todo.id !== action.id)
    // object.assign cria um novo objeto, do TODO com resultado diferente do atual false = true
    case TOGGLE_TODO :
      return state.map((todo) => todo.id !== action.id ? todo :
        Object.assign({}, todo, { complete: !todo.complete }))
    default :
      return state
  }
}

// Lista de metas
function goals (state = [], action) {
  switch(action.type) {
    case ADD_GOAL :
      return state.concat([action.goal])
    case REMOVE_GOAL :
      return state.filter((goal) => goal.id !== action.id)
    default :
      return state
  }
}


// A store não pode receber mais de um parametro então é feito uma func para armazenar estes reducers agrupados no cmbine reduce
// da mesma forma ao iniciar o state deve estar com objeto vazio
function app (state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
  }
}

// Função dos retornos
const store = createStore(app)

// adiciona o metod subscribe e getState
store.subscribe(()=> {
  console.log('this new state is : ', store.getState())
})

// dispatch de uma ação a ser executada
// store.dispatch({
//   type: ADD_TODO,
//   todo: {
//     id: 0,
//     name: 'Learn Redux',
//     complete: false
//   }
// })

store.dispatch(addTodoAction({
  id: 0,
  name: 'Walk the dog',
  complete: false,
}))

store.dispatch(addTodoAction({
  id: 1,
  name: 'Wash the car',
  complete: false,
}))

store.dispatch(addTodoAction({
  id: 2,
  name: 'Go to the gym',
  complete: true,
}))

store.dispatch(removeTodoAction(1))

store.dispatch(toggleTodoAction(0))

store.dispatch(addGoalAction({
  id: 0,
  name: 'Learn Redux'
}))

store.dispatch(addGoalAction({
  id: 1,
  name: 'Lose 20 pounds'
}))

store.dispatch(removeGoalAction(0))