const forNewTodo = document.querySelector("#new-to-do");
const todoInput = document.querySelector("#to-do");
const areaTodo = document.querySelector(".to-do");
const areaDoing = document.querySelector(".doing");
const areaEnd = document.querySelector(".end");

// localstorage
const getTodos = () => {
    return JSON.parse(localStorage.getItem("todo") || "[]");
};

const saveTodo = (todos) => {
    localStorage.setItem("todo", JSON.stringify(todos));
};

let toDos = getTodos();

const initialize = () => {
    loadTodo("notInit", areaTodo);
    loadTodo("doing", areaDoing);
    loadTodo("end", areaEnd);
};

const loadTodo = (key, el) => {
    const todos = toDos.filter((todo) => todo[key]);
    todos.forEach((todo) => {
        const element = createRow(todo);
        el.appendChild(element);
    });
};

const createId = (todos) => {
    ids = [];
    if (todos.length === 0) {
        return 1;
    }
    todos.forEach((todo) => {
        ids.push(todo.id);
    });
    return Math.max(...ids) + 1;
};

const createButton = (classname, i, span) => {
    const button = document.createElement("button");
    button.classList.add(classname);
    button.innerHTML = `<i class="${i}"></i> <span>${span}</span>`;
    return button;
};

const editTodo = (id, p, input) => {
    p.classList.add("hide");
    input.classList.remove("hide");
    input.focus();
    input.addEventListener("keypress", (e) => {
        const todoName = input.value;
        if (e.key === "Enter") {
            if (!todoName) {
                p.classList.remove("hide");
                input.classList.add("hide");
                return;
            }
            const todo = toDos.find((todo) => todo.id === id);
            todo.todo = todoName;
            p.innerText = todo.todo;
            p.classList.remove("hide");
            input.classList.add("hide");
            saveTodo(toDos);
        }
    });
};

const deleteTodo = (id, el) => {
    toDos = toDos.filter((todo) => todo.id !== id);
    parentElement = el.parentNode;
    parentElement.removeChild(el);
    saveTodo(toDos);
};

const copyTodo = (id) => {
    const todo = toDos.find((todo) => todo.id === id);
    const obj = {
        id: createId(toDos),
        todo: todo.todo,
        doing: false,
        notInit: true,
        end: false,
    };
    toDos.push(obj);
    const element = createRow(obj);
    areaTodo.appendChild(element);
    saveTodo(toDos);
};

const doingTodo = (id, el) => {
    const todo = toDos.find((todo) => todo.id === id);
    todo.doing = true;
    todo.notInit = false;
    todo.end = false;
    const element = createRow(todo);
    areaDoing.appendChild(element);
    const parentElement = el.parentNode;
    parentElement.removeChild(el);
    saveTodo(toDos);
};

const backNotInit = (id, el) => {
    const todo = toDos.find((todo) => todo.id === id);
    todo.doing = false;
    todo.notInit = true;
    todo.end = false;
    const element = createRow(todo);
    areaTodo.appendChild(element);
    const parentElement = el.parentNode;
    parentElement.removeChild(el);
    saveTodo(toDos);
};

const endTodo = (id, el) => {
    const todo = toDos.find((todo) => todo.id === id);
    todo.doing = false;
    todo.notInit = false;
    todo.end = true;
    const element = createRow(todo);
    areaEnd.appendChild(element);
    const parentElement = el.parentNode;
    parentElement.removeChild(el);
    saveTodo(toDos);
};

const createRow = (obj) => {
    const row = document.createElement("div");
    row.classList.add("row");
    const p = document.createElement("p");
    p.classList.add("name");
    p.innerText = obj.todo;
    row.appendChild(p);
    const input = document.createElement("input");
    input.type = "text";
    input.id = "edit-to-do";
    input.value = obj.todo;
    input.classList.add("hide");
    row.appendChild(input);
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    if (!obj.notInit) {
        const notInitBtn = createButton("list", "bi bi-list-ol", "Tarefa");
        notInitBtn.addEventListener("click", () => backNotInit(obj.id, row));
        buttons.appendChild(notInitBtn);
    }

    if (!obj.doing) {
        const doingBtn = createButton(
            "doing",
            "bi bi-arrow-clockwise",
            "Fazendo"
        );
        doingBtn.addEventListener("click", () => doingTodo(obj.id, row));
        buttons.appendChild(doingBtn);
    }

    if (!obj.end) {
        const endBtn = createButton("end-do", "bi bi-check-lg", "Feito");
        endBtn.addEventListener("click", () => endTodo(obj.id, row));
        buttons.appendChild(endBtn);
    }

    const editBtn = createButton("edit", "bi bi-pencil-fill", "Editar");
    editBtn.addEventListener("click", () => editTodo(obj.id, p, input));
    buttons.appendChild(editBtn);
    const copyBtn = createButton("copy", "bi bi-copy", "Copiar");
    copyBtn.addEventListener("click", () => copyTodo(obj.id));
    buttons.appendChild(copyBtn);
    const deleteBtn = createButton("delete", "bi bi-x-lg", "Deletar");
    deleteBtn.addEventListener("click", () => deleteTodo(obj.id, row));
    buttons.appendChild(deleteBtn);
    row.appendChild(buttons);
    return row;
};

forNewTodo.addEventListener("submit", (e) => {
    e.preventDefault();
    const todo = todoInput.value;

    if (!todo) return;

    const obj = {
        id: createId(toDos),
        todo,
        doing: false,
        notInit: true,
        end: false,
    };

    toDos.push(obj);
    const row = createRow(obj);
    areaTodo.appendChild(row);
    todoInput.value = "";
    saveTodo(toDos);
});

initialize();
