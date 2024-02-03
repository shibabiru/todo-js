window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Get the form to add a new Todo
	const newTodoForm = document.querySelector('#new-todo-form');

	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();

        const contentError = document.getElementById('content-error');
        const categoryError = document.getElementById('category-error');
    
        const contentInput = e.target.elements.content;
        const categoryInput = e.target.elements.category;
    
        // Check for empty content
        if (contentInput.value.trim() === '') {
            contentError.textContent = 'Content cannot be empty. Please enter a task.';
            return;
        } else {
            contentError.textContent = '';
        }
    
        // Check if a category is selected
        if (!categoryInput.value) {
            categoryError.textContent = 'Please select a category for the task.';
            return;
        } else {
            categoryError.textContent = '';
        }

        // Check if content length is within the limit
        if (contentInput.value.trim().length > 30) {
            contentError.textContent = 'Content cannot exceed 30 characters.';
            return;
        } else {
            contentError.textContent = '';
        }
    
        const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: new Date().getTime()
		}

		todos.push(todo);

		localStorage.setItem('todos', JSON.stringify(todos));

		e.target.reset();

		DisplayTodos();
	})

	DisplayTodos();
})

// Function to display Todos
function DisplayTodos () {
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	todos.forEach(todo => {
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
		if (todo.category == 'Priority') {
			span.classList.add('priority');
		} else {
			span.classList.add('later');
		}
		content.classList.add('todo-content');
		actions.classList.add('actions');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');

		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';

		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);

		if (todo.done) {
			todoItem.classList.add('done');
		}
		
        // Handle changes in the checkbox state
		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem('todos', JSON.stringify(todos));

			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}

			DisplayTodos()

		})
        // Handle clicks on the edit button
		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
				todo.content = e.target.value;
				localStorage.setItem('todos', JSON.stringify(todos));
				DisplayTodos()

			})
		})

        // Handle clicks on the delete button
		deleteButton.addEventListener('click', (e) => {
			todos = todos.filter(t => t != todo);
			localStorage.setItem('todos', JSON.stringify(todos));
			DisplayTodos()
		})

	})
}