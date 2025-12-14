
export default class Dialog {
    constructor(id, title, content) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.element = null;
    }

    render() {
        if (document.getElementById(this.id)) return; // Already open

        const overlay = document.createElement('div');
        overlay.id = this.id;
        overlay.classList.add('dialog-overlay');

        // Close on click outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });

        const box = document.createElement('div');
        box.classList.add('dialog-box');

        const header = document.createElement('div');
        header.classList.add('dialog-header');
        header.innerHTML = `<h3>${this.title}</h3>`;

        const closeBtn = document.createElement('button');
        closeBtn.classList.add('dialog-close');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => this.close());
        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.classList.add('dialog-body');

        if (typeof this.content === 'string') {
            body.innerHTML = this.content;
        } else if (this.content instanceof HTMLElement) {
            body.appendChild(this.content);
        }

        const footer = document.createElement('div');
        footer.classList.add('dialog-footer');
        // Optional footer content? Let caller handle via content or custom method.
        // For standard dialogs, maybe an OK button?

        box.appendChild(header);
        box.appendChild(body);
        // box.appendChild(footer); // Optional

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        this.element = overlay;

        // Animation
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
            box.classList.add('visible');
        });
    }

    close() {
        if (!this.element) return;
        this.element.classList.remove('visible');
        this.element.querySelector('.dialog-box').classList.remove('visible');

        setTimeout(() => {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            this.element = null;
        }, 300); // Wait for transition
    }
}
