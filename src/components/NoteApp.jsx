import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GiNotebook } from "react-icons/gi";
import TodoItem from './TodoItem';

const localStorageKey = 'tasks'
const limit = 50;

function App() {
  const [task, setTask] = useState('');
  const [todos,setTodos] = useState([])


  useEffect(()=>{
    fetchTasks()
  },[])

  const fetchTasks =async () => {
    try {
      const response = await axios.get('http://localhost:4000/fetchalltasks')
      setTodos(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }



  const addTask = async () => {

    try {
      const response = await axios.post('http://localhost:4000/add', { task });
      if (response.status === 200) {
        alert("Added Successfully");
        setTask(''); // Clear the input field after adding the task
        window.location.reload()
      } else {
        alert("Failed to add task");
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert("Error adding task");
    }
  };

  return (
    <div className='main--container'>
      <div className="app">
        <div className="task-input">
          <h2><GiNotebook className='icon' />Notes App</h2>
          <input
            type="text"
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="New Note..."
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <div className="task-list">
          <h3>Notes</h3>
          {todos && todos.map(item=>(
            <TodoItem todo = {item} key = {item._id}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
