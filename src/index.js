import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import TodoList from "./TodoList_hook";
import reportWebVitals from "./reportWebVitals";
import createServer from "./server";
createServer();
const root = ReactDOM.createRoot(document.getElementById("container"));
root.render(
  <React.StrictMode>
    <TodoList />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
