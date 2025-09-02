import React, { useEffect, useState } from "react";
import "./App.css";
import icon from "./images/icon.png"; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const addTask = async () => {
    if (!newTask) {
      alert("Please enter a task!");
      return;
    }
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    });
    const data = await res.json();
    setTasks([...tasks, data]);
    setNewTask("");
  };

  const toggleTask = async (id, completed) => {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="container">
      <div className="todo-app">
        <h2>
          To-Do List <img src={icon} alt="icon" />
        </h2>

        <div className="row">
          <input
            type="text"
            placeholder="Add your task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul id="list-container">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={task.completed ? "checked" : ""}
              onClick={() => toggleTask(task.id, task.completed)}
            >
              {task.title}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
              >
                ❌
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
