import { TaskCard } from './TaskCard.js';

export class TaskColumn extends HTMLElement {
    constructor() {
        super();
        this.column = { title: '', status: 0 }; // Valor padrão
        this.tasks = [];
        this.onNewTask = () => { };
        this.onEditTask = () => { };
        this.onDeleteTask = () => { };
    }

    connectedCallback() {
        if (this.isConnected) {
            this.render();
        }
    } x

    set columnData(data) {
        this.column = data.column || { title: '', status: 0 };
        this.tasks = data.tasks || [];
        this.onNewTask = data.onNewTask || (() => { });
        this.onEditTask = data.onEditTask || (() => { });
        this.onDeleteTask = data.onDeleteTask || (() => { });
        this.render();
    }

    render() {
        const columnTitle = this.column?.title || 'Coluna';
        const columnStatus = this.column?.status ?? 0;
        const tasksCount = this.tasks?.length ?? 0;

        this.innerHTML = `
            <div class="column-content">
                <h5 class="column-title">${columnTitle} (${tasksCount})</h5>
                <button class="btn btn-light mb-3 new-task" data-status="${columnStatus}">Nova tarefa</button>
                <div class="task-list"></div>
            </div>
        `;

        this.renderTasks();
        this.setupEventListeners();
    }

    renderTasks() {
        const taskList = this.querySelector('.task-list');
        if (taskList) {
            taskList.innerHTML = '';
            this.tasks.forEach(task => {
                const taskCardElement = document.createElement('task-card');
                taskCardElement.taskData = {
                    task,
                    onUpdate: this.onEditTask,
                    onDelete: this.onDeleteTask
                };
                taskList.appendChild(taskCardElement);
            });
        }
    }

    setupEventListeners() {
        const newTaskButton = this.querySelector('.new-task');
        if (newTaskButton) {
            newTaskButton.addEventListener('click', () => {
                this.onNewTask(this.column.status);
            });
        }
    }

    updateTasks(newTasks) {
        this.tasks = newTasks;
        this.renderTasks();
        const columnTitle = this.querySelector('.column-title');
        if (columnTitle) {
            columnTitle.textContent = `${this.column.title} (${this.tasks.length})`;
        }
    }
}

customElements.define('task-column', TaskColumn);
