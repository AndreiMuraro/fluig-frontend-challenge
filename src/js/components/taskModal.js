class TaskModal extends HTMLElement {
    constructor() {
        super();
        this.modal = null;
        this.isEditMode = false;
        this.formData = null;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div id="modalContainer"></div>
        `;
    }

    getModalTemplate(initialStatus, taskData) {
        const isEditMode = !!taskData;
        return `
            <div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="taskModalLabel">${isEditMode ? 'Editar Tarefa' : 'Nova Tarefa'}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <form id="taskForm" novalidate>
                            <div class="modal-body">
                                <input type="hidden" id="taskId" value="${taskData ? taskData.id : ''}">
                                <!-- Campos do formulário -->
                                <div class="mb-3">
                                    <select class="form-select" id="taskStatus" required>
                                        <option value="0" ${(taskData && taskData.status == 0) || (!taskData && initialStatus == 0) ? 'selected' : ''}>A fazer</option>
                                        <option value="1" ${(taskData && taskData.status == 1) || (!taskData && initialStatus == 1) ? 'selected' : ''}>Fazendo</option>
                                        <option value="2" ${(taskData && taskData.status == 2) || (!taskData && initialStatus == 2) ? 'selected' : ''}>Concluído</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <input type="text" class="form-control" id="taskTitle" placeholder="Insira o nome da tarefa" required value="${taskData ? taskData.title : ''}">
                                    <div class="invalid-feedback">Campo obrigatório.</div>
                                </div>
                                <div class="form-check form-switch mb-3">
                                    <input class="form-check-input" type="checkbox" role="switch" id="enableDeadline" ${taskData && taskData.deadline_date ? 'checked' : ''}>
                                    <label class="form-check-label" for="enableDeadline">Habilitar prazo</label>
                                </div>
                                <div class="mb-3">
                                    <input type="date" class="form-control" id="taskDeadline" ${taskData && taskData.deadline_date ? '' : 'disabled'} value="${taskData && taskData.deadline_date ? taskData.deadline_date.split('T')[0] : ''}">
                                    <div class="invalid-feedback">Campo obrigatório.</div>
                                </div>
                                <div class="mb-3">
                                    <textarea class="form-control" id="taskDescription" rows="5" placeholder="Insira uma descrição">${taskData ? taskData.description : ''}</textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-violet" id="saveTask">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const form = this.querySelector('#taskForm');
        if (!form) return;

        const saveButton = this.querySelector('#saveTask');
        if (saveButton) {
            saveButton.addEventListener('click', (e) => this.handleSave(e));
        }

        const enableDeadline = form.querySelector('#enableDeadline');
        const taskDeadline = form.querySelector('#taskDeadline');

        if (enableDeadline && taskDeadline) {
            enableDeadline.addEventListener('change', (e) => {
                taskDeadline.disabled = !e.target.checked;
                if (e.target.checked && !taskDeadline.value) {
                    const today = new Date().toISOString().split('T')[0];
                    taskDeadline.value = today;
                }
            });
        }

        const modalElement = this.querySelector('#taskModal');
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', () => {
                this.isEditMode = false;
                this.formData = null;
            });
        }
    }

    handleSave(e) {
        e.preventDefault();

        const form = this.querySelector('#taskForm');
        if (form) {
            form.classList.add('was-validated');

            if (form.checkValidity()) {
                this.captureFormData();

                const event = new CustomEvent('taskSubmit', {
                    detail: { ...this.formData, isEditMode: this.isEditMode },
                    bubbles: true,
                    composed: true
                });

                this.dispatchEvent(event);
                this.close();
            }
        }
    }

    captureFormData() {
        const taskId = this.querySelector('#taskId');
        const taskStatus = this.querySelector('#taskStatus');
        const taskTitle = this.querySelector('#taskTitle');
        const taskDescription = this.querySelector('#taskDescription');
        const enableDeadline = this.querySelector('#enableDeadline');
        const taskDeadline = this.querySelector('#taskDeadline');

        if (taskStatus && taskTitle && taskDescription && enableDeadline && taskDeadline) {
            this.formData = {
                ...(this.isEditMode && { id: taskId.value }),
                status: parseInt(taskStatus.value),
                title: taskTitle.value,
                description: taskDescription.value,
                deadline_date: enableDeadline.checked ? taskDeadline.value : null
            };
        }
    }

    open(initialStatus, taskData = null) {
        this.isEditMode = Boolean(taskData);

        const modalContainer = this.querySelector('#modalContainer');
        if (!modalContainer) return;

        modalContainer.innerHTML = this.getModalTemplate(initialStatus, taskData);
        this.setupEventListeners();

        const modalElement = this.querySelector('#taskModal');
        if (!modalElement) return;

        try {
            this.modal = new bootstrap.Modal(modalElement);
            this.modal.show();
        } catch (error) {
            console.error('Erro ao criar ou exibir o modal:', error);
        }
    }

    close() {
        if (this.modal) {
            this.modal.hide();
            setTimeout(() => {
                const modalContainer = this.querySelector('#modalContainer');
                if (modalContainer) {
                    modalContainer.innerHTML = '';
                }
            }, 300);
        }
    }
}

if (!customElements.get('task-modal')) {
    customElements.define('task-modal', TaskModal);
}

export { TaskModal };
