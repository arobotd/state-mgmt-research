import { Container, Headline, NewTodoUI, Todo, TodoItemUI, TodoListUI } from "@/app/shared";
import { assign, createMachine } from "xstate";


const todosMachine = createMachine<{ todos: Todo[] }>({
  id: "todos",
  preserveActionOrder: true,
  context: {
    todos: []
  },
})

export default function XState() {
  return (
    <Container>
      <Headline>XState</Headline>
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

  return (
    <TodoItemUI
      todo={todo}
      toggleCompleted={toggleCompleted}
      removeTodo={removeTodo}
    />
  )
}
