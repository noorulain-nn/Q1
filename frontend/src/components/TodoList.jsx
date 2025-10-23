import { useState, useEffect } from "react";
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [loading, setLoading] = useState(true);

  // Check backend connectivity
  const checkBackend = async () => {
    try {
      await axios.get("http://localhost:5000/");
      setBackendStatus("Backend reachable");
    } catch (err) {
      setBackendStatus("Backend not reachable");
      console.error("Backend connection failed:", err);
    }
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackend();
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!task.trim()) return;
    try {
      const res = await api.post("/todos", { 
        text: task, 
        done: false 
      });
      setTodos([...todos, res.data]);
      setTask(""); 
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleTodo = async (id, done) => {
    try {
      const res = await api.put(`/todos/${id}`, { done: !done });
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Full-Stack Todo App</h2>
      <p><strong>Backend status:</strong> {backendStatus}</p>
      <p>Welcome to the React Frontend</p>
     
      <div style={{ marginTop: "30px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
        <h2>📌 Todo Manager</h2>
        <div style={{ marginBottom: "20px" }}>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a task..."
            style={{
              padding: "8px",
              marginRight: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              width: "200px"
            }}
          />
          <button 
            onClick={addTodo}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Add
          </button>
        </div>

        <div>
          {loading ? (
            <p>Loading todos...</p>
          ) : todos.length === 0 ? (
            <p>No tasks yet! Add your first task above.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {todos.map((todo) => (
                <li 
                  key={todo._id} 
                  style={{
                    padding: "10px",
                    margin: "5px 0",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span 
                    onClick={() => toggleTodo(todo._id, todo.done)}
                    style={{ 
                      cursor: "pointer", 
                      textDecoration: todo.done ? "line-through" : "none",
                      color: todo.done ? "#6c757d" : "#000",
                      flexGrow: 1
                    }}
                  >
                    {todo.text}
                  </span>
                  <button 
                    onClick={() => deleteTodo(todo._id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px"
                    }}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}