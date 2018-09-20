 /**
       * 
       * 
       * Library App
       * 
       * 
       * 
       */

      function generateId () {
        return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
    }

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

    // adiciona o metodo subscribe e getState
    store.subscribe(()=> {
      // instancia do store get
      const { goals, todos } = store.getState()

      // sempre que invocar as funções abaixo, devemos reiniciar o conteudo para evitar duplicação do primeiro item
      document.getElementById('goals').innerHTML = ''
      document.getElementById('todos').innerHTML = ''

      // funções de chamada quando retornado subscribe
      goals.forEach(addGoalToDOM)
      todos.forEach(addTodoToDOM)
    })

/**
* 
* DOM 
* 
*/

  // apos click invoca o input selecionado
  function addTodo () {
    const input = document.getElementById('todo')
    const name = input.value
    input.value = ''
    store.dispatch(addTodoAction({
      name,
      complete: false,
      id: generateId()
    }))
  }

  // apos click invoca o input selecionado
  function addGoal () {
    const input = document.getElementById('goal')
    const name = input.value
    input.value = ''

    store.dispatch(addGoalAction({
      id: generateId(),
      name,
    }))
  }


  // invoca click dos botoes
  document.getElementById('todoBtn')
    .addEventListener('click', addTodo)

  document.getElementById('goalBtn')
    .addEventListener('click', addGoal)


  function createRemoveButton (onClick) {
    const removeBtn = document.createElement('button')
    removeBtn.innerHTML = 'X'
    removeBtn.addEventListener('click', onClick)
    return removeBtn
  }

  // função que adiciona html gerados com os dados de action requisitada
  function addTodoToDOM (todo) {
    const node = document.createElement('li')
    const text = document.createTextNode(todo.name)

    // recebe a função acima e dispara a ação do dispatch para remover pelo ID
    const removeBtn = createRemoveButton(() => {
      store.dispatch(removeTodoAction(todo.id))
    })

    node.appendChild(text)
    node.appendChild(removeBtn)

    node.style.textDecoration = todo.complete ? 'line-through' : 'none'
    // se houver click dispara o toggle para line through
    node.addEventListener('click', () => {
      store.dispatch(toggleTodoAction(todo.id))
    })

     document.getElementById('todos')
      .appendChild(node)
  }
   function addGoalToDOM (goal) {
    const node = document.createElement('li')
    const text = document.createTextNode(goal.name)

    const removeBtn = createRemoveButton(() => {
      store.dispatch(removeGoalAction(goal.id))
    })

    node.appendChild(text)
    node.appendChild(removeBtn)

    document.getElementById('goals')
    .append(node)
  }