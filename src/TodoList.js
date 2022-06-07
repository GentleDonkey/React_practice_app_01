import React from "react";
import "./index.css";
function getDataFromMockAPI(page) {
  return fetch(`/api/todos?page=${page}`)
    .then((response) => response.json())
    .then((response) => {
      console.log("Success:", response.todos);
      return response.todos;
    });
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { items: [], page: "100" };
  }
  // async componentDidMount() {
  //   const data = await getDataFromMockAPI();
  //   this.setState({ items: data });
  //   console.log(data);
  // }
  componentDidMount() {
    getDataFromMockAPI(this.state.page).then((items) => {
      this.setState({
        items,
      });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.page) {
      getDataFromMockAPI(this.state.page).then((items) => {
        this.setState({
          items,
        });
      });
    }
  }
  // componentDidUpdate(page) {
  //   getDataFromMockAPI(page).then((items) => {
  //     this.setState({
  //       items,
  //     });
  //   });
  // }
  handlePage = (page) => {
    this.setState({ page: page });
  };
  addItem = (e) => {
    e.preventDefault();
    if (this.myRef !== "") {
      var newItem = {
        text: this.myRef.current.value,
        key: Date.now(),
      };
    }
    // this.setState(
    //   {
    //     items: [...this.state.items, newItem],
    //   },
    //   () => {
    //     console.log(this.state.items);
    //   }
    // );
    this.setState(
      (previousState) => {
        return {
          items: previousState.items.concat(newItem),
        };
      },
      () => {
        console.log(this.state.items);
      }
    );
    this.makeAddRequest(newItem);
    this.myRef.current.value = "";
  };
  makeAddRequest = (data) => {
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
  deleteItem = (key) => {
    var filteredItems = this.state.items.filter((item) => item.key !== key);
    this.setState({ items: filteredItems });
    this.makeDeleteRequest(key);
  };
  makeDeleteRequest = (key) => {
    fetch(`/api/todos/delete?key=${key}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  updateItem = (key, value) => {
    let updatedItems = this.state.items.map((item) => {
      return {
        ...item,
        text: item.key === key ? value : item.text,
      };
    });
    this.setState({
      items: updatedItems,
    });
    const data = {
      text: value,
      key: key,
    };
    this.makeUpdateRequest(data);
  };
  makeUpdateRequest = (data) => {
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
  render() {
    return (
      <div className="todoListMain">
        <div className="header">
          <a href="#" onClick={() => this.handlePage(10)}>
            10
          </a>
          <br />
          <a href="#" onClick={() => this.handlePage(20)}>
            20
          </a>
          <form onSubmit={this.addItem}>
            <input ref={this.myRef} placeholder="Enter Task"></input>
            <button type="submit">Add</button>
          </form>
        </div>
        <TodoItems
          delete={this.deleteItem}
          update={this.updateItem}
          entries={this.state.items}
        />
      </div>
    );
  }
}

class TodoItems extends React.Component {
  constructor(props) {
    super(props);
  }
  delete = (key) => {
    this.props.delete(key);
  };
  update = (key, value) => {
    this.props.update(key, value);
  };
  render() {
    return (
      <div className="body">
        <ul className="theList">
          {this.props.entries.map((item) => {
            return (
              <TodoItem
                delete={this.delete}
                update={this.update}
                key={item.key}
                item={item}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}

class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mode: "Display" };
  }
  delete = (key) => {
    this.props.delete(key);
  };
  edit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ mode: "Edit" });
  };
  update = (e, key) => {
    if (e.keyCode === 13) {
      this.props.update(key, e.target.value);
      this.setState({ mode: "Display" });
    }
  };
  render() {
    if (this.state.mode === "Display") {
      return (
        <li
          onClick={() => this.delete(this.props.item.key)}
          key={this.props.item.key}
        >
          {this.props.item.text}
          <a
            key={this.props.item.key}
            href="#"
            style={{ float: "right" }}
            onClick={(e) => this.edit(e)}
          >
            Edit
          </a>
        </li>
      );
    } else {
      return (
        <input
          defaultValue={this.props.item.text}
          onKeyUp={(e) => this.update(e, this.props.item.key)}
        />
      );
    }
  }
}

export default TodoList;
