import { DateUtils } from '../../utils/DateUtils.js';

class TaskCard extends HTMLElement {
    constructor() {
        super();
        this.task = null;
        this.onUpdate = () => { };
        this.onDelete = () => { };
    }

    connectedCallback() {
        this.render();
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
        const editButton = this.querySelector('.edit-task');
        const deleteButton = this.querySelector('.delete-task');

        if (editButton) {
            editButton.addEventListener('click', () => this.onUpdate(this.task.id));
        }

        if (deleteButton) {
            deleteButton.addEventListener('click', () => this.onDelete(this.task.id));
        }
    }

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
        const daysLeft = DateUtils.getDaysBetweenDates(now, deadline);

        if (daysLeft < 0) {
            const diasPassados = Math.abs(daysLeft);
            return `<span class="text-danger">Expirou há ${diasPassados} ${diasPassados === 1 ? 'dia' : 'dias'}</span>`;
        } else if (daysLeft === 0) {
            return `<span class="text-warning">Expira hoje</span>`;
        } else {
            return `<span class="text-success">${daysLeft} ${daysLeft === 1 ? 'dia restante' : 'dias restantes'}</span>`;
        }
    }
}

customElements.define('task-card', TaskCard);

export { TaskCard };
