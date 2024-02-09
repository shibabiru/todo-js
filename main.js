window.addEventListener('load', () => {
    todos = JSON.parse(localStorage.getItem('todos')) || [];

    const newTodoForm = document.querySelector('#new-todo-form');
    const contentError = document.getElementById('content-error');
    const categoryError = document.getElementById('category-error');

    const errors = {
        emptyContent: 'Content cannot be empty. Please enter a task.',
        noCategory: 'Please select a category for the task.',
        contentLengthExceed: 'Content cannot exceed 30 characters.',
    };

    newTodoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const contentValue = e.target.elements.content.value.trim();
        const categoryValue = e.target.elements.category.value;

        // Check for empty content
        if (!contentValue) {
            contentError.textContent = errors.emptyContent;
            return;
        }

        // Check if a category is selected
        if (!categoryValue) {
            categoryError.textContent = errors.noCategory;
            return;
        }

        // Check if content length is within the limit
        if (contentValue.length > 30) {
            contentError.textContent = errors.contentLengthExceed;
            return;
        }

        contentError.textContent = '';
        categoryError.textContent = '';

        const todo = {
            content: contentValue,
            category: categoryValue,
            done: false,
            createdAt: new Date().getTime(),
            updatedAt: null,
        };

        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));

        e.target.reset();
        DisplayTodos();
    });

    DisplayTodos();
});

function createTodoElement(todo) {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');

    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const content = document.createElement('div');
    const actions = document.createElement('div');
    const edit = document.createElement('button');
    const deleteButton = document.createElement('button');

    input.type = 'checkbox';
    input.checked = todo.done;
    span.classList.add('bubble');
    span.classList.add(todo.category === 'Priority' ? 'priority' : 'later');
    content.classList.add('todo-content');
    actions.classList.add('actions');
    edit.classList.add('edit');
    deleteButton.classList.add('delete');

    content.innerHTML = `
        <div class="todo-info">
            <input type="text" value="${todo.content}" readonly>
            <div class="time-stamp">
                <p class="created-at">Created: ${new Date(todo.createdAt).toLocaleString()}</p>
                <p class="updated-at">Updated: ${todo.updatedAt ? new Date(todo.updatedAt).toLocaleString() : 'Not updated'}</p>
            </div>
        </div>
    `;
    edit.innerHTML = 'Edit';
    deleteButton.innerHTML = 'Delete';

    label.appendChild(input);
    label.appendChild(span);
    actions.appendChild(edit);
    actions.appendChild(deleteButton);
    todoItem.appendChild(label);
    todoItem.appendChild(content);
    todoItem.appendChild(actions);

    if (todo.done) {
        todoItem.classList.add('done');
    }

    return todoItem;
}

function attachEventListeners(todoItem, todo) {
    const input = todoItem.querySelector('input');
    const edit = todoItem.querySelector('.edit');
    const deleteButton = todoItem.querySelector('.delete');

    input.addEventListener('change', () => {
        todo.done = input.checked;
        todo.updatedAt = new Date().getTime();
        localStorage.setItem('todos', JSON.stringify(todos));

        if (todo.done) {
            todoItem.classList.add('done');
        } else {
            todoItem.classList.remove('done');
        }

        DisplayTodos();
    });

    edit.addEventListener('click', () => {
        const inputField = todoItem.querySelector('input[type="text"]');
        inputField.removeAttribute('readonly');
        inputField.focus();
        inputField.addEventListener('blur', () => {
            inputField.setAttribute('readonly', true);
            todo.content = inputField.value;
            todo.updatedAt = new Date().getTime();
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        });
    });

    deleteButton.addEventListener('click', () => {
        todos = todos.filter(t => t !== todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        DisplayTodos();
    });
}

function DisplayTodos(categoryFilter = null) {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = "";

    const filteredTodos = categoryFilter
        ? todos.filter(todo => todo.category === categoryFilter)
        : todos;
    const viewAll = document.querySelector('.view-all');

    filteredTodos.forEach(todo => {
        const todoItem = createTodoElement(todo);
        attachEventListeners(todoItem, todo);

        todoList.appendChild(todoItem);
    });

    // Handle the click event listeners for category buttons
    document.querySelectorAll('.view-category').forEach(button => {
        button.addEventListener('click', function () {
            const category = this.dataset.category;
            DisplayTodos(category);
        });
    });

    // Handle the click event for the all button
    viewAll.addEventListener('click', () => {
        DisplayTodos();
    });
}