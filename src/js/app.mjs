import TaskService from './services/taskService.js';
import { TaskModal } from './components/taskModal.js';
import { TaskColumn } from './components/taskColumn.js';
import { ToastNotification } from './components/toastNotification.js';

class App {
    constructor() {
        this.columns = [
            { title: 'A fazer', status: 0 },
            { title: 'Fazendo', status: 1 },
            { title: 'Concluído', status: 2 }
        ];
        this.tasks = [];
        this.boardElement = document.getElementById('board');
        this.taskModal = document.querySelector('task-modal') || document.createElement('task-modal');
        if (!this.taskModal.parentElement) {
            document.body.appendChild(this.taskModal);
        }
        this.setupEventListeners();
        this.init();
    }

    async init() {
        await this.loadTasks();
        this.render();
    }

    setupEventListeners() {
        this.taskModal.addEventListener('taskSubmit', this.handleTaskSubmit.bind(this));

        const searchForm = document.querySelector('form[role="search"]');
        const searchInput = searchForm.querySelector('input[type="search"]');
        const searchButton = searchForm.querySelector('button[type="button"]');

        const handleSearch = (e) => {
            e.preventDefault();
            this.searchTasks(searchInput.value);
        };

        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch(e);
            }
        });
    }

    async loadTasks() {
        try {
            this.tasks = await TaskService.getTasks();
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
        }
    }

    render(tasks = this.tasks) {
        this.boardElement.innerHTML = `
            <div class="row g-4">
                ${this.columns.map(column => `
                    <div class="col-12 col-md-4">
                        <task-column id="column-${column.status}"></task-column>
                    </div>
                `).join('')}
            </div>
        `;

        this.columns.forEach(column => {
            const columnElement = this.boardElement.querySelector(`#column-${column.status}`);
            const columnTasks = tasks.filter(task => task.status === column.status);

            columnElement.column = column;
            columnElement.tasks = columnTasks;
            columnElement.onNewTask = this.openNewTaskModal.bind(this);
            columnElement.onEditTask = this.openEditTaskModal.bind(this);
            columnElement.onDeleteTask = this.deleteTask.bind(this);

            columnElement.render();
        });
    }

    openNewTaskModal(status) {
        this.taskModal.open(status);
    }

    openEditTaskModal(taskId) {
        const taskToEdit = this.tasks.find(task => task.id === taskId);
        if (taskToEdit) {
            this.taskModal.open(taskToEdit.status, taskToEdit);
        }
    }

    async handleTaskSubmit(event) {
        event.preventDefault();
        const { isEditMode, ...taskData } = event.detail;
        try {
            if (isEditMode) {
                await this.updateTask(taskData.id, taskData);
            } else {
                await this.createTask(taskData);
            }
        } catch (error) {
            console.error('Erro ao processar tarefa:', error);
            this.showToast('Erro ao processar tarefa!', 'danger');
        } finally {
            this.render();
        }
    }

    async createTask(taskData) {
        try {
            const createdTask = await TaskService.createTask(taskData);
            this.tasks.push(createdTask);
            this.render();

            this.showToast('Tarefa criada com sucesso!', '762BF4');
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            this.showToast('Erro ao criar tarefa!', 'danger');
        }
    }

    async updateTask(taskId, updatedData) {
        try {
            const updatedTask = await TaskService.updateTask(taskId, updatedData);
            const index = this.tasks.findIndex(task => task.id === taskId);
            if (index !== -1) {
                this.tasks[index] = updatedTask;
            }
            this.render();

            this.showToast('Tarefa atualizada com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            this.showToast('Erro ao atualizar tarefa!', 'danger');
        }
    }

    async deleteTask(taskId) {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            try {
                await TaskService.deleteTask(taskId);
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.render();

                this.showToast('Tarefa excluída com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao deletar tarefa:', error);
                this.showToast('Erro ao deletar tarefa!', 'danger');
            }
        }
    }

    showToast(message, color) {
        const toast = document.createElement('toast-notification');
        toast.setAttribute('message', message);
        toast.setAttribute('color', color);
        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    }

    searchTasks(query) {
        const filteredTasks = this.tasks.filter(task =>
            task.title.toLowerCase().includes(query.toLowerCase())
        );
        this.render(filteredTasks);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});

export default App;
