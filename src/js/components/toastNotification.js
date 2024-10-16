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

    render(message, color) {
        const customColor = color === 'success' ? '#762BF4' : 'danger';
        console.log('customColor', customColor);
        this.shadowRoot.innerHTML = `
            <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" style="position: fixed; bottom: 0; right: 0; margin: 1rem;">
                <div class="toast-body text-white" style="background-color: ${customColor || `var(--bs-${color})`}; border-radius: 0.25rem;">
                    ${message}
                </div>
            </div>
        `;
    }

    showToast() {
        const duration = 3000; // Duração fixa de 3000 milissegundos
        const toastElement = this.shadowRoot.querySelector('.toast');
        toastElement.classList.add('show');

        setTimeout(() => {
            toastElement.classList.remove('show');
        }, duration);

        const closeButton = this.shadowRoot.querySelector('.close');
        closeButton.addEventListener('click', () => {
            toastElement.classList.remove('show');
        });
    }
}

customElements.define('toast-notification', ToastNotification);

export { ToastNotification };
