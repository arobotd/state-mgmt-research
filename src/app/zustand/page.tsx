'use client'
// todo: make tree-shaking work on @edwin-edu/ui so this doesn't have to be 'use client'. https://redd.one/blog/building-a-treeshakable-library-with-rollup

import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { Todo } from '@/app/shared'
import { Button, Checkbox, Flex, H1, Input } from '@edwin-edu/ui'
import { SubmitHandler, useForm } from 'react-hook-form'
import Image from 'next/image'
import styles from '@/app/page.module.css'

interface TodoState {
  todos: Todo[]
  addTodo: (description: string) => void
  removeTodo: (id: string) => void
  toggleCompleted: (id: string) => void
}

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

interface FormData {
  newTodo: string
}

export default function Zustand() {
  const todos = useStore((state) => state.todos)
  const addTodo = useStore((state) => state.addTodo)
  const { handleSubmit, register, reset } = useForm<FormData>()
  const onSubmit: SubmitHandler<FormData> = (data) => {
    addTodo(data.newTodo)
    reset()
  }

  return (
    <>
      <div>
        <H1 mb={2}>Zustand</H1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ marginBottom: '12px' }}
        >
          <Input
            placeholder="New Todo"
            defaultValue=""
            {...register('newTodo', { required: true })}
          />
          <Button type="submit">Submit</Button>
        </form>
        <Flex as="ul">
          {todos.map((todo) => (
            <TodoItem {...todo} key={`todo-${todo.id}`} />
          ))}
        </Flex>
      </div>
    </>
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

const TodoItemUI = (props: {
  todo: Todo
  toggleCompleted: TodoState['toggleCompleted']
  removeTodo: TodoState['removeTodo']
}) => {
  const { todo, toggleCompleted, removeTodo } = props
  const { id, description, completed } = todo

  return (
    <Flex as={'li'} gap={2}>
      <input
        id={id}
        type="checkbox"
        checked={!!completed}
        onChange={() => toggleCompleted(id)}
      />
      <label
        htmlFor={id}
        style={
          completed
            ? {
                textDecoration: 'line-through',
                color: '#888888',
              }
            : undefined
        }
      >
        {description}
      </label>
      <Button variant={'unstyled'} onClick={() => removeTodo(id)}>
        <Image src="/trash-icon.svg" alt="Remove Todo" height={15} width={15} />
      </Button>
    </Flex>
  )
}
