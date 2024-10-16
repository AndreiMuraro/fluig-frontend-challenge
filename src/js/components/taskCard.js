import { DateUtils } from '../../utils/DateUtils.js';

class TaskCard extends HTMLElement {
    task = null;
    onUpdate = () => { };
    onDelete = () => { };

    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    set taskData({ task, onUpdate, onDelete }) {
        this.task = task;
        this.onUpdate = onUpdate;
        this.onDelete = onDelete;
        this.render();
    }

    render() {
        if (!this.task) return;

        this.innerHTML = `
            <div class="card position-relative">
                <div class="card-body">
                    <h6 class="card-title">${this.task.title}</h6>
                    <p class="card-text">${this.task.description || 'Sem descrição'}</p>
                    <div class="card-footer-task d-flex justify-content-between align-items-center">
                        ${this.getDaysInColumn()}
                        ${this.getExpirationInfo()}
                    </div>
                    <div class="position-absolute bottom-0 end-0 p-2">
                        <button class="btn btn-sm btn-link text-primary edit-task me-2" title="Editar tarefa">
                            <i class="bi bi-pencil fw-bold"></i>
                        </button>
                        <button class="btn btn-sm btn-link text-danger delete-task" title="Excluir tarefa">
                            <i class="bi bi-trash fw-bold"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.editButton = this.querySelector('.edit-task');
        this.deleteButton = this.querySelector('.delete-task');

        this.editButton?.addEventListener('click', this.handleEdit);
        this.deleteButton?.addEventListener('click', this.handleDelete);
    }

    removeEventListeners() {
        this.editButton?.removeEventListener('click', this.handleEdit);
        this.deleteButton?.removeEventListener('click', this.handleDelete);
    }

    handleEdit = () => {
        this.onUpdate(this.task.id);
    };

    handleDelete = () => {
        this.onDelete(this.task.id);
    };

    getDaysInColumn() {
        const now = new Date();
        const lastUpdate = new Date(this.task.last_status_update_date);
        const daysInColumn = DateUtils.getDaysBetweenDates(lastUpdate, now);

        if (daysInColumn > 1) {
            return `<span class="text-warning-emphasis">${daysInColumn} dias nesta coluna</span>`;
        } else if (daysInColumn === 1) {
            return `<span class="text-warning-emphasis">1 dia nesta coluna</span>`;
        } else {
            return '';
        }
    }

    getExpirationInfo() {
        if (!this.task.deadline_date) return '';

        const now = new Date();
        const deadline = new Date(this.task.deadline_date);

        const diffTime = deadline - now;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) {
            const pastDays = Math.abs(daysLeft);
            return `<span class="text-danger">Expirou há ${pastDays} ${pastDays === 1 ? 'dia' : 'dias'}</span>`;
        } else if (daysLeft === 0) {
            return `<span class="text-warning">Expira hoje</span>`;
        } else {
            return `<span class="text-success">${daysLeft} ${daysLeft === 1 ? 'dia restante' : 'dias restantes'}</span>`;
        }
    }
}

customElements.define('task-card', TaskCard);

export { TaskCard };
