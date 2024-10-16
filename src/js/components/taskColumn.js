import { TaskCard } from './taskCard.js';

export class TaskColumn extends HTMLElement {
    constructor() {

        super();
        this.column = { title: '', status: 0 };
        this.tasks = [];
    }

    connectedCallback() {
        if (this.isConnected) {
            this.render();
        }
    }

    set columnData({ column = { title: '', status: 0 }, tasks = [], onNewTask = () => { }, onEditTask = () => { }, onDeleteTask = () => { } }) {
        this.column = column;
        this.tasks = tasks;
        this.onNewTask = onNewTask;
        this.onEditTask = onEditTask;
        this.onDeleteTask = onDeleteTask;
        this.render();
    }

    render() {
        const { title = 'Coluna', status = 0 } = this.column;
        const tasksCount = this.tasks.length;

        this.innerHTML = `
            <div class="column-content">
                <h5 class="column-title">${title} (${tasksCount})</h5>
                <button class="btn btn-light mb-3 new-task" data-status="${status}">Nova tarefa</button>
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
