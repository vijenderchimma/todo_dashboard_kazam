import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GiNotebook } from "react-icons/gi";
import TodoItem from './TodoItem';
import API_URL from './ApiPath';

const localStorageKey = 'tasks'
const limit = 50;

function NoteApp() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([])
  const [fetchedtasks, setFecthedtasks] = useState([])


  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(localStorageKey))
    if (storedData) {
      setTodos(storedData)
    } else {
      fetchTasks()
    }
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/fetchalltasks`)
      setFecthedtasks(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  const sendTobackend = async (text) => {
    try {
      const response = await axios.post(`${API_URL}/add`, text)
      console.log(response)
      return response
    } catch (error) {
      console.log(error)
    }
  }



  const addTask = async () => {

    const updatedTodos = [...todos, task];


    if (updatedTodos.length > limit) {
      localStorage.removeItem(localStorageKey);

      try {

        for (let text of updatedTodos) {
          console.log(text)
          const taskOutput = await sendTobackend({ text })
          if(taskOutput.status === 200){
            alert("Todo Added Successfully")
          }
          console.log(taskOutput)
        }

      } catch (error) {
        console.error('Error adding tasks:', error);
        alert('Error adding tasks');
      }
    } else {
      localStorage.setItem(localStorageKey, JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
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
          {todos && todos.map(item => (
            <>
              <p>{item}</p>
              <hr />
            </>
          ))}
          {fetchedtasks && fetchedtasks.map(item => (
            <TodoItem todo={item} key={item._id} />
          ))}

        </div>
      </div>
    </div>
  );
}

export default NoteApp;
