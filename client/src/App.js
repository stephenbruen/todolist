import { useEffect, useState } from 'react';

const api_base = 'http://localhost:3001';

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const res = await fetch(api_base + '/todos');
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const completeTodo = async id => {
    try {
      const res = await fetch(api_base + '/todo/complete/' + id);
      const data = await res.json();

      setTodos(todos => todos.map(todo => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      }));
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const addTodo = async () => {
    try {
      const res = await fetch(api_base + "/todo/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          text: newTodo
        })
      });
      const data = await res.json();

      setTodos([...todos, data]);
      setPopupActive(false);
      setNewTodo("");
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  const deleteTodo = async id => {
    try {
      const res = await fetch(api_base + '/todo/delete/' + id, { method: "DELETE" });
      const data = await res.json();

      setTodos(todos => todos.filter(todo => todo._id !== data.result._id));
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  return (
    <div className="App">
      <h1>Welcome, Stephen</h1>
      <h4>Your tasks</h4>

      <div className="todos">
        {todos.length > 0 ? todos.map(todo => (
          <div className={
            "todo" + (todo.complete ? " is-complete" : "")
          } key={todo._id} onClick={() => completeTodo(todo._id)}>
            <div className="checkbox"></div>

            <div className="text">{todo.text}</div>

            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div>
          </div>
        )) : (
          <p>You currently have no tasks</p>
        )}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

      {popupActive && (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>X</div>
          <div className="content">
            <h3>Add Task</h3>
            <input type="text" className="add-todo-input" onChange={e => setNewTodo(e.target.value)} value={newTodo} />
            <div className="button" onClick={addTodo}>Create Task</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
