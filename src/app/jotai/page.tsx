'use client'
// todo: make tree-shaking work on @edwin-edu/ui so this doesn't have to be 'use client'. https://redd.one/blog/building-a-treeshakable-library-with-rollup

import { v4 as uuid } from 'uuid'
import {
  Container,
  Headline,
  NewTodoUI,
  Todo,
  TodoItemUI,
  TodoListUI,
} from '@/app/shared'
import { atom, PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { splitAtom } from 'jotai/utils'

// STATE

const todosAtom = atom<Todo[]>([])
// note: can also do read-only and write-only atoms based on todosAtom i.e. atom((get) => get(todosAtom)) etc
const todoAtomsAtom = splitAtom(todosAtom, (item) => item.id) // keyExtractor param creates the key so to use the atom's toString() method when mapping. i.e. <... key={`item-${atom}`}/>

// ACTIONS

// this could be written in-line in the main function but I separated it out to keep consistency
const useAddTodo = () => {
  const dispatch = useSetAtom(todoAtomsAtom) // could also be: const [_, dispatch] = useAtom(todoAtomsAtom)
  return (description: string) => {
    dispatch({
      type: 'insert',
      value: { description, id: uuid() },
    })
  }
}

const useTodoActions = (atom: PrimitiveAtom<Todo>) => {
  const dispatch = useSetAtom(todoAtomsAtom) // using splitAtom
  const setAtom = useSetAtom(atom)
  return {
    toggleCompleted: () => {
      setAtom((oldValue) => ({
        ...oldValue,
        completed: !oldValue.completed,
      }))
    },
    removeTodo: () => {
      dispatch({ type: 'remove', atom })
    },
  }
}

export default function Jotai() {
  // Jotai-recommended way of dealing with arrays: https://jotai.org/docs/utilities/split
  // const [todoAtoms, dispatch] = useAtom(todoAtomsAtom)
  const todoAtoms = useAtomValue(todoAtomsAtom)
  const addTodo = useAddTodo()

  return (
    <Container>
      <Headline>Jotai</Headline>
      <NewTodoUI addTodo={addTodo} />
      <TodoListUI>
        {todoAtoms.map((todoAtom) => (
          <TodoItem todoAtom={todoAtom} key={`todo-${todoAtom}`} />
        ))}
      </TodoListUI>
    </Container>
  )
}

const TodoItem = ({ todoAtom }: { todoAtom: PrimitiveAtom<Todo> }) => {
  const todo = useAtomValue(todoAtom)
  const { toggleCompleted, removeTodo } = useTodoActions(todoAtom)

  return (
    <TodoItemUI
      todo={todo}
      toggleCompleted={toggleCompleted}
      removeTodo={removeTodo}
    />
  )
}
