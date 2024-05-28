document.addEventListener('DOMContentLoaded', () => { 
    const taskTitle = document.getElementById('taskTitle'); 
    const taskDescription = document.getElementById('taskDescription'); 
    const taskDueDate = document.getElementById('taskDueDate'); 
    const taskPriority = document.getElementById('taskPriority');
    const addTaskButton = document.getElementById('addTaskButton'); 
    const taskList = document.getElementById('taskList');
    const filterTitle = document.getElementById('filterTitle'); 
    const filterDueDate = document.getElementById('filterDueDate');
    const filterPriority = document.getElementById('filterPriority'); 
    const sortTasks = document.getElementById('sortTasks');
    let editId = null;

    addTaskButton.addEventListener('click', () => { 
        const title = taskTitle.value.trim(); 
        const description = taskDescription.value.trim();
        const dueDate = taskDueDate.value;
        const priority = taskPriority.value;
        
        if (!title || !description || !dueDate) { 
            alert('Please fill in all fields');
            return; 
        }
         
        const id = editId || new Date().getTime().toString();
        
        if (editId) {
            document.querySelector(`.taskItem[data-id="${editId}"]`).remove();
            editId = null;
        }
        
        addTask(id, title, description, dueDate, priority);
        saveTasks(); 
        clearInputs(); 
    });

    filterTitle.addEventListener('input', filterAndSortTasks); 
    filterDueDate.addEventListener('change', filterAndSortTasks); 
    filterPriority.addEventListener('change', filterAndSortTasks);
    sortTasks.addEventListener('change', filterAndSortTasks);
    
    function addTask(id, title, description, dueDate, priority) { 
        const taskItem = document.createElement('div'); 
        taskItem.classList.add('taskItem', priority.toLowerCase()); 
        taskItem.setAttribute('data-id', id); 
        taskItem.innerHTML = ` 
        <h3>${title}</h3> 
        <p>${description}</p> 
        <small>Due: ${dueDate}</small> 
        <div class="priority">${priority}</div>
        <div class="actions">
            <button onclick="editTask('${id}')">Edit</button>
            <button onclick="deleteTask('${id}')">Delete</button>
        </div>`;
        
        taskList.appendChild(taskItem); 
    }

    function saveTasks() { 
        const tasks = []; 
        document.querySelectorAll('.taskItem').forEach(taskItem => { 
            tasks.push({ 
                id: taskItem.getAttribute('data-id'), 
                title: taskItem.querySelector('h3').innerText, 
                description: taskItem.querySelector('p').innerText, 
                dueDate: taskItem.querySelector('small').innerText.replace('Due: ', ''),
                priority: taskItem.querySelector('.priority').innerText
            }); 
        }); 
        localStorage.setItem('tasks', JSON.stringify(tasks)); 
    }

    function loadTasks() { 
        const tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
        tasks.forEach(task => addTask(task.id, task.title, task.description, task.dueDate, task.priority)); 
    }

    function clearInputs() { 
        taskTitle.value = ''; 
        taskDescription.value = ''; 
        taskDueDate.value = ''; 
        taskPriority.value = 'Low';
    }

    function filterTasks(tasks) { 
        const titleFilter = filterTitle.value.toLowerCase(); 
        const dueDateFilter = filterDueDate.value;
        const priorityFilter = filterPriority.value;
        
        return tasks.filter(task => { 
            return (titleFilter === '' || task.title.toLowerCase().includes(titleFilter)) && 
                   (dueDateFilter === '' || task.dueDate === dueDateFilter) &&
                   (priorityFilter === '' || task.priority === priorityFilter);
        }); 
    }

    function sortTasksList(tasks) { 
        const sortBy = sortTasks.value; 
        return tasks.sort((a, b) => { 
            if (sortBy === 'alphabetical') { 
                return a.title.localeCompare(b.title);
            } else if (sortBy === 'reverseAlphabetical') { 
                return b.title.localeCompare(a.title); 
            } else if (sortBy === 'soonest') { 
                return new Date(a.dueDate) - new Date(b.dueDate); 
            } else if (sortBy === 'latest') { 
                return new Date(b.dueDate) - new Date(a.dueDate); 
            }
        }); 
    }

    function filterAndSortTasks() { 
        const tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
        let filteredTasks = filterTasks(tasks); 
        filteredTasks = sortTasksList(filteredTasks); 
        taskList.innerHTML = ''; 
        filteredTasks.forEach(task => addTask(task.id, task.title, task.description, task.dueDate, task.priority)); 
    }

    window.editTask = function(id) {
        const task = JSON.parse(localStorage.getItem('tasks')).find(t => t.id === id);
        taskTitle.value = task.title;
        taskDescription.value = task.description;
        taskDueDate.value = task.dueDate;
        taskPriority.value = task.priority;
        editId = id;
    }

    window.deleteTask = function(id) {
        document.querySelector(`.taskItem[data-id="${id}"]`).remove();
        saveTasks();
    }

    loadTasks(); 
});
