'use client'
// todo: make tree-shaking work on @edwin-edu/ui so this doesn't have to be 'use client'. https://redd.one/blog/building-a-treeshakable-library-with-rollup

import {
  Container,
  Headline,
  NewTodoUI,
  Todo,
  TodoItemUI,
  TodoListUI,
} from '@/app/shared'
import { atom, RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil'
import { v4 as uuid } from 'uuid'

// STATE

const todosAtom = atom<Todo[]>({
  key: 'Todos', // atom keys are required for debugging & persistence. They must be GLOBALLY unique
  default: [],
})

// ACTIONS

const useTodoActions = () => {
  const set = useSetRecoilState(todosAtom)

  return {
    addTodo: (description: string) => {
      set((oldTodos) => [
        ...oldTodos,
        {
          id: uuid(),
          description,
        },
      ])
    },
    removeTodo: (id: string) => {
      set((oldTodos) => oldTodos.filter((todo) => todo.id !== id))
    },
    toggleCompleted: (id: string) => {
      set((oldTodos) =>
        oldTodos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                completed: !todo.completed,
              }
            : todo,
        ),
      )
    },
  }
}

export default function Recoil() {
  return (
    // Recoil needs a provider parent component. This is optional in Jotai & Zustand but is recommended because it solves some SSR & security issues.
    <RecoilRoot>
      <RecoilTodos />
    </RecoilRoot>
  )
}

function RecoilTodos() {
  const todos = useRecoilValue(todosAtom)
  const { addTodo } = useTodoActions()

  return (
    <Container>
      <Headline>Recoil</Headline>
      <NewTodoUI addTodo={addTodo} />
      <TodoListUI>
        {todos.map((todo) => (
          <TodoItem todo={todo} key={`todo-${todo.id}`} />
        ))}
      </TodoListUI>
    </Container>
  )
}

const TodoItem = ({ todo }: { todo: Todo }) => {
  const { toggleCompleted, removeTodo } = useTodoActions()

  return (
    <TodoItemUI
      todo={todo}
      toggleCompleted={toggleCompleted}
      removeTodo={removeTodo}
    />
  )
}
