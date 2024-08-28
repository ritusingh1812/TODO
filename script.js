let users = JSON.parse(localStorage.getItem('users')) || [];

function getLoggedInUser() {
  return JSON.parse(localStorage.getItem('loggedInUser'));
}

function saveLoggedInUser(user) {
  localStorage.setItem('loggedInUser', JSON.stringify(user));
}

function updateUsersArray(updatedUser) {
  const userIndex = users.findIndex(u => u.username === updatedUser.username);
  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
  } else {
    users.push(updatedUser);
  }
  localStorage.setItem('users', JSON.stringify(users));
}

document.getElementById('authForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const user = users.find(u => u.username === username);
  const authTitle = document.getElementById('authTitle').textContent;

  if (authTitle === 'Login') {
    if (user && user.password === password) {
      saveLoggedInUser(user);
      showTodoList();
    } else {
      showMessage('Invalid username or password');
    }
  } else {
    if (user) {
      showMessage('Username already exists');
    } else {
      const newUser = { username, password, todos: [] };
      updateUsersArray(newUser);
      saveLoggedInUser(newUser);
      showTodoList();
    }
  }
});

document.getElementById('logout').addEventListener('click', function () {
  localStorage.removeItem('loggedInUser');
  document.querySelector('.auth-container').style.display = 'block';
  document.querySelector('.todo-container').style.display = 'none';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  showMessage('');
});

document.getElementById('todoForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const todoInput = document.getElementById('todoInput').value;
  const loggedInUser = getLoggedInUser();

  if (loggedInUser) {
    const userIndex = users.findIndex(u => u.username === loggedInUser.username);
    users[userIndex].todos.push({ text: todoInput, date: new Date().toLocaleDateString() });
    updateUsersArray(users[userIndex]);
    saveLoggedInUser(users[userIndex]);
    renderTodos(users[userIndex].todos);
    document.getElementById('todoInput').value = '';
  }
});

function renderTodos(todos) {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('todo-checkbox');
  
      const todoText = document.createElement('span');
      todoText.textContent = `${todo.text} (${todo.date})`;
      todoText.classList.add('todo-text');
  
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = 'Delete'; 
      deleteBtn.addEventListener('click', function () {
        todos.splice(index, 1);
        const loggedInUser = getLoggedInUser();
        loggedInUser.todos = todos;
        updateUsersArray(loggedInUser);
        renderTodos(todos);
      });
  
      li.appendChild(checkbox);
      li.appendChild(todoText);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  }

function showTodoList() {
  const loggedInUser = getLoggedInUser();
  if (loggedInUser) {
    document.getElementById('welcomeUser').textContent = `Welcome, ${loggedInUser.username}`;
    renderTodos(loggedInUser.todos);
    document.querySelector('.auth-container').style.display = 'none';
    document.querySelector('.todo-container').style.display = 'block';
  }
}

document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'switchToLogin') {
    document.getElementById('authTitle').textContent = 'Login';
    document.querySelector('button[type="submit"]').textContent = 'Login';
    document.getElementById('toggleAuth').innerHTML = 'Don\'t have an account? <a href="#" id="switchToRegister">Sign In</a> instead';
    document.getElementById('message').textContent = '';
    switchAuthForm();
  }
});

document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'switchToRegister') {
    document.getElementById('authTitle').textContent = 'Register';
    document.querySelector('button[type="submit"]').textContent = 'Register';
    document.getElementById('toggleAuth').innerHTML = 'Already have an account? <a href="#" id="switchToLogin">Login</a> instead';
    document.getElementById('message').textContent = '';
  }
});

function showMessage(message) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = message;
}
