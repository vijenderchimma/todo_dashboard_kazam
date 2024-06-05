import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import TodoItem from './TodoItem';
import { GiNotebook } from "react-icons/gi";

const LOCAL_STORAGE_KEY = 'tasks';
const LIMIT = 50;

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedTasks) {
      setTasks(storedTasks);
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/fetchAllTasks');
      setTasks(prevTasks => [...prevTasks, ...response.data]);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    const newTask = { id: uuidv4(), text: task };
    const newTasks = [...tasks, newTask];
    if (newTasks.length > LIMIT) {
      try {
        await axios.post('http://localhost:4000/add', { tasks: newTasks });
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setTasks([]); // Clear tasks after sending to the backend
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTasks));
      setTasks(newTasks); // Update state with new tasks
    }
    setTask(''); // Clear the input field after adding the task
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
          {tasks && tasks.map((todo) => (
            <TodoItem todo={todo} key={todo.id} />
          ))}
        </div>
      </div>
      </div>
  );
}

export default App;
