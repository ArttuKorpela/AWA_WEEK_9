document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        notLoggedIn();
        console.log("No token");
    } else {
        fetch('/api/private', {
            headers: {'Authorization': 'Bearer ' + token}
        })
        .then(resp => {
            if (resp.ok) {
                return resp.json();
            }else if (resp.status === 401) {
                console.log("Not logged in");
                notLoggedIn();
                return null;
            } else {throw new Error("Server responded with status code: " + resp.status)}
            
            
        }).then(data => {
            if (data) {
                const email = data.email;
            console.log("Logged in", email);
            loggedIn(email);
            }

        }).catch(e => {throw e});}


    function notLoggedIn() {
        const container = document.getElementById("container");
        const registerLink = document.createElement("a");
        registerLink.href = "/register.html";
        registerLink.textContent = "Register";
        container.append(registerLink);
        container.appendChild(document.createTextNode(" | "));        
        const loginLink = document.createElement("a");
        loginLink.href = "/login.html";
        loginLink.textContent = "Login";
        container.append(loginLink);
    }

    function loggedIn(email) {
        const container = document.getElementById("container");
        const todoInput = document.createElement("input");
        todoInput.type ="text";
        todoInput.id = "add-item";
        todoInput.placeholder = "Write your todo's here!"
        container.append(todoInput);

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit";
        submitBtn.id = "submitBtn";
        submitBtn.type = "button"
        submitBtn.classList.add("button");
        submitBtn.addEventListener("click", async () => {
            await addTodo(todoInput.value)
        })
        container.append(submitBtn);
        container.append(document.createElement("br"));


        const logOutBtn = document.createElement("button");
        logOutBtn.textContent = "Logout";
        logOutBtn.classList.add("button");
        logOutBtn.addEventListener("click", () => {
            localStorage.removeItem("auth_token");
            window.location.href = "/";
        })
        container.append(logOutBtn);
        container.append(document.createElement("br"));
        const emailText = document.createElement("text");
        emailText.textContent = email;
        container.append(email);

        loadTodos();
    }

    function addTodo(todo) {
        fetch("/api/todos", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ items: [todo] }),
        }).then(resp => {
            resp.json();
        }).then(data => {
            createTodoItem(todo);
        })
        .catch(e => {throw e});


    }

    function loadTodos() {
        fetch("/api/todos/all", {
            headers: {'Authorization': 'Bearer ' + token}
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Loading Todo's responded with status code: " + response.status);
            }
            
        }).then(data => {
            if (data.success) {
                data.items.forEach(task => {
                    createTodoItem(task);
                });

            }//CONTINUE
        })
        
    }

    function createTodoItem(todo) {
        let todoItem = document.createElement("div");
        const container = document.getElementById("todo_container");
        todoItem.id = "todo_item";
        todoItem.classList.add("todo");
        todoItem.innerText = todo;
        //document.body.append(document.createElement("br"));
        container.append(todoItem);
    }
   
    
    

});