import { Button, Flex, H1, Input } from '@edwin-edu/ui'
import Image from 'next/image'
import { FC, PropsWithChildren } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export interface Todo {
  id: string
  description: string
  completed?: boolean
}

export const TodoItemUI = (props: {
  todo: Todo
  toggleCompleted: (id: string) => void
  removeTodo: (id: string) => void
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

export const TodoListUI: FC<PropsWithChildren> = ({ children }) => (
  <Flex as="ul">{children}</Flex>
)
export const Container: FC<PropsWithChildren> = ({ children }) => (
  <div>{children}</div>
)
export const Headline: FC<PropsWithChildren> = ({ children }) => (
  <H1 mb={2}>{children}</H1>
)

interface FormData {
  newTodo: string
}

export const NewTodoUI: FC<{ addTodo: (description: string) => void }> = ({
  addTodo,
}) => {
  const { handleSubmit, register, reset } = useForm<FormData>()
  const onSubmit: SubmitHandler<FormData> = (data) => {
    addTodo(data.newTodo)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: '12px' }}>
      <Input
        placeholder="New Todo"
        defaultValue=""
        {...register('newTodo', { required: true })}
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}
