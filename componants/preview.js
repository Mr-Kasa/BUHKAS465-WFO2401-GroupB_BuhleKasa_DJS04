class Preview extends HTMLElement {
  constructor() {
    super();
    console.log("Preview constructor called");

    const template = document.createElement('template');
    template.innerHTML = `
    <link rel="stylesheet" href="./styles.css" />
      <dialog class="overlay">
        <div class="overlay__preview">
          <img class="overlay__blur" data-list-blur src="" />
          <img class="overlay__image" data-list-image src="" />
        </div>
        <div class="overlay__content">
          <h3 class="overlay__title" data-list-title></h3>
          <div class="overlay__data" data-list-subtitle></div>
          <p class="overlay__data overlay__data_secondary" data-list-description></p>
        </div>
        <div class="overlay__row">
          <button class="overlay__button overlay__button_primary" data-list-close>Close</button>
        </div>
      </dialog>
      <div class="backdrop" style="display: none;"></div>
    `;

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.dialog = shadowRoot.querySelector('dialog');
    this.backdrop = shadowRoot.querySelector('.backdrop');
    this.dataListBlur = shadowRoot.querySelector('[data-list-blur]');
    this.dataListImage = shadowRoot.querySelector('[data-list-image]');

    console.log("dataListBlur:", this.dataListBlur);
    console.log("dataListImage:", this.dataListImage);

    const closeButton = shadowRoot.querySelector('[data-list-close]');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }
  }

  open() {
    this.dialog.showModal();
    this.backdrop.style.display = 'block';
  }

  close() {
    this.dialog.close();
    this.backdrop.style.display = 'none';
  }
}

customElements.define('data-list-active', Preview);

export default Preview;
