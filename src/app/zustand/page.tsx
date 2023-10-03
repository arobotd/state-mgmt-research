'use client'
// todo: make tree-shaking work on @edwin-edu/ui so this doesn't have to be 'use client'. https://redd.one/blog/building-a-treeshakable-library-with-rollup

import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import {
  Container,
  Headline,
  NewTodoUI,
  Todo,
  TodoItemUI,
  TodoListUI,
} from '@/app/shared'

// NEED TO DECLARE TYPE BEFORE

interface TodoState {
  todos: Todo[]
  addTodo: (description: string) => void
  removeTodo: (id: string) => void
  toggleCompleted: (id: string) => void
}

// STATE & ACTIONS

const useStore = create<TodoState>((set) => ({
  // initial state
  todos: [],
  // actions
  addTodo: (description) => {
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: uuid(),
          description,
        },
      ],
    }))
  },
  removeTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }))
  },
  toggleCompleted: (id) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo,
      ),
    }))
  },
}))

export default function Zustand() {
  const todos = useStore((state) => state.todos)
  const addTodo = useStore((state) => state.addTodo)

  return (
    <Container>
      <Headline>Zustand</Headline>
      <NewTodoUI addTodo={addTodo} />
      <TodoListUI>
        {todos.map((todo) => (
          <TodoItem {...todo} key={`todo-${todo.id}`} />
        ))}
      </TodoListUI>
    </Container>
  )
}

const TodoItem = (todo: Todo) => {
  const toggleCompleted = useStore((state) => state.toggleCompleted)
  const removeTodo = useStore((state) => state.removeTodo)

  return (
    <TodoItemUI
      todo={todo}
      toggleCompleted={toggleCompleted}
      removeTodo={removeTodo}
    />
  )
}
