import React from 'react'

const TodoItem = (props) => {
    const {todo} = props
  return (
    <div>
        <p>{todo.text}</p>
        <hr/>
    </div>
  )
}

export default TodoItem