import { State } from "./state.js";

// ----------------------------------------------------

const userStatus = document.querySelector(".user-status");
let headers = {
  token: getCookie("token"),
};

function checkUserLoginStatus() {
  const isLogin = localStorage.getItem("login");

  if (isLogin) {
    userStatus.innerHTML = `
      <span class='logout-btn'>
          Logout
      </span> 
    `;

    const logoutBtn = document.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", async () => {
      const res = await axios.get("/user/logout");

      localStorage.removeItem("login");
      eraseCookie("token");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  } else {
    userStatus.innerHTML = `
        <span>
          <a href="./register.html">Register</a>
        </span> /
        <span>
          <a href="./login.html">Login</a>
        </span>
    `;
  }
}

// ---------------------------------------------------------------------

const alltodos = new State([]);
const filterTodos = new State([]);
const filterValue = new State("all");

const loginState = new State(localStorage.getItem("login"));

const filterTypes = {
  all: "all",
  done: "done",
  undone: "undone",
};

//

alltodos.sub(generateFilterTodolist);
filterValue.sub(generateFilterTodolist);
filterValue.sub(selectFilterButton);

filterTodos.sub(renderTodolist);
filterTodos.sub(toggleTodolist);

//

const todolist = document.querySelector(".todolist");
const addtodoInput = document.querySelector(".addtodo-input");
const addtodoBtn = document.querySelector(".addtodo-btn");

Object.keys(filterTypes).forEach((type) => {
  const btn = document.querySelector(`.${type}-btn`);

  btn.addEventListener("click", () => {
    filterValue.setState(type);
  });
});

document.addEventListener("DOMContentLoaded", setupPage);
addtodoBtn.addEventListener("click", () => {
  addTodo(addtodoInput.value);
  addtodoInput.value = "";
});

//-------------------------------------------------------------------

function generateFilterTodolist() {
  if (filterValue.value === filterTypes.all) {
    filterTodos.setState(alltodos.value);
    return;
  }

  const shouldChecked = filterValue.value === "done";

  if (shouldChecked) {
    const filtertodolist = alltodos.value.filter((todo) => {
      return todo.isChecked === true;
    });

    filterTodos.setState(filtertodolist);
  } else {
    const filtertodolist = alltodos.value.filter((todo) => {
      return todo.isChecked === false;
    });

    filterTodos.setState(filtertodolist);
  }
}

function selectFilterButton() {
  Object.keys(filterTypes).forEach((type) => {
    const btn = document.querySelector(`.${type}-btn`);

    if (filterValue.value === type) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function toggleTodolist() {
  if (filterTodos.value.length > 0) {
    todolist.classList.remove("hide");
  }

  if (filterTodos.value.length <= 0) {
    todolist.classList.add("hide");
  }
}

function renderTodolist(state) {
  todolist.innerHTML = "";

  state.forEach((item) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoContent = `
        <h4>${item.title}</h4>
        <div class="todo-btn-container">
            <button class="edit-btn">edit</button>
            <button class="delete-btn">delete</button>
        </div>
      `;

    if (item.isChecked) {
      todo.innerHTML =
        `<input type="checkbox" checked class='checktodo-input'>` + todoContent;
    } else {
      todo.innerHTML =
        `<input type="checkbox" class='checktodo-input'>` + todoContent;
    }

    todo.querySelector(".checktodo-input").addEventListener("change", () => {
      toggleTodo(item._id, item.title, item.isChecked);
    });

    todo.querySelector(".delete-btn").addEventListener("click", () => {
      deleteTodo(item._id);
    });

    todo.querySelector(".edit-btn").addEventListener("click", () => {
      todo.innerHTML = `
            <input type='text' value=${item.title} class='edittodo-input'/>
            <div class="todo-btn-container">
                <button class="edit-btn">edit</button>
                <button class="delete-btn">delete</button>
            </div>
        `;

      const editInput = todo.querySelector(".edittodo-input");

      editInput.addEventListener("blur", () => {
        if (editInput.value === "") {
          editTodo(item._id, item.title);
          return;
        }

        const confirmEdit = confirm("確定編輯?");
        editTodo(item._id, confirmEdit ? editInput.value : item.title);
      });
    });

    todolist.appendChild(todo);
  });
}

//--------------------------------------------------------

async function addTodo(title) {
  const res = await axios.post(
    "/todos",
    {
      title: title,
    },
    {
      headers,
    }
  );

  const newTodos = await axios.get("/todos", {
    headers,
  });

  alltodos.setState(newTodos.data.todos);
}

async function deleteTodo(id) {
  const res = await axios.delete(`/todos/${id}`, {
    headers,
  });

  const newTodos = await axios.get("/todos", {
    headers,
  });

  alltodos.setState(newTodos.data.todos);
}

async function editTodo(id, title) {
  const res = await axios.patch(
    `/todos/${id}`,
    {
      title: title,
    },
    {
      headers,
    }
  );

  const newTodos = await axios.get("/todos", {
    headers,
  });

  alltodos.setState(newTodos.data.todos);
}

async function toggleTodo(id, title, isChecked) {
  const res = await axios.patch(
    `/todos/${id}`,
    {
      title: title,
      isChecked: !isChecked,
    },
    {
      headers,
    }
  );

  const newTodos = await axios.get("/todos", {
    headers,
  });

  alltodos.setState(newTodos.data.todos);
}

// -------------------------------------------------------

async function setupPage() {
  checkUserLoginStatus();

  if (getCookie("token")) {
    const res = await axios.get("/todos", {
      headers,
    });

    alltodos.setState(res.data.todos);
  } else {
    toggleTodolist();
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function eraseCookie(name) {
  document.cookie = name + "=; Max-Age=0";
}
