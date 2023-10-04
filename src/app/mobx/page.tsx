'use client'
// todo: make tree-shaking work on @edwin-edu/ui so this doesn't have to be 'use client'. https://redd.one/blog/building-a-treeshakable-library-with-rollup

import {
  Container,
  Headline,
  NewTodoUI,
  // Todo
  TodoItemUI,
  TodoListUI,
} from '@/app/shared'
import { types, Instance } from 'mobx-state-tree'
import { observer } from 'mobx-react-lite'
import { v4 as uuid } from 'uuid'
import { createContext, useContext } from 'react'

// note: can use mobx-react-lite to add observer HOC around components

// CUSTOM TYPE DEFS

const Todo = types.model('Todo', {
  id: types.string,
  description: types.string,
  completed: types.optional(types.boolean, false),
})

const TodoStore = types
  // STATE
  .model('TodoStore', {
    todos: types.array(Todo),
  })
  // ACTIONS
  .actions((self) => ({
    addTodo: (description: string) => {
      self.todos.push({
        id: uuid(),
        description,
      })
    },
    removeTodo: (id: string) => {
      // @ts-ignore - there's probably a Mobx -> Typescript converter to prevent this type error
      self.todos = self.todos.filter((todo) => todo.id !== id)
    },
    toggleCompleted: (id: string) => {
      // @ts-ignore - there's probably a Mobx -> Typescript converter to prevent this type error
      self.todos = self.todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo,
      )
    },
  }))

const todoStore = TodoStore.create()

// No React hooks/helpers provided by Mobx. Need to write a Context/Provider:
const RootStoreContext = createContext<null | Instance<typeof TodoStore>>(null)
const StoreProvider = RootStoreContext.Provider
function useTodoStore() {
  const store = useContext(RootStoreContext)
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider')
  }
  return store
}

export default function Mobx() {
  return (
    <StoreProvider value={todoStore}>
      <MobxTodos />
    </StoreProvider>
  )
}

const MobxTodos = observer(() => {
  const { todos, addTodo } = useTodoStore()

  return (
    <Container>
      <Headline>Mobx (mobx-state-tree)</Headline>
      <NewTodoUI addTodo={addTodo} />
      <TodoListUI>
        {todos.map((todo) => (
          <TodoItem todo={todo} key={`todo-${todo.id}`} />
        ))}
      </TodoListUI>
    </Container>
  )
})

// need to cast Todo type from mobx using `Instance`
const TodoItem = observer(({ todo }: { todo: Instance<typeof Todo> }) => {
  const { toggleCompleted, removeTodo } = useTodoStore()

  return (
    <TodoItemUI
      todo={todo}
      toggleCompleted={toggleCompleted}
      removeTodo={removeTodo}
    />
  )
})
