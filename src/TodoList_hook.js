import React, { useState, useRef, useEffect } from "react";
import "./index.css";

function TodoList() {
  const [todo, setTodo] = useState({
    items: [],
  });
  const [pageStatus, setPageStatus] = useState(100);
  const myValue = useRef(null);
  const addItem = (e) => {
    e.preventDefault();
    let newItem = {
      text: myValue.current.value,
      key: Date.now(),
    };
    setTodo({
      items: [...todo.items, newItem],
    });
    makeAddRequest(newItem);
    myValue.current.value = "";
  };
  const makeAddRequest = (data) => {
    fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("Success:", response.todo);
      });
  };
  const deleteItem = (key) => {
    let filteredItems = todo.items.filter((item) => item.key !== key);
    setTodo({
      items: filteredItems,
    });
    makeDeleteRequest(key);
  };
  const makeDeleteRequest = (key) => {
    fetch(`/api/todos/delete?key=${key}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const updateItem = (key, value) => {
    let updatedItems = todo.items.map((item) => {
      return {
        ...item,
        text: item.key === key ? value : item.text,
      };
    });
    setTodo({
      items: updatedItems,
    });
    const data = {
      text: value,
      key: key,
    };
    makeUpdateRequest(data);
  };
  const makeUpdateRequest = (data) => {
    fetch(`/api/todos/update?key=${data.key}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("Success:", response);
      });
  };
  const handlePage = (page) => {
    setPageStatus(page);
  };
  useEffect(() => {
    fetch(`/api/todos?page=${pageStatus}`)
      .then((response) => response.json())
      .then((response) => {
        console.log("Success:", response.todos);
        setTodo({
          items: response.todos,
        });
      });
  }, [pageStatus]);

  return (
    <div className="todoListMain">
      <div className="header">
        <a href="#" onClick={() => handlePage(10)}>
          10
        </a>
        <br />
        <a href="#" onClick={() => handlePage(20)}>
          20
        </a>
        <form onSubmit={addItem}>
          <input
            placeholder="Enter Task"
            ref={(e) => {
              myValue.current = e;
            }}
          ></input>
          <button type="submit">Add</button>
        </form>
      </div>
      <TodoItems delete={deleteItem} update={updateItem} entries={todo.items} />
    </div>
  );
}

function TodoItems(props) {
  const thisDelete = (key) => {
    props.delete(key);
  };
  const thisUpdate = (key, value) => {
    props.update(key, value);
  };
  return (
    <div className="body">
      <ul className="theList">
        {props.entries.map((item) => {
          return (
            <TodoItem
              delete={thisDelete}
              update={thisUpdate}
              key={item.key}
              item={item}
            />
          );
        })}
      </ul>
    </div>
  );
}

function TodoItem(props) {
  const [mode, setMode] = useState("Display");
  const thisDelete = (key) => {
    props.delete(key);
  };
  const thisEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMode("Edit");
  };
  const thisUpdate = (e, key) => {
    if (e.keyCode === 13) {
      props.update(key, e.target.value);
      setMode("Display");
    }
  };
  if (mode === "Display") {
    return (
      <li onClick={() => thisDelete(props.item.key)} key={props.item.key}>
        {props.item.text}
        <a
          key={props.item.key}
          href="#"
          style={{ float: "right" }}
          onClick={(e) => thisEdit(e)}
        >
          Edit
        </a>
      </li>
    );
  } else {
    return (
      <input
        defaultValue={props.item.text}
        onKeyUp={(e) => thisUpdate(e, props.item.key)}
      />
    );
  }
}

export default TodoList;
