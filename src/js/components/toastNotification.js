class ToastNotification extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const message = this.getAttribute('message') || 'Operação realizada com sucesso!';
        const color = this.getAttribute('color') || 'primary';

        this.render(message, color);
        this.showToast();
    }

    render(message, color = 'success') {
        const customColor = color === 'success' ? '#762BF4' : 'danger';
        this.shadowRoot.innerHTML = `
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" style="position: fixed; bottom: 0; right: 0; margin: 1rem;">
            <div class="toast-body text-white d-flex justify-content-between align-items-center" style="background-color: ${customColor || `var(--bs-${color})`}; border-radius: 0.25rem;">
                <span>${message}</span>
            </div>
        </div>
        `;
    }

    showToast() {
        const duration = 3000;
        const toastElement = this.shadowRoot.querySelector('.toast');
        toastElement.classList.add('show');

        setTimeout(() => {
            toastElement.classList.remove('show');
        }, duration);
    }
}

customElements.define('toast-notification', ToastNotification);

export { ToastNotification };
