import React, { useState, useEffect } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [intervalId, setIntervalId] = useState(null)

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [intervalId])

  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => Math.max(0, prev - 1))
  const reset = () => setCount(0)

  const startTimer = () => {
    if (!isRunning) {
      const id = setInterval(() => setCount(prev => prev + 1), 1000)
      setIntervalId(id)
      setIsRunning(true)
    }
  }

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
      setIsRunning(false)
    }
  }

  return (
    <div className="demo-panel">
      <h3>⚛️ React Counter</h3>
      <div className="counter-display">
        <span className="count-value">{count}</span>
      </div>
      <div className="counter-controls">
        <button onClick={increment} className="btn">+1</button>
        <button onClick={decrement} className="btn">-1</button>
        <button onClick={reset} className="btn btn-secondary">Reset</button>
        <button onClick={startTimer} className="btn btn-primary" disabled={isRunning}>
          Start Timer
        </button>
        <button onClick={stopTimer} className="btn" disabled={!isRunning}>
          Stop Timer
        </button>
      </div>
    </div>
  )
}

const ColorPicker = () => {
  const [color, setColor] = useState('#667eea')

  return (
    <div className="demo-panel">
      <h3>🎨 Color Picker</h3>
      <div className="color-controls">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="color-input"
        />
        <span className="color-value">{color}</span>
      </div>
      <div className="color-preview" style={{ backgroundColor: color }}>
        Selected Color Preview
      </div>
    </div>
  )
}

const TodoList = () => {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }])
      setInputValue('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="demo-panel">
      <h3>📝 Todo List</h3>
      <div className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo} className="btn btn-primary">Add</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)} className="btn btn-danger">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const Demo = () => {
  return (
    <section id="demo" className="section demo">
      <h2>🎮 Interactive Demos</h2>
      <div className="demo-content">
        <Counter />
        <ColorPicker />
        <TodoList />
      </div>
    </section>
  )
}

export default Demo